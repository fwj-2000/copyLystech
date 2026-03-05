<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <GridTable ref="IncompleteGridTableRef" @batchImportOrExport="batchImportOrExport" @batchModify="handleBatchModify" />
      </div>
    </div>

    <ImportModal @register="registerImportPop" @refresh="reload" />
    <ExportModal @register="registerExportModal" />
    <ModifyPopup @register="registerModifyPopup" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { importColumns, exportColumns } from './config';
  import {
    exportExcel,
    template,
    importPreview,
    importTask,
    importTaskData,
    cancelImportTask,
    importTaskRead,
    saveImportData,
  } from '/@/api/business/immediateCustomer';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { usePopup } from '/@/components/Popup';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import GridTable from './components/gridTable.vue';
  import ModifyPopup from './components/modifyPopup.vue';

  defineOptions({ name: 'business-basicInformation-immediateCustomer' });

  const { hasBtnP } = usePermission();

  const CompleteGridTableRef = ref<InstanceType<typeof GridTable>>();
  const IncompleteGridTableRef = ref<InstanceType<typeof GridTable>>();
  const gridRef = computed(() => (activeKey.value ? CompleteGridTableRef.value : IncompleteGridTableRef.value));
  // const { t } = useI18n();

  const activeKey = ref<boolean>(false);

  function reload() {
    gridRef.value?.reload();
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: saveImportData,
      templateApi: template,
      previewColumn: importColumns,
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: importTask,
        getTaskDataList: importTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_upload') ? 1 : 0,
        },
      },
    });
  }

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  async function handleExport() {
    const query = await gridRef.value?.getQueryParams();

    openExportModal(true, {
      listQuery: { ...query, isComplete: activeKey.value },
      api: exportExcel,
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      selectIds: activeKey.value ? CompleteGridTableRef.value!.getSelectRowKeys() : IncompleteGridTableRef.value?.getSelectRowKeys(),
    });
  }

  const [registerModifyPopup, { openPopup: openModifyPopup }] = usePopup();
  function handleBatchModify(rows: Array<any>) {
    openModifyPopup(true, { rows });
  }
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');

  :deep(.lydc-content-wrapper-content) {
    .ant-tabs.ant-tabs-top,
    .ant-tabs-content.ant-tabs-content-top {
      height: 100%;
    }
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
