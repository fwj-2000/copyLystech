<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleAddFn">{{ t('dict.WarehouseFlowNode.WarehouseApply') }}</a-button>
            <a-button v-auth="'btn_recall'" type="primary" ghost @click="handleReject">{{ t('common.revoke') }}</a-button>
            <a-button v-auth="'btn_stop'" type="primary" ghost @click="handleStop">{{ t('common.stopText') }}</a-button>
            <a-button @click="handleDelete" v-auth="'btn_batchRemove'">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="openNodeRecordModalFn(row)" v-auth="'btn_detail'">{{ t('common.viewDetails') }} </span>
          </template>
        </Grid>
      </div>
    </div>
    <DetailPop @register="registerDetailPop"></DetailPop>
    <AddPop @register="registerAddPop" @reload="reload"></AddPop>
    <NodeModal @register="registerNodeRecord" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { COLUMNS, formConfig } from './config';
  import { transferFilling } from '/@/api/customerSerivce/fillingDemand';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import DetailPop from './components/DetailPop.vue';
  import AddPop from './components/AddPop.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { getWarehouse, bulkWithdraw, bulkStop, bulkDelete } from '/@/api/warehouse/warehouse';
  import { useModal } from '/@/components/Modal';
  import { NodeModal } from '/@/components/CustomComponents';
  import { getNodelist } from '/@/api/engineering/mould';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  defineOptions({ name: 'warehouseManagement-warehouseManagement' });
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  // const [registerTable, { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys }] = useTable({
  //   api: getWarehouse,
  //   columns: COLUMNS,
  //   useSearchForm: true,
  //   striped: true,
  //   ellipsis: true,
  //   rowSelection: { type: 'checkbox' },
  //   clickToRowSelect: false,
  //   actionColumn: {
  //     width: 100,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   showIndexColumn: false,
  //   isCanResizeParent: true,
  //   canResize: true,
  //   pagination: {
  //     pageSize: 100,
  //   },
  //   formConfig: formConfig as any,
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      // fieldMappingTime: [['date', ['start', 'end']]],
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formConfig as any,
      // i18nConfig: {
      //   moduleCode: 'UnitColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'warehouseManagement-warehousing-list',
      columns: COLUMNS,
      striped: true,
      bordered: true,
      ellipsis: true,
      showTableSetting: true,
      useSearchForm: true,
      api: getWarehouse,
      showIndexColumn: true,
      clickToRowSelect: false,
      pagerConfig: {
        autoHidden: false,
      },
      tableSetting: {
        delStatus: true,
      },
      isCanResizeParent: true,
      canResize: true,
      pagination: {
        pageSize: 100,
      },
      // transformCellText: ({ text }) => formatTableDefaultText(text),
      // i18nConfig: {
      //   moduleCode: 'UnitColumn',
      // },
    },
  });

  const { getSelectRowKeys, getSelectRows, reload, clearSelectedRowKeys } = gridApi;

  function handleAddFn() {
    openAddPop(true, {
      title: t('dict.WarehouseFlowNode.WarehouseApply'),
    });
  }

  function openNodeRecordModalFn(record: any = '') {
    openNodeRecordModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  async function handleStop() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.checkOperationText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `是否确认终止?`,
      onOk: async () => {
        try {
          const { code, msg } = await bulkStop(ids);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleReject is error ');
        }
      },
      onCancel: () => {},
    });
  }

  async function handleReject() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.checkOperationText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `是否确认撤回?`,
      onOk: async () => {
        try {
          const { code, msg } = await bulkWithdraw(ids);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleReject is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function deleteFn({ id }) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `确定删除数据吗?`,
      onOk: async () => {
        try {
          const { code, msg } = await bulkDelete([id]);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleReject is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function goEdit(record) {
    openAddPop(true, {
      title: '编辑',
      data: cloneDeep(record),
    });
  }
  function goDetail(record) {
    openDetailPop(true, {
      title: '入库申请详情',
      data: [record],
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: deleteFn.bind(null, record),
        auth: 'btn_remove',
      },
    ];
  }

  // async function handleDelete() {
  //   const ids = getSelectRowKeys();
  //   if (ids && ids.length === 0) {
  //     return message.warning(t('common.deleteObjectText'));
  //   }
  //   try {
  //     const { data, code, msg } = await bulkDelete(ids);
  //     if (code === 200) {
  //       message.success(msg);
  //       clearSelectedRowKeys();
  //       return reload();
  //     }
  //     message.error(msg);
  //   } catch (error) {
  //     throw new Error('handleReject is error ');
  //   }
  // }

  async function handleDelete() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.warning(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await bulkDelete(selectKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  onMounted(() => {
    reload();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
