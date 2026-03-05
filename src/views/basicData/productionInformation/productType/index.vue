<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="openPopup(true, {})"> {{ t('common.add2Text') }} </a-button>
            <a-button type="primary" ghost @click="openProjectClassModal(true, {})"> {{ t('dict.PCCColumn.projectClass') }} </a-button>
            <a-button @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ApplyPopup @register="registerApplyPop" @reload="reload" @colse="reload" />
    <ImportModal @register="registerImportModal" @reload="reload" />
    <ProjectClass @register="registerProjectClassModal" @submit="handleProjectClassSubmit" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { deleteProductType, deleteExchangeRate, getProductType } from '/@/api/basicData/exchangeRate';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import ApplyPopup from './components/applyPopup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ExportModal from './components/ExportModal.vue';
  import { getTemplateDownload, importExcel, saveBatchData } from '/@/api/basicData/productCodeApply';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import ProjectClass from './components/ProjectClass.vue';

  const { t } = useI18n();
  const [registerApplyPop, { openPopup }] = usePopup();
  const [registerProjectClassModal, { openModal: openProjectClassModal, closeModal: closeProjectClassModal }] = useModal();
  defineOptions({ name: 'basicData-productionInformation-productType' });

  const STATUS_OPTIONS = [
    { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
    { id: 0, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  ];

  const column = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '主要制程', field: 'mainProcessDesc', width: 120 },
    { title: '工厂', field: 'factoryName', i18nField: 'factory', minWidth: 150 },
    { title: '业务类型', field: 'businessTypeDesc', i18nField: 'CommonCol.businessType', width: 120 },
    { title: '产品类型', field: 'productCategory', width: 130 },
    { title: '项目分类', field: 'projectClass', width: 120 },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '修改人', field: 'lastModifyUserName', width: 180 },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      width: 180,
    },
    { title: '备注', field: 'remark', width: 150 },
    {
      title: '是否启用',
      field: 'isEnabled',
      i18nField: 'CommonCol.isEnable',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 120,
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
  ];

  function getVxeSchema() {
    return [
      {
        fieldName: 'factoryName',
        label: '',
        component: 'Input',
        i18nField: 'factory',
        componentProps: {
          placeholder: '工厂',
        },
      },
      {
        fieldName: 'productCategory',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '产品类型',
        },
      },
      // {
      //   field: 'ValidityDateStart',
      //   label: '',
      //   component: 'DatePicker',
      //   componentProps: {
      //     placeholder: '有效期始',
      //     format: 'YYYY-MM-DD',
      //   },
      //   // colProps: { span: 3 },
      // },
      {
        fieldName: 'isEnabled',
        label: '',
        component: 'Select',
        i18nField: 'CommonCol.isEnable',
        componentProps: {
          options: [
            { fullName: t('dict.enableStatus.1'), id: 'true' },
            { fullName: t('common.disableText'), id: 'false' },
          ],
          fieldNames: { label: 'fullName', value: 'id' },
        },
      },
    ];
  }

  const [Grid, gridApi] = useVbenVxeGrid({
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
      schema: getVxeSchema(),
      i18nConfig: {
        moduleCode: 'ProductTypeColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionInformation-productType-list',
      columns: column,
      api: getProductType,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ProductTypeColumn',
      },
    },
  });
  const { reload, getSelectRowKeys, clearSelectedRowKeys, getFetchParams } = gridApi;

  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openPopup: openImportPopup }] = usePopup();

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  function handleProjectClassSubmit() {
    console.log('handleProjectClassSubmithandleProjectClassSubmit');
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        // auth: 'btn_detail',
      },
      // {
      //   icon: 'icon-ym icon-ym-delete',
      //   modelConfirm: {
      //     title: '删除',
      //     onOk: handleDelete.bind(null, record),
      //   },
      //   auth: 'btn_remove',
      // },
    ];
  }

  function addOrUpdateHandle(record) {
    openFormModal(true, record);
  }

  //单个删除
  // function handleDelete(record: Recordable) {
  //   deleteExchangeRate(record.Id).then(res => {
  //     createMessage.success(res.msg);
  //     reload();
  //   });
  // }

  //批量删除
  async function handleDeleteList() {
    let list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      console.log(list);
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await deleteProductType(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.success(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            console.error('🚀 ~ index.vue:223 ~ handleDeleteList ~ e:', e);
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  //同步SAP数据
  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importExcel,
      importSaveApi: saveBatchData,
      templateApi: getTemplateDownload,
      previewColumn: column,
      apiParams: {
        importSave: {
          // isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, { listQuery });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
