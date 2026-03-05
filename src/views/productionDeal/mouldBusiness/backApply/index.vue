<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('dict.backList')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_add'" @click="handleApply">{{ t('dict.MoldRefundApplyColumn') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </GridTodo>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.submitTodo')">
            <GridToAdd>
              <template #toolbar-actions>
                <a-button type="primary" danger v-auth="'btn_stop'" @click="handleStop"> {{ t('common.stopText') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #moldRefundApplyNo="{ row }">
                <span class="table-a" @click="handleDetail(row, 'edit')"> {{ row.moldRefundApplyNo }} </span>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </GridToAdd>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_print'" @click="handlePrint"> {{ t('common.printText') }} </a-button>
                <ModelConfirmButton
                  type="primary"
                  ghost
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
                <a-button type="primary" ghost danger v-auth="'btn_stop'" @click="handleStop"> {{ t('common.stopText') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #moldRefundApplyNo="{ row }">
                <span class="table-a" @click="handleDetail(row)"> {{ row.moldRefundApplyNo }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row, 'view')" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <StopModal @register="registerStopModal" @reload="refresh" />
    <ApplyPopup @register="registerApply" @reload="refresh"></ApplyPopup>
    <PrintTablePopup @register="registerPrintTablePopup" @reload="refresh" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, nextTick } from 'vue';
  import { schemaList, columns, columnsToSubmit, columnsDone, printColumn, columnsToHandle } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { getMoldRefundList, exportMoldRefund, terminateMoldRefund, withdrawMoldRefund, getProcessNodes } from '/@/api/productionDeal/moIdBackApply';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './components/ApplyPopup.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  // import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PrintTablePopup } from '/@/components/Print';

  defineOptions({ name: 'productionDeal-mouldBusiness-backApply' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerApply, { openPopup: openApply }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerPrintTablePopup, { openPopup: openPrintTablePopup }] = usePopup();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });

  const tableConfig: any = {
    api: getMoldRefundList,
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
    wrapperClass: 'grid grid-cols-5 gap-1',
    showCollapseButton: false,
    collapsed: false,
    schema: schemaList,
    autocomplete: 'on',
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
      id: 'productionDeal-mouldBusiness-backApply-todo',
      columns: columnsToHandle(),
    },
  });
  const [
    GridToAdd,
    {
      reload: reloadToAdd,
      getFetchParams: getFetchParamsToAdd,
      getSelectRowKeys: getSelectRowKeysToAdd,
      clearSelectedRowKeys: clearSelectedRowKeysToAdd,
      getSelectRows: getSelectRowsToAdd,
    },
  ] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'productionDeal-mouldBusiness-backApply-add',
      columns: columnsToSubmit(),
    },
  });
  const [
    GridDone,
    {
      reload: reloadDone,
      getFetchParams: getFetchParamsDone,
      getSelectRowKeys: getSelectRowKeysDone,
      clearSelectedRowKeys: clearSelectedRowKeysDone,
      getSelectRows: getSelectRowsDone,
    },
  ] = useVbenVxeGrid({
    formOptions: formConfig,
    gridOptions: {
      ...tableConfig,
      id: 'productionDeal-mouldBusiness-backApply-done',
      columns: columnsDone(),
    },
  });

  // 适配多个tab的方法
  function reload() {
    switch (state.activeKey) {
      case '1':
        return reloadTodo();
      case '2':
        return reloadToAdd();
      default:
        return reloadDone();
    }
  }
  function getFetchParams() {
    switch (state.activeKey) {
      case '1':
        return getFetchParamsTodo();
      case '2':
        return getFetchParamsToAdd();
      default:
        return getFetchParamsDone();
    }
  }
  function getSelectRowKeys() {
    switch (state.activeKey) {
      case '1':
        return getSelectRowKeysTodo();
      case '2':
        return getSelectRowKeysToAdd();
      default:
        return getSelectRowKeysDone();
    }
  }
  function clearSelectedRowKeys() {
    switch (state.activeKey) {
      case '1':
        return clearSelectedRowKeysTodo();
      case '2':
        return clearSelectedRowKeysToAdd();
      default:
        return clearSelectedRowKeysDone();
    }
  }

  // 刷新页面
  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  function getActions(record, modeType?: 'edit' | 'view' = 'edit'): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record, modeType),
      },
    ];
  }
  function handleDetail(record, mode?: string) {
    let idList = getSelectRowKeys();
    if (record.id) {
      idList = [record.id];
    }
    if (idList.length && !!idList[0]) {
      openApply(true, {
        ids: idList,
        mode: mode || 'view',
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }
  // 新增
  function handleApply() {
    const rows = getSelectRowKeys() || [];
    if (rows.length) {
      openApply(true, {
        ids: rows,
        mode: 'add',
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getProcessNodes,
      id: record.id,
    });
  }
  // 批量导出
  function handleExport() {
    openExportModal(true, {
      api: exportMoldRefund,
      listQuery: {
        ...getFetchParams(),
        identification: state.activeKey,
      },
      exportOptions: columns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
  }

  // 打印
  function handlePrint() {
    const rows = getSelectRowsDone();
    if (!rows.length) {
      return createMessage.info(t('common.selectText'));
    }
    openPrintTablePopup(true, {
      list: rows,
      columns: printColumn,
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
    handleSelectData(withdrawMoldRefund);
  }

  //  终止
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openStopModal(true, {
        api: terminateMoldRefund,
        required: true,
        ids: idList,
        beforeFetch: params => {
          return {
            terminationRemarks: params.remark,
            ids: idList,
          };
        },
      });
    }
    createMessage.info(t('common.selectText'));
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
