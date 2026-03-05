<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_prod'" @click="handleGenerate">{{ t('dict.PCCApplyColumn.generate') }} </a-button>
                <a-button type="primary" ghost v-auth="'btn_add'" @click="openApply(true, {})">{{ t('common.addText') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
                <a-button v-auth="'btn_upload'" @click="handleImport">{{ t('common.batchImport') }} </a-button>
              </template>
            </GridTodo>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.submitTodo')">
            <GridToAdd>
              <template #toolbar-actions>
                <a-button type="primary" danger v-auth="'btn_stop'" @click="handleStop"> {{ t('common.stopText') }} </a-button>
                <ModelConfirmButton
                  type="primary"
                  ghost
                  danger
                  v-auth="'btn_batchRemove'"
                  v-bind="{
                    modelConfirm: {
                      onOk: handleDel.bind(null),
                    },
                  }">
                  <span>{{ t('common.batchDelText') }} </span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #moldReceiveApplyNo="{ row }">
                <span class="table-a" @click="handleDetail(row, 'edit', true)">{{ row.moldReceiveApplyNo }}</span>
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
    <GeneratePopup @register="registerGenerate" @reload="refresh" />
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
    <ApplyPopup @register="registerApply" @reload="refresh"></ApplyPopup>
    <PrintTablePopup @register="registerPrintTablePopup" @reload="refresh" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, defineAsyncComponent, nextTick } from 'vue';
  import { schemaList, columns, columnsToSubmit, columnsDone, printColumn, columnsToHandle } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getMoldApplyList,
    exportExcel,
    bulkBackReview,
    bulkBackTermination,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    readImportTask,
    importExcel,
    saveBatchImport,
    downloadTemplate,
    getNodeList,
    bulkBackDelete,
    getDetail,
  } from '/@/api/productionDeal/moIdUse';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import GeneratePopup from './components/GeneratePopup.vue';
  import ApplyPopup from './components/ApplyPopup.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ImportModal } from '/@/components/ImportModal';
  import { PrintTablePopup } from '/@/components/Print';

  defineOptions({ name: 'productionDeal-mouldBusiness-use' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerGenerate, { openPopup: openGenerate }] = usePopup();
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
    api: getMoldApplyList,
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MoldReceiveApplyColumn',
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
    i18nConfig: {
      moduleCode: 'MoldReceiveApplyColumn',
      transferRange: ['placeholder'],
    },
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
      id: 'productionDeal-mouldBusiness-use-todo',
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
      id: 'productionDeal-mouldBusiness-use-toAdd',
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
      id: 'productionDeal-mouldBusiness-use-done',
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

  function getActions(record, mode: 'view' | 'edit' = 'edit'): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record, mode),
      },
    ];
  }

  // 生成
  function handleGenerate() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openGenerate(true, {
        ids: idList,
        mode: 'view',
      });
    } else {
      createMessage.info(t('common.selectText'));
    }
  }
  // 查看详情
  function handleDetail(record, mode: 'view' | 'edit' = 'edit', applyNo?: boolean) {
    // 区分领用来源 2: 新建，其他：生成
    if (record.receiveSources == 2) {
      return openApply(true, {
        ids: [record.id],
        applyNo: applyNo ? record.moldReceiveApplyNo : '',
        mode: mode,
      });
    }
    openGenerate(true, {
      ids: [record.id],
      applyNo: applyNo ? record.moldReceiveApplyNo : '',
      mode: mode,
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
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
    });
  }

  // 批量导入
  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importExcel,
      importSaveApi: saveBatchImport,
      templateApi: downloadTemplate,
      previewColumn: columns(),
      usePolling: true,
      pollingParams: {
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: readImportTask,
      },
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
    handleSelectData(bulkBackReview);
  }

  // 删除
  async function handleDel() {
    handleSelectData(bulkBackDelete);
  }

  //  终止
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openStopModal(true, {
        api: bulkBackTermination,
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

  useRouteParams({ id: {} }, async params => {
    const { id } = params;
    if (id) {
      // 获取详情，拿到申请类型，再打开对应的popup
      const { data } = await getDetail([id]);
      let receiveSources = 1;
      if (data && data.outputs && data.outputs.length > 0) {
        receiveSources = data.outputs[0].receiveSources;
      }
      handleDetail(
        {
          id,
          receiveSources,
        },
        'edit',
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
