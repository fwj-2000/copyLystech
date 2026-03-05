<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle('')">{{ t('common.add') }}</a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload"></ImportModal>
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';

  import {
    getPageList,
    deleteData,
    deleteDataList,
    importPreview,
    importSave,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    templateDownload,
    importTaskRead,
    exportFcDataExcel,
  } from '/@/api/productionPlan/planProduceContrast';

  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  import { columns, importColumns, searchFormSchema, column, importColumn } from './components/config';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { hasBtnP } = usePermission();

  const { t } = useI18n();
  const baseStore = useBaseStore();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openPopup: openImportPopup }] = usePopup();

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'PlanProduceContrastColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-main-produceContrast-list',
      rowConfig: {
        keyField: 'Id',
      },
      columns: column,
      api: getPageList,
      i18nConfig: {
        moduleCode: 'PlanProduceContrastColumn',
      },
    },
  });

  async function reloadTable() {
    reload();
  }

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record) {
    openFormModal(true, { record });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteData(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    // const list = getRowSelection().selectedRowKeys;
    const list = getSelectRows();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const delData = getSelectRows();
            const { code } = await deleteDataList(delData.map(x => x.Id));
            if (code == 200) {
              message.success(t('common.delSuccess'));
            }
            // clearSelectedRowKeys();
            reload();
          } catch (e) {
            // clearSelectedRowKeys();
            console.log(e);
            reload();
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }
  //导入
  function handleImport() {
    // const searchDate = getForm().getFieldsValue().searchDate;
    // if (!searchDate) {
    //   return message.warning('请先选择周数');
    // }
    reloadTable(); //刷新一次表格 刷新表格的表头

    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      // previewColumn: importColumns,
      previewColumn: importColumn,
      usePolling: true,
      pollingParams: {
        interval: 5000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: 'PlanProduceContrastColumn',
      },
      // apiParams: {
      //   importSave: {},
      // },
    });
  }

  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportFcDataExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'PlanProduceContrastColumn',
        transferRange: ['placeholder'],
      },
    });
  }

  onMounted(async () => {});
</script>
