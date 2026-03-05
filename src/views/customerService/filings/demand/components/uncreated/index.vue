<template>
  <Grid>
    <template #toolbar-actions>
      <a-button v-auth="'btn_create'" type="primary" @click="createFilings('1')">{{ t('common.create') + t('views.filings.demand') }}</a-button>
      <a-button v-auth="'btn_add'" type="primary" ghost @click="createFilings()">{{ t('common.add') }}</a-button>
      <vShowDropdown>
        <template #overlay>
          <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
          <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
        </template>
        <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
      </vShowDropdown>
    </template>
  </Grid>

  <ExportModal @register="registerExportModal" />
  <Teleport defer to="#popupwrap">
    <ApplyPop @register="registerApplyPop" @reload="handleReload"></ApplyPop>
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
  </Teleport>
</template>

<script lang="ts" setup>
  import { getColumns, getFormConfig, importColumns } from './config';
  import {
    getList,
    exportExcel,
    template,
    importTask,
    importTaskData,
    importTaskRead,
    cancelImportTask,
    importPreview,
    saveImportData,
  } from '/@/api/customerSerivce/customsAffairsApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ApplyPop from '../ApplyPop.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { omit } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRoute } from 'vue-router';

  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const route = useRoute();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-filings-demand-doneList',
      columns: getColumns() as any,
      api: (params: any) => getList({ ...params, identification: '1' }),
      pagerConfig: {
        autoHidden: false,
      },
      // toolbarConfig: {
      //   delStatus: true
      // },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, clearSelectedRowKeys, getFetchParams } = gridApi;

  function createFilings(type = '') {
    if (type == '1') {
      const list = getSelectRowKeys();
      if (list.length) {
        return openMenuPopup(true, {
          type: 'add',
          title: t('common.create'),
          list: list || [],
          canAddData: false,
        });
      }
      return message.info(t('common.selectText'));
    }
    openMenuPopup(true, {
      type: 'add',
      title: t('common.add'),
      list: [],
    });
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: (batchCode: string) => saveImportData(batchCode, route.meta.modelId as string),
      templateApi: template,
      previewColumn: importColumns,
      usePolling: true,
      pollingParams: {
        getTaskStatus: importTask,
        getTaskDataList: importTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    });
  }

  function handleReload() {
    reload();
    clearSelectedRowKeys();
  }

  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportExcel,
      listQuery: { ...params, ...omit(pager, 'total'), identification: '1' },
      exportOptions: getColumns().slice(2),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    });
  };

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  defineExpose({
    /** 打开详情页面 */
    openDetail: openMenuPopup,
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
