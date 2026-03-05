<template>
  <GridTodo>
    <template #toolbar-actions>
      <a-button type="primary" ghost v-auth="'btn_backed'" @click="handleReview('receipt')">{{ t('common.confirmReceipt') }}</a-button>
      <a-button type="primary" ghost v-auth="'btn_reject'" @click="handleReview('reject')">{{ t('common.rejectText') }}</a-button>
      <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
    </template>
    <template #nodeDetail="{ row }">
      <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
    </template>
  </GridTodo>
  <NodeModal @register="registerNodeModal"></NodeModal>
  <ExportModal @register="registerExportModal" />
  <ReviewModal @register="registerReviewModal" @reload="refresh" />
</template>

<script lang="ts" setup>
  // import { ActionItem, TableAction } from '/@/components/Table';
  import { schemaLists, toBackColumns, agreeColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUseBackList, exportExcel, bulkBackReject, getNodeList, BulkBackConfirmRefund } from '/@/api/productionDeal/moIdUseBack';
  import { useModal } from '/@/components/Modal';
  import { NodeModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  // import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ReviewModal from '/@/views/productionDeal/mouldBusiness/useAudit/components/ReviewModal.vue';

  defineOptions({ name: 'warehouse-mouldBusiness-useBack' });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerReviewModal, { openModal: openReviewModal }] = useModal();

  const props = defineProps({
    idKey: {
      type: String,
      default: '2',
    },
  });

  const tableConfig: any = {
    api: getUseBackList,
    beforeFetch: params => {
      params.identification = props.idKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
  };
  const formConfig = {
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: schemaLists,
    // i18nConfig: {
    //   moduleCode: 'MoldReceiveRefundColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const [GridTodo, { reload, getFetchParams, getSelectRowKeys, clearSelectedRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'warehouse-mouldBusiness-useBack-todo',
      columns: toBackColumns(),
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  // 刷新页面
  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  // 处理动作
  function handleReview(type: 'used' | 'reject' | 'receipt') {
    const rows = getSelectRows() || [];
    if (rows.length) {
      const params: any = {
        list: rows,
        mode: 'review',
      };
      switch (type) {
        // 接收
        case 'receipt':
          params.title = t('common.confirmReceipt');
          params.api = BulkBackConfirmRefund;
          params.columns = agreeColumn;
          break;
        // 驳回
        case 'reject':
          params.title = t('common.rejectText');
          params.api = bulkBackReject;
          params.columns = agreeColumn.concat([
            {
              title: t('common.reasonText'),
              field: 'reason',
              editRender: {
                name: 'Input',
              },
            },
          ]);
          params.beforeFetch = _rows => {
            return _rows.map(el => {
              return {
                id: el.id,
                rejectRemark: el.reason,
                nodeId: '',
              };
            });
          };
          break;
      }
      openReviewModal(true, params);
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  // 查看详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }
  // 批量导出
  function handleExport() {
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
        identification: props.idKey,
      },
      exportOptions: toBackColumns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
  }
</script>
