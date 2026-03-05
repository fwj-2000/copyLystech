<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="addOrUpdateHandle()" v-auth="'btn_add'">{{ t('common.add') }}</a-button>
              <a-button type="primary" @click="handleCopyAll" v-auth="'btn_add'">{{ t('common.copyNoText') }}</a-button>
              <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('common.revokeAllTip') + '?',
                    onOk: handleBackReview.bind(null),
                  },
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton>
              <a-button type="primary" ghost danger @click="handleStop" v-auth="'btn_stop'">{{ t('common.stopText') }}</a-button>
              <vShowDropdown>
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }}</button>
                  <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }}</button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <ModelConfirmButton
                v-auth="'btn_batchRemove'"
                type="primary"
                ghost
                danger
                v-bind="{
                  modelConfirm: {
                    onOk: batchDelete.bind(null),
                  },
                }">
                <span>{{ t('common.batchDelText') }}</span>
              </ModelConfirmButton>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
        </Grid>
      </div>
    </div>
    <ApplyPop @register="registerApplyPop" @refresh="reload" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
    <StopModal @register="registerStopModal" @reload="reload"></StopModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { nextTick, onMounted } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import {
    getDrawingsReviewReqPagingList,
    getDrawingsReviewReqNodeHistory,
    bulkDeleteDrawingsReviewReq,
    bulkWithdrawDrawingsReviewReq,
    bulkTerminationDrawingsReviewReq,
    exportDrawingsReviewReqExcel,
    downloadDrawingsReviewReqTemplate,
    importDrawingsReviewReqData,
    saveImportedDrawingsReviewReq,
    getDrawingsReviewReqImportTask,
    getDrawingsReviewReqImportTaskData,
    cancelImportTask,
    importTaskRead,
  } from '/@/api/engineering/drawingReviewApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPop from './components/ApplyPopupVxe.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, schemaFormConfig } from './config';
  import { useModal } from '/@/components/Modal';
  import { useRoute } from 'vue-router';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { ModelConfirmButton } from '/@/components/Button';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { hasBtnP } = usePermission();

  const route = useRoute();

  const { t } = useI18n();
  const { createMessage } = useMessage();

  defineOptions({ name: 'engineering-drawing-drawingReviewRequirements' });

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerStopModal, { openModal: openStopModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: schemaFormConfig(),
      i18nConfig: {
        moduleCode: 'DrawingsReviewReqColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-quantitation-requirement',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getDrawingsReviewReqPagingList,
      beforeFetch: params => handleParams(params),
      i18nConfig: {
        moduleCode: 'DrawingsReviewReqColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });
  const { getSelectRowKeys, reload, getSelectRows, clearSelectedRowKeys, getFetchParams } = gridApi;

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.StartTime = params.pickerVal[0];
      params.EndTime = params.pickerVal[1];
      delete params.pickerVal;
    }
    return params;
  }

  function addOrUpdateHandle(id = '') {
    openMenuPopup(true, { id, title: t('common.add') });
  }
  function handleCopyAll() {
    const idList = getSelectRows();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    } else if (idList.length > 1) {
      createMessage.warning(t('common.copyAllTip'));
      return;
    }
    openMenuPopup(true, { id: idList[0].id, title: t('common.add') });
  }
  function handleBackReview() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    bulkWithdrawDrawingsReviewReq(idList).then(res => {
      reload();
      clearSelectedRowKeys();
      createMessage.success(res.msg);
    });
  }
  function handleStop() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    openStopModal(true, {
      idList,
      api: bulkTerminationDrawingsReviewReq,
      beforeFetch: params => {
        return {
          ids: idList,
          terminationRemarks: params.remark,
        };
      },
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }
  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importDrawingsReviewReqData,
      importSaveApi: saveImportedDrawingsReviewReq,
      templateApi: downloadDrawingsReviewReqTemplate,
      previewColumn: columnsVxe,
      usePolling: true,
      pollingParams: {
        getTaskStatus: getDrawingsReviewReqImportTask,
        getTaskDataList: getDrawingsReviewReqImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: 'QuantitativeApplyColumn',
      },
      excludeFields: ['status', 'applyCode', 'lastModifyUserName', 'lastModifyTime', 'nodeDetail', 'handleName', 'currentNode', 'applyUserName', 'applyDate'],
    });
  }
  const handleExport = async () => {
    openExportModal(true, {
      api: exportDrawingsReviewReqExcel,
      listQuery: handleParams(await getFetchParams()),
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columnsVxe,
      i18nConfig: {
        moduleCode: 'QuantitativeApplyColumn',
      },
    });
  };
  function goDetail(id = '') {
    openMenuPopup(true, { id, title: t('common.editText'), type: 'view' });
  }
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getDrawingsReviewReqNodeHistory,
      id: record.id,
    });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record.id),
        auth: 'btn_detail',
      },
    ];
  }
  function batchDelete() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    } else {
      try {
        bulkDeleteDrawingsReviewReq(idList).then(res => {
          createMessage.success(res.msg);
          reload();
        });
      } catch (e) {
        console.log(e);
        reload();
      }
    }
  }
  function handleSubmit(values) {
    state.searchInfo = {
      ...values,
      // StartTime: values?.StartTime ? dateUtil(values?.StartTime).format('YYYY-MM-DD') : '',
      // EndTime: values?.EndTime ? dateUtil(values?.EndTime).format('YYYY-MM-DD') : '',
    };
    handleSearch();
  }
  function handleReset() {
    state.searchInfo = {};
    clearSelectedRowKeys();
    handleSearch();
  }
  function handleSearch() {
    clearSelectedRowKeys();
    nextTick(() => {
      reload();
    });
  }
  // function handleExpand() {
  //   expandAll.value = !expandAll.value;
  //   console.log(expandAll.value);
  //   // if (expandAll.value) {
  //   //   generalWidthOptions;
  //   // }
  // }
  onMounted(() => {
    const { id } = route.query as any;
    reload();
    if (id) {
      goDetail(id);
    }
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.ant-table-expanded-row-fixed) {
    width: auto !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }

  .sub-table {
    :deep(.ant-table) {
      padding: 0 !important;
    }
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  .rotate-wrap {
    width: var(--vxe-ui-button-height-small);
    height: var(--vxe-ui-button-height-small);
  }

  .rotate-90 {
    transform: rotate(90deg);
    transition: all 0.35s ease;
  }

  .rotate-240 {
    transform: rotate(270deg);
    transition: all 0.35s ease;
  }
</style>
