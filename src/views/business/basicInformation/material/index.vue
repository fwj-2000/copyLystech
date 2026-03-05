<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleApply"> {{ t('common.addSpec') }} </a-button>
            <a-button v-auth="'btn_enable'" type="primary" @click="handleEnable" ghost>
              {{ t('common.enableText') }}
            </a-button>
            <a-button v-auth="'btn_disable'" type="primary" @click="handleDisable" ghost>
              {{ t('common.disableText') }}
            </a-button>
            <vShowDropdown>
              <template #overlay>
                <!-- <button @click="batchImportOrExport({ key: 'import' })" v-auth="'btn_upload'"> 期初{{ t('common.batchImport') }}</button> -->
                <button @click="batchImportOrExport({ key: 'import1' })" v-auth="'btn_uploadSpec'">{{ t('common.batchImport') }}</button>
                <button @click="batchImportOrExport({ key: 'export' })" v-auth="'btn_download'">{{ t('common.batchExport') }}</button>
                <!-- <button @click="batchImportOrExport({ key: 'export1' })"  v-auth="'btn_download'">{{ t('common.batchExport') }}</button> -->
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" @click="handleDel">
              {{ t('common.batchDelText') }}
            </a-button>
          </template>
          <template #files="{ row }">
            <span class="table-a" @click="handleFileView(row)">{{ t('dict.MaterialDevelopApplyColumn.files') }}</span>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ApplyPop @register="registerApply" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
    <FileListModal @register="registerFileList"></FileListModal>
    <viewPopup @register="registerViewModal" @reload="reload"></viewPopup>
  </div>
</template>

<script setup lang="ts">
  import { ActionItem, TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ApplyPop from './components/DetailPopupVxe.vue';
  import {
    getList,
    del,
    batchDel,
    template,
    importSave,
    importPreview,
    exportExcel,
    enable,
    disable,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
    importPreviewOrigin,
    importSaveOrigin,
    getFiles,
    fileDownload,
  } from '/@/api/business/material';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { ImportModal } from '/@/components/ImportModal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { columns } from './configVxe';
  import { usePermission } from '/@/hooks/web/usePermission';
  import viewPopup from './components/ViewPop.vue';
  import { FileListModal } from '/@/components/Upload';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { omit } from 'lodash-es';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'business-basicInformation-material' });

  const { hasBtnP } = usePermission();
  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportModal, { openPopup: openImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerViewModal, { openPopup: openViewModal }] = usePopup();

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
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: [
        {
          fieldName: 'MaterialCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料内部编码',
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'MaterialAreaName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料归属',
            submitOnPressEnter: true,
          },
        },
        // {
        //   fieldName: 'MaterialFormEnCode',
        //   label: '',
        //   component: 'Input',
        //   componentProps: {
        //     placeholder: '材料形态',
        //     submitOnPressEnter: true,
        //   },
        // },
        {
          fieldName: 'OriginalModelNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '原厂商型号',
            submitOnPressEnter: true,
          },
        },
        // {
        //   fieldName: 'MaterialClassName',
        //   label: '',
        //   component: 'Input',
        //   componentProps: {
        //     placeholder: '材料类型',
        //     submitOnPressEnter: true,
        //   },
        // },
        {
          fieldName: 'MaterialDesc',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '材料描述',
            submitOnPressEnter: true,
          },
        },
        {
          fieldName: 'CreatorUserId',
          i18nField: 'CreatorUserName',
          label: '',
          component: 'CustomUserSelect',
          componentProps: {
            placeholder: '创建人',
            submitOnPressEnter: true,
          },
        },
        // {
        //   fieldName: 'MaterialColor',
        //   label: '',
        //   component: 'Input',
        //   componentProps: {
        //     placeholder: '颜色',
        //     submitOnPressEnter: true,
        //   },
        // },
        // {
        //   fieldName: 'TotalThickness',
        //   label: '',
        //   component: 'Input',
        //   componentProps: {
        //     placeholder: '总厚度',
        //     submitOnPressEnter: true,
        //   },
        // },
      ],
      i18nConfig: {
        moduleCode: 'MaterialWarehouseColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-basicInformation-material-list',
      api: getList,
      columns: columns as any,
      rowConfig: {
        keyField: 'Id',
      },
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'MaterialWarehouseColumn',
      },
    },
  });

  function reload() {
    gridApi.reload();
  }

  function handleApply() {
    const idList = gridApi.getSelectRowKeys();
    if (!idList || idList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    openApplyPop(true, {
      ids: idList,
    });
  }

  function handleCommon(method, tipText) {
    const selectKeys = gridApi.getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tipText,
      onOk: async () => {
        try {
          const { code, msg } = await method(selectKeys);
          if (code === 200) {
            gridApi.clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:242 ~ handleCommon ~ e:', e);
          gridApi.clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  async function handleDel() {
    handleCommon(batchDel, t('common.beforeDelTip'));
  }

  function handleEnable() {
    handleCommon(enable, t('common.beforeEnableTip'));
  }
  function handleDisable() {
    handleCommon(disable, t('common.beforeDisableTip'));
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        auth: 'btn_remove',
        icon: 'icon-ym icon-ym-delete',
        disabled: record.deleteMark == 1, // 已被删除数据不可再删
        modelConfirm: {
          onOk: onDelete.bind(null, record.Id),
        },
      },
    ];
  }

  function handleFileView(record) {
    openFileList(true, {
      id: record.Id,
      downloadApi: fileDownload,
      listApi: getFiles,
      hideVersion: true,
    });
  }

  function handleEdit(record) {
    openViewModal(true, {
      ids: [record.Id],
    });
  }

  async function onDelete(id) {
    const { code, msg } = await del(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  function batchImportOrExport({ key }) {
    switch (key) {
      case 'import':
        return handleImport();
      case 'export':
        return handleExport();
      case 'import1':
        return handleImportWL();
    }
  }

  async function handleExport() {
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: exportExcel,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialWarehouseColumn',
      },
    });
  }
  function handleImport() {
    const params = {
      isOriginal: 1,
    };
    openImportPopup(true, {
      importPreviewApi: importPreviewOrigin,
      importSaveApi: importSaveOrigin,
      templateApi: template,
      previewColumn: columns
        .concat([
          {
            title: '供应商代码',
            field: 'SupplierCode',
          },
          {
            title: '原厂商代码',
            field: 'OriginalManufacturerCode',
          },
        ])
        .map(item => ({
          ...item,
          dataIndex: item.field,
        })),
      usePolling: true,
      pollingParams: {
        interval: 1000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        template: params,
        getTaskDataList: params,
        cancelTask: params,
        taskRead: params,
        getTaskStatus: params,
      },
      i18nConfig: {
        moduleCode: 'MaterialWarehouseColumn',
      },
    });
  }
  // 导入规格数据
  function handleImportWL() {
    const params = {
      isOriginal: 0,
    };
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: template,
      previewColumn: [
        { title: '材料内部料号', field: 'MaterialCode', minWidth: '200px' },
        { title: '材料宽度(MM)', field: 'MaterialWidth', minWidth: '200px' },
        { title: '材料长度(M)', field: 'MaterialLength', minWidth: '200px' },
        { title: '材料规格', field: 'MaterialSpec', minWidth: '200px' },
        { title: '材料描述', field: 'MaterialDesc' },
      ],
      usePolling: true,
      pollingParams: {
        interval: 1000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        template: params,
        getTaskDataList: params,
        cancelTask: params,
        taskRead: params,
        getTaskStatus: params,
      },
      i18nConfig: {
        moduleCode: 'MaterialWarehouseColumn',
      },
    });
  }

  // const MaterialFormList = ref<any>([]);
  // onMounted(async () => {
  //   MaterialFormList.value = await baseStore.getDictionaryData('MaterialForm');
  //   const _columns = columns.map(item => {
  //     if (item.dataIndex == 'MaterialFormEnCode') {
  //       item.editComponentProps = {
  //         ...item.editComponentProps,
  //         options: MaterialFormList.value,
  //         // customRender: ({ text }) => {
  //         //   const _obj = MaterialFormList.value.filter(item => {
  //         //     return item.enCode == text;
  //         //   });
  //         //   return _obj.fullName;
  //         // },
  //       };
  //     }
  //     return item;
  //   });
  //   console.log(_columns);
  //   setColumns(_columns);
  // });
</script>
