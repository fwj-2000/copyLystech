<template>
  <Grid style="height: 450px">
    <template #action="{ row, $rowIndex }">
      <TableAction outside :actions="getActions(row, $rowIndex)" />
    </template>
  </Grid>
</template>

<script lang="ts" setup>
  import { TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { editRules } from '../config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();

  const emit = defineEmits(['reload', 'updateList']);

  const columns = [
    { title: '序号', type: 'seq', field: 'index', width: 50 },
    {
      title: '客户产品阶段',
      field: 'customerProductStage',
      editRender: {
        name: 'input',
      },
      i18nField: 'CustomerProductStage',
    },
    {
      title: '内部产品阶段',
      field: 'internalProductStage',
      editRender: {
        name: 'input',
      },
      i18nField: 'InternalProductStage',
    },

    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];

  const [Grid, { reloadData, remove, validate, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      columns,
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
    gridEvents: {
      editClosed: () => {
        emit('updateList', getDataSource());
      },
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

  const setTableData = async data => {
    await reloadData(data);
  };

  defineExpose({
    setTableData,
    validate,
  });
</script>
