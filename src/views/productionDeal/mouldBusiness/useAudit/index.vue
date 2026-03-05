<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_agree'" @click="handleReview('agree')">{{ t('common.agree') }} </a-button>
                <a-button type="primary" ghost v-auth="'btn_reject'" @click="handleReview('reject')">{{ t('common.rejectText') }}</a-button>
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
                <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton>
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
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, nextTick } from 'vue';
  import { columns, agreeColumn } from './config';
  import { schemaList } from '/@/views/productionDeal/mouldBusiness/use/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { getMoidAuditList, exportExcel, bulkBackReject, bulkBackAgree, bulkBackReview } from '/@/api/productionDeal/moIdUseAudit';
  import { getNodeList } from '/@/api/productionDeal/moIdUse';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { NodeModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  // import { useRoute } from 'vue-router';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ReviewModal from './components/ReviewModal.vue';

  defineOptions({ name: 'productionDeal-mouldBusiness-useAudit' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerReviewModal, { openModal: openReviewModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });

  const tableConfig: any = {
    api: getMoidAuditList,
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
    wrapperClass: 'grid grid-cols-4 gap-1',
    routeConfig: {
      enabled: true,
    },
    schema: [
      {
        fieldName: 'moldReceiveApplyNo',
        routeField: 'billNo',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '模具领用单号',
        },
      },
    ].concat(schemaList),
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
      setFieldValue: setFieldValueTodo,
    },
  ] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'productionDeal-mouldBusiness-useAudit-todo',
      columns,
    },
  });
  const [
    GridDone,
    {
      reload: reloadDone,
      getFetchParams: getFetchParamsDone,
      getSelectRowKeys: getSelectRowKeysDone,
      clearSelectedRowKeys: clearSelectedRowKeysDone,
      setFieldValue: setFieldValueDone,
    },
  ] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'productionDeal-mouldBusiness-useAudit-done',
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
  function setFieldValue(key, value) {
    // switch (state.activeKey) {
    //   case '1':
    //     return setFieldValueTodo(key, value);
    //   default:
    //     return setFieldValueDone(key, value);
    // }
    if (state.activeKey === '1') {
      return setFieldValueTodo(key, value);
    }
    return setFieldValueDone(key, value);
  }

  // 刷新页面
  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  // 处理动作
  function handleReview(type: 'reject' | 'agree') {
    const rows = getSelectRows() || [];
    if (rows.length) {
      const params: any = {
        list: rows,
        mode: 'review',
      };
      switch (type) {
        // 同意
        case 'agree':
          params.title = t('common.agree');
          params.api = bulkBackAgree;
          params.columns = agreeColumn;
          break;
        // 驳回
        case 'reject':
          params.title = t('common.rejectText');
          params.api = bulkBackReject;
          params.columns = agreeColumn.concat([
            {
              title: t('common.rejectReson'),
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
  // function handleReview(type) {
  //   const idList = getSelectRows() || [];
  //   if (idList.length) {

  //     openReviewModal(true, {
  //       list: idList,
  //       mode: 'review',
  //       columns: agreeColumn,
  //       title: type == 'agree' ? t('common.agree') : t('common.rejectText'),
  //       api: type == 'agree' ? bulkBackAgree : bulkBackReject,
  //     });
  //   } else {
  //     createMessage.info(t('common.selectText'));
  //   }
  // }

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

  useRouteParams({ applyNo: {}, tab: {} }, params => {
    const { applyNo, tab } = params;
    if (applyNo && tab) {
      state.activeKey = tab;
      nextTick(() => {
        setFieldValue('moldReceiveApplyNo', applyNo);
        reload();
      });
    }
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
