<template>
  <GridTodo>
    <template #toolbar-actions>
      <a-button type="primary" v-auth="'btn_match'" @click="handleMatchNum"> {{ t('common.matchNum') }} </a-button>
      <a-button type="primary" ghost v-auth="'btn_used'" @click="handleReview('used')">{{ t('common.confirmUsed') }}</a-button>
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
  import { schemaLists, toUseColumns, agreeColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUseBackList, exportExcel, bulkBackMatch, bulkBackConfirmReceive, bulkBackReject, getNodeList } from '/@/api/productionDeal/moIdUseBack';
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
      default: '1',
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
      columns: toUseColumns(),
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
        // 确认发放
        case 'used':
          params.title = t('common.confirmUsed');
          params.api = bulkBackConfirmReceive;
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
      exportOptions: toUseColumns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
  }

  async function handleSelectData(method) {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      }
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  // 匹配货架号
  function handleMatchNum() {
    handleSelectData(bulkBackMatch);
  }
</script>
