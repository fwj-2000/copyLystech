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
                    content: t('common.withdrawSelectedData'),
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
                v-bind="{
                  modelConfirm: {
                    onOk: batchDelete.bind(null),
                  },
                }">
                <span>{{ t('common.batchDelText') }}</span>
              </ModelConfirmButton>
              <a-button v-if="hasBtnP('btn_sync')" :loading="syncLoading" @click="handleSynTermination">{{ t('dict.QuantitativeApply.syncText') }}</a-button>
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
    <StopModal @register="registerStopModal" @reload="handleStopModal"></StopModal>
    <SubmitAfterModal @register="registerSubmitAfter" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { Modal } from 'ant-design-vue';
  import { reactive, nextTick, onMounted, h, ref } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import {
    getQuantitationApplyListLine,
    getNodelist,
    bulkbackreview,
    batchDelQuantitationApplyByIds,
    downloadTemplate,
    bulkbacktermination,
    importQuantitationApply,
    saveImportData,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
    synTermination,
    exportTableData,
  } from '/@/api/business/quantitation';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPop from './components/ApplyPopupVxe.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, columnsVxe, schemaFormConfig, subColumns, getImportColumns } from './config';
  import { useModal } from '/@/components/Modal';
  import { useRoute } from 'vue-router';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { ModelConfirmButton } from '/@/components/Button';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import SubmitAfterModal from '/@/views/business/quantitation/requirement/components/SubmitAfterModal.vue';
  import { isEmpty, isExist } from '/@/utils/is';
  const { hasBtnP } = usePermission();

  const route = useRoute();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  defineOptions({ name: 'business-quantitation-requirement' });

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerSubmitAfter, { openModal: openSubmitAfterModal, closeModal: submitAfterCloseModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: schemaFormConfig(),
      i18nConfig: {
        moduleCode: 'QuantitativeApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-quantitation-requirement',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getQuantitationApplyListLine,
      beforeFetch: params => handleParams(params),
      i18nConfig: {
        moduleCode: 'QuantitativeApplyColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });
  const { getSelectRowKeys, reload, query, getSelectRows, clearSelectedRowKeys, getFetchParams } = gridApi;

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
    openMenuPopup(true, { id, title: t('common.add'), isDevPlatform: false });
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
    openMenuPopup(true, { id: idList[0].applyNo, title: t('common.add') });
  }
  function handleBackReview() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    bulkbackreview(idList).then(res => {
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
      api: bulkbacktermination,
      beforeFetch: params => {
        return {
          ids: idList,
          terminationRemarks: params.remark,
        };
      },
    });
  }

  function handleStopModal() {
    createMessage.info({
      content: '数据已提交到后台终止中，请稍后刷新',
    });
    clearSelectedRowKeys();
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }
  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importQuantitationApply,
      importSaveApi: saveImportData,
      templateApi: downloadTemplate,
      previewColumn: getImportColumns(),
      usePolling: true,
      pollingParams: {
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      importSaveSuccessCallback: data => {
        createMessage.info({ content: '数据已提交到后台运行中，请稍后刷新' });

        if (isExist(data) && !isEmpty(data)) {
          openSubmitAfterModal(true, data);
        } else {
          reload();
        }
      },
      i18nConfig: {
        moduleCode: 'QuantitativeApplyColumn',
      },
      excludeFields: ['status', 'applyNo', 'lastModifyUserName', 'lastModifyTime', 'nodeDetail', 'currentProcessor', 'currentNodeName'],
    });
  }
  const handleExport = async () => {
    openExportModal(true, {
      api: exportTableData,
      listQuery: handleParams(await getFetchParams()),
      nameProps: 'title',
      idProps: 'dataIndex',
      exportOptions: columns.concat(subColumns),
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
      api: getNodelist,
      id: record.id,
    });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record.applyNo),
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
        batchDelQuantitationApplyByIds(idList).then(res => {
          createMessage.success(res.msg);
          reload();
        });
      } catch (e) {
        console.log(e);
        reload();
      }
    }
  }
  const syncLoading = ref<boolean>(false);
  async function handleSynTermination() {
    syncLoading.value = true;
    gridApi.setLoading(true);
    return synTermination()
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
      })
      .finally(() => {
        syncLoading.value = false;
        gridApi.setLoading(false);
      });
  }

  onMounted(() => {
    const { id } = route.query as any;
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
