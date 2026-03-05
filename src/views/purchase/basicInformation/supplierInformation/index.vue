<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <SupplierGrid>
          <template #toolbar-actions>
            <a-button v-if="hasBtnP('btn_add')" type="primary" @click="openAddPopupFn">
              {{ t('common.add') }}
            </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" @click="handleDel">{{ t('views.business.quota.delete') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </SupplierGrid>
      </div>
    </div>
    <addPop @register="registerAddPop" @reload="reload" />
    <Form @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem, TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    bulkdeleteBaseDataSupplier,
    cancelImportTask,
    delBaseDataSupplier,
    downloadBaseDataSupplierImportTemplate,
    exportBaseDataSupplier,
    getBaseDataSupplier,
    getImportTask,
    getImportTaskData,
    importBaseDataSupplier,
    importTaskRead,
    saveBaseDataSupplier,
  } from '/@/api/purchase/supplierInformation';
  import { onMounted } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useModal } from '/@/components/Modal';
  import Form from './Form.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePopup } from '/@/components/Popup';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import type { ColumnWithI18n } from '/@/effects/plugins/vxe-table/types';
  import addPop from './components/addPop.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  const { createMessage, createConfirm } = useMessage();
  const [registerAddPop, { openPopup: openAddPopup }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const STATE_MAP = [
    {
      id: '1',
      fullName: t('dict.enableStatus.1'),
      theme: 'green',
    },
    {
      id: '2',
      fullName: t('dict.enableStatus.2'),
      theme: 'red',
    },
  ];
  const { hasBtnP } = usePermission();
  defineOptions({ name: 'purchase-basicInformation-supplierInformation' });

  const baseColumns: ColumnWithI18n[] = [
    {
      title: '供应商名称',
      field: 'name',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '供应商类型',
      field: 'supplierType',
      dataIndex: 'supplierType',
      width: 200,
    },
    {
      title: '供应商简称',
      field: 'shortName',
      dataIndex: 'shortName',
      width: 170,
    },
    {
      title: '供应商SAP代码',
      field: 'sapCode',
      dataIndex: 'sapCode',
      width: 170,
    },
    {
      title: '是否启用',
      field: 'status',
      dataIndex: 'status',
      width: 150,
      cellRender: {
        name: 'Tag',
        options: STATE_MAP,
      },
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      dataIndex: 'creatorUserName',
      width: 180,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      dataIndex: 'creatorTime',
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      dataIndex: 'lastModifyUserName',
      width: 180,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      dataIndex: 'lastModifyTime',
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '备注',
      field: 'remark',
      dataIndex: 'remark',
      width: 200,
    },
  ];

  const columns: ColumnWithI18n[] = [
    {
      type: 'checkbox',
      width: 50,
    },
    ...baseColumns,
    {
      title: t('views.business.quota.action'),
      field: 'action',
      width: 70,
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];

  const [SupplierGrid, gridApi] = useVbenVxeGrid({
    formOptions: getFormOptions(),
    gridOptions: {
      id: 'purchase-basicInformation-supplierInformation-list',
      api: getBaseDataSupplier,
      columns,
      rowConfig: {
        keyField: 'id',
      },
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        // search: true,
      },
      i18nConfig: {
        moduleCode: 'SupplierColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, clearSelectedRowKeys, getFetchParams, updateSchema } = gridApi;

  function getFormOptions() {
    return {
      collapsed: true,
      submitOnChange: false,
      showCollapseButton: true,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: [
        {
          fieldName: 'name',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '供应商名称',
          },
        },
        {
          fieldName: 'sapCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '供应商SAP代码',
          },
        },
        {
          fieldName: 'shortName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '供应商简称',
          },
        },
        {
          fieldName: 'status',
          label: '',
          component: 'Select',
          componentProps: {
            placeholder: '选择状态',
            options: [],
            fieldNames: { value: 'enCode', label: 'fullName' },
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'SupplierColumn',
        transferRange: ['placeholder'],
      },
    };
  }

  // function handleApply() {
  //   openFormModal(true, {
  //     id: '',
  //   });
  // }

  function openAddPopupFn() {
    openAddPopup(true, {
      id: '',
      type: 'add',
    });
  }

  async function handleDel() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await bulkdeleteBaseDataSupplier(selectKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:283 ~ handleDel ~ e:', e);
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  async function handleExport() {
    const exportColumns = cloneDeep(baseColumns);
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      api: exportBaseDataSupplier,
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'SupplierColumn',
      },
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.id),
        },
        auth: 'btn_remove',
      },
    ];
  }

  function handleEdit(record) {
    // openFormModal(true, record);
    openAddPopup(true, record);
  }

  async function onDelete(id) {
    const { code, msg } = await delBaseDataSupplier(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  onMounted(() => {
    getOps();
  });

  async function getOps() {
    const list = await baseStore.getDictionaryData('Supplier.Status');
    updateSchema?.([
      {
        fieldName: 'status',
        componentProps: {
          options: list,
          fieldNames: { value: 'enCode', label: 'fullName' },
        },
      },
    ]);
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importBaseDataSupplier,
      importSaveApi: saveBaseDataSupplier,
      templateApi: downloadBaseDataSupplierImportTemplate,
      previewColumn: baseColumns,
      usePolling: true,
      pollingParams: {
        interval: 3000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
      i18nConfig: {
        moduleCode: 'SupplierColumn',
      },
    });
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym) {
    font-size: 18px;
  }
</style>
