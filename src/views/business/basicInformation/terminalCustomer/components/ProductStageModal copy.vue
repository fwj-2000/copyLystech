<template>
  <BasicModal
    :title="t('dict.CommonCol.productStageMaintenance')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="1000"
    @register="registerModal"
    @ok="handleSubmit"
    destroy-on-close
    :showOkBtn="true"
    :cancelText="t('common.closeText')">
    <Grid style="height: 500px">
      <template #action="{ row, $rowIndex }">
        <TableAction outside :actions="getActions(row, $rowIndex)" />
      </template>
    </Grid>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ProductStageColumn, getProductStageColumn, editRules } from '../config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProductStageList, productStageCreateOrUpdate } from '/@/api/business/terminalCustomer';
  const { t } = useI18n();

  const emit = defineEmits(['reload']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(initData);
  const { createMessage } = useMessage();

  const [Grid, { reloadData, remove, validate, getDataSource, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      // columns: ProductStageColumn,
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'click',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      editRules,
    },
  });

  function getActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-copy text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.copy'),
        onClick: handleChangeTable.bind(null, 'copy', row, index),
      },
      {
        icon: 'icon-ym icon-ym-delete text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.delText'),
        onClick: handleChangeTable.bind(null, 'delete', row, index),
      },
    ];
  }

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', row, index) {
    const tableData = getDataSource();

    switch (type) {
      case 'copy': {
        const copyRowData = cloneDeep({ ...row, _X_ROW_KEY: buildUUID(), id: '' });
        tableData.splice(index + 1, 0, copyRowData);
        reloadData(tableData);
        emit('updateList', tableData);
        break;
      }

      case 'delete': {
        remove(row);
        emit('updateList', getDataSource());
        break;
      }

      case 'update': {
        break;
      }
    }
  }

  const handleSubmit = async () => {
    if (await validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const list = getDataSource().map(item => {
      return {
        id: item.id,
        terminalCustomerId: item.terminalCustomerId,
        customerProductStage: item.customerProductStage,
        internalProductStage: item.internalProductStage,
        productLineCode: item.productLineCode,
      };
    });
    changeLoading(true);
    const { code, msg } = await productStageCreateOrUpdate(list).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closeModal();
      return;
    }
    createMessage.error(msg);
  };

  async function initData(row) {
    reloadColumn(getProductStageColumn(row.mainProcess));
    const { data } = await getProductStageList({ terminalCustomerId: row.id });
    if (data && data.length) {
      reloadData(data);
    } else {
      const { id, terminalCustomerCode, terminalCustomerName, terminalCustomerFullName } = row;
      reloadData([
        {
          ...row,
          id: '',
          terminalCustomerId: id,
          code: terminalCustomerCode,
          name: terminalCustomerName,
          fullName: terminalCustomerFullName,
          productLineName: '',
        },
      ]);
    }
  }
</script>
