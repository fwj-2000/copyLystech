<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_use'" @click="handleReview">{{ t('common.useDone') }} </a-button>
                <a-button type="primary" ghost v-auth="'btn_prinf'" @click="handlePrint">{{ t('common.printText') }}</a-button>
                <!-- <a-button type="primary" ghost v-auth="'btn_reject'" @click="handleReview">{{ t('common.rejectText') }}</a-button> -->
                <!-- <a-button v-auth="'btn_transfer'" @click="handleExport">{{ t('common.transfer') }} </a-button> -->
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
            </GridTodo>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <!-- <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton> -->
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <ReviewModal @register="registerReviewModal" @reload="refresh" />
    <PrintTablePopup @register="registerPrintTablePopup" @reload="refresh" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, nextTick } from 'vue';
  import { schemaLists, columns, agreeColumn, printColumn } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { getMoidUsedList, exportExcel, bulkBackReview, bulkBackConfirm } from '/@/api/productionDeal/moIdUsed';
  import { getNodeList } from '/@/api/productionDeal/moIdUse';
  import { useModal } from '/@/components/Modal';
  // import { usePopup } from '/@/components/Popup';
  import { NodeModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  // import { ModelConfirmButton } from '/@/components/Button';
  // import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ReviewModal from '/@/views/productionDeal/mouldBusiness/useAudit/components/ReviewModal.vue';
  import { PrintTablePopup } from '/@/components/Print';
  import { usePopup } from '/@/components/Popup';

  defineOptions({ name: 'productionDeal-mouldBusiness-used' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerReviewModal, { openModal: openReviewModal }] = useModal();
  const [registerPrintTablePopup, { openPopup: openPrintTablePopup }] = usePopup();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });

  const tableConfig: any = {
    api: getMoidUsedList,
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
    toolbarConfig: {
      superQuery: true,
    },
  };
  const formConfig = {
    commonConfig: {
      labelClass: 'w-0',
    },
    showCollapseButton: false,
    wrapperClass: 'grid grid-cols-6 gap-1',
    schema: schemaLists,
    // i18nConfig: {
    //   moduleCode: 'MoldReceiveRefundColumn',
    //   transferRange: ['placeholder'],
    // },
  };
  const [
    GridTodo,
    {
      reload: reloadTodo,
      getFetchParams: getFetchParamsTodo,
      getSelectRowKeys: getSelectRowKeysTodo,
      clearSelectedRowKeys: clearSelectedRowKeysTodo,
      getSelectRows,
    },
  ] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'productionDeal-mouldBusiness-used',
      columns,
    },
  });
  const [
    GridDone,
    { reload: reloadDone, getFetchParams: getFetchParamsDone, getSelectRowKeys: getSelectRowKeysDone, clearSelectedRowKeys: clearSelectedRowKeysDone },
  ] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'productionDeal-mouldBusiness-used-done',
      columns,
    },
  });

  // 适配多个tab的方法
  function reload() {
    // switch (state.activeKey) {
    //   case '1':
    //     return reloadTodo();
    //   default:
    //     return reloadDone();
    // }
    if (state.activeKey === '1') {
      return reloadTodo();
    }
    return reloadDone();
  }
  function getFetchParams() {
    // switch (state.activeKey) {
    //   case '1':
    //     return getFetchParamsTodo();
    //   default:
    //     return getFetchParamsDone();
    // }
    if (state.activeKey === '1') {
      return getFetchParamsTodo();
    }
    return getFetchParamsDone();
  }
  function getSelectRowKeys() {
    // switch (state.activeKey) {
    //   case '1':
    //     return getSelectRowKeysTodo();
    //   default:
    //     return getSelectRowKeysDone();
    // }
    if (state.activeKey === '1') {
      return getSelectRowKeysTodo();
    }
    return getSelectRowKeysDone();
  }
  function clearSelectedRowKeys() {
    // switch (state.activeKey) {
    //   case '1':
    //     return clearSelectedRowKeysTodo();
    //   default:
    //     return clearSelectedRowKeysDone();
    // }
    if (state.activeKey === '1') {
      return clearSelectedRowKeysTodo();
    }
    return clearSelectedRowKeysDone();
  }

  // 刷新页面
  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  // 确认领用
  function handleReview() {
    const rows = getSelectRows() || [];
    if (rows.length) {
      openReviewModal(true, {
        list: rows,
        mode: 'review',
        columns: agreeColumn,
        title: t('common.useDone'),
        api: bulkBackConfirm,
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  // 打印
  function handlePrint() {
    const rows = getSelectRows();
    if (!rows.length) {
      return createMessage.info(t('common.selectText'));
    }
    openPrintTablePopup(true, {
      list: getSelectRows(),
      columns: printColumn,
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }
  // 批量导出
  function handleExport() {
    const exportColumns = cloneDeep(columns).filter(el => !el.type);
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: exportColumns,
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
  // 撤回
  async function handleRecall() {
    handleSelectData(bulkBackReview);
  }

  // const route = useRoute();
  // onMounted(() => {
  //   const { id, tab } = route.query as any;
  //   if (id && tab) {
  //     state.activeKey = tab;
  //     nextTick(() => {
  //       handleDetail(id);
  //     });
  //   }
  // });
  // useRouteParams({ id: {}, tab: {} }, params => {
  //   const { id, tab } = params;
  //   if (id && tab) {
  //     state.activeKey = tab;
  //     nextTick(() => {
  //       handleDetail(id);
  //     });
  //   } else if (params.id) {
  //     nextTick(() => {
  //       openDetail(true, {
  //         index: 0,
  //         ids: [id],
  //       });
  //     });
  //   }
  // });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
