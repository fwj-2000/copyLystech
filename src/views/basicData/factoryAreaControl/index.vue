<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="handleAdd"> {{ t('common.add2Text') }} </a-button>
              <a-button v-auth="'btn_batchRemove'" danger @click="handleBatchDelete"> {{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <FormModal @register="registerFormModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import type { OrigincountryItem } from '/@/api/basicData/originCountry';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema } from './config';
  import { getFactoryAreaControlList, bulkDeleteFactoryAreaControl } from '/@/api/basicData/factoryAreaControl';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import FormModal from './components/formModal.vue';

  defineOptions({ name: 'basicData-factoryAreaControl' });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerFormModal, { openModal: openFormModal }] = useModal();
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema,
    },
    gridOptions: {
      id: 'basicData-factoryAreaControl-list',
      columns,
      api: getFactoryAreaControlList,
      keyboardConfig: {
        isBack: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      pagerConfig: {
        autoHidden: false,
      },
    },
  });

  function getTableActions(record: OrigincountryItem) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
      },
    ];
  }

  function reload() {
    gridApi.reload();
  }

  function handleEdit(row: OrigincountryItem) {
    openFormModal(true, row);
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  function handleBatchDelete() {
    const checkedList = gridApi!.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDeleteFactoryAreaControl(checkedList.map(item => item.id))
          .then(res => {
            createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(reload),
    });
  }
</script>
