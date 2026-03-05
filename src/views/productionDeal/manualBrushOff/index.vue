<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" v-auth="'btn_add'" @click="handleAdd">{{ t('common.add') }}</a-button>
            <a-button type="primary" v-auth="'btn_upload'" @click="handleImport">{{ t('common.batchImport') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <addModal @register="registerAddForm" @reload="reload" />
    <ImportModal @register="registerBatchImportPop" @reload="reload" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { BasicTable, useTable, FormSchema, ActionItem } from '/@/components/Table';
  import { getManualpctransfer, importManualpctransfer, saveManualpctransfer, downloadimporttemplate } from '/@/api/productionDeal/manualBrushOff';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import addModal from './components/addModal.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { getjobinfolist } from '/@/api/basicData/processrulestemplate';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { usePopup } from '/@/components/Popup';
  import { columns, previewColumns } from './components/config';
  import { ImportModal } from '/@/components/ImportModal';
  defineOptions({ name: 'productionDeal-manualBrushOff' });

  const baseStore = useBaseStore();

  const { t } = useI18n();
  const searchFormSchema: FormSchema[] = [
    {
      field: 'workNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名或工号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'transferPosition',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getjobinfolist,
        placeholder: '请选择调离岗位',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'code',
      },
      colProps: { span: 4 },
    },
    {
      field: 'transferType',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择调离类型',
        api: () => {
          return baseStore.getDictionaryData('ManualPcTransfer.TransferType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 4 },
    },
    {
      field: 'classes',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 4 },
    },
  ];

  const [registerAddForm, { openModal: openFormModal, setModalProps }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerTable, { getForm, reload }] = useTable({
    api: getManualpctransfer,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开

    showIndexColumn: false, //显示序号
    actionColumn: {
      width: 70,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    i18nConfig: {
      moduleCode: 'ManualPcTransferColumn',
    },
  });

  function handleAdd(data) {
    openFormModal(true, data);
  }

  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importManualpctransfer,
      importSaveApi: saveManualpctransfer,
      templateApi: downloadimporttemplate,
      previewColumn: previewColumns,
      usePolling: false,
      //   apiParams: {
      //     importSave: {
      //         isoperation: hasBtnP('btn_review') ? 1 : 0,
      //     },
      //   },
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
  function handleDetail(record) {
    openFormModal(true, record);
  }

  onMounted(() => {
    getForm().setProps({
      showResetButton: false,
      submitButtonOptions: {
        text: t('common.searchText'),
      },
    });
  });
</script>
