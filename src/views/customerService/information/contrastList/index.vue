<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd"> {{ t('common.add2Text') }} </a-button>
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                  <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_download') || hasBtnP('btn_upload')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <a-button v-auth="'btn_batchRemove'" @click="handleBatchDelete" danger> {{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <FormModal @register="registerFormModal" @reload="reload" />
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema, exportColumn, importColumn } from './config';
  import {
    getFcProjectComparison,
    blukDeleteFcProjectComparison,
    exportExcel,
    templateDownload,
    importPreview,
    importSave,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
  } from '/@/api/customerSerivce/contrastList';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import FormModal from './components/formModal.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  defineOptions({ name: 'customerService-information-contrastList' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createMessage, createConfirm } = useMessage();

  const [registerFormModal, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema,
      i18nConfig: {
        moduleCode: 'ContrastListColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-information-contrastList-list',
      api: getFcProjectComparison,
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      columns,
      i18nConfig: {
        moduleCode: 'ContrastListColumn',
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  function reload() {
    gridApi.reload();
  }

  function handleEdit(row) {
    openFormModal(true, cloneDeep(row));
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  async function handleDelete(row) {
    return blukDeleteFcProjectComparison({ ids: [row.id] })
      .then(res => {
        res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
      })
      .finally(reload);
  }

  function handleBatchDelete() {
    const checkedList = gridApi.getSelectRows();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    const ids = checkedList.map(item => item.id);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        blukDeleteFcProjectComparison({ ids })
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(reload),
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      previewColumn: importColumn,
      usePolling: true,
      pollingParams: {
        interval: 3000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      // apiParams: {
      //   importSave: {
      //     isoperation: hasBtnP('btn_upload') ? 1 : 0,
      //   },
      // },
    });
  }

  async function handleExport() {
    const params = await gridApi.getFetchParams();

    openExportModal(true, {
      listQuery: params,
      api: exportExcel,
      exportOptions: exportColumn,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ContrastListColumn',
      },
    });
  }
</script>

<style scoped lang="less">
  ::v-deep(.lydc-basic-table-action.left) {
    justify-content: center;
  }
</style>
