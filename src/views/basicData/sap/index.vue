<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_add'" @click="handleApply"> {{ t('common.add2Text') }}</a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <!-- <a-button v-auth="'btn_download'" type="primary" @click="handleExport"
              ><i class="icon-ym icon-ym-btn-download button-preIcon"></i>{{ t('common.exportText') }}</a-button
            >
            <a-button v-auth="'btn_upload'" type="link" @click="handleImport"
              ><i class="icon-ym icon-ym-btn-upload button-preIcon"></i>{{ t('common.importText') }}</a-button
            > -->
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #factoryName="{ row }">
            <span>{{ FactoryValue.find(item => item.Code == row.factoryCode)?.Name }}</span>
          </template>
          <template #isBonded="{ row }">
            <a-tag :color="row.isBonded == 1 ? 'success' : 'error'">{{ row.isBonded == true ? t('common.yes') : t('common.no') }}</a-tag>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerApply" @reload="reload" />
    <update @register="updateForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getSapList, deleteSapFactory, blukDeleteSapFactory, exportFactorySapExcel, templateDownload, importPreview, importData } from '/@/api/basicData/sap';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import update from './components/update.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ImportModal } from '/@/components/ImportModal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getFactoryList } from '/@/api/customerSerivce';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'basicData-sap' });
  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const [updateForm, { openModal: openFormModal }] = useModal();
  const { createMessage, createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openPopup: openImportModal }] = usePopup();

  const [registerApply, { openPopup: openApplyPop }] = usePopup();

  interface State {
    industryTypeList: any[];
  }
  const state = reactive<State>({
    industryTypeList: [],
  });
  const FactoryValue = ref<any>([]);
  onMounted(() => {
    getFactoryListData();
  });
  const getFactoryListData = () => {
    getFactoryList({}).then(res => {
      FactoryValue.value = res.data;
    });
  };
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '工厂代码', field: 'factoryCode', width: 80 },
    { title: '工厂名称', field: 'factoryName', i18nField: 'CommonCol.factoryName', width: 100, slots: { default: 'factoryName' } },
    {
      title: '工厂类型',
      field: 'typeName',
      i18nField: 'type',
      width: 120,
    },
    { title: '业务类型', field: 'materialName' },
    { title: 'SAP工厂名称', field: 'name' },
    { title: 'SAP代码', field: 'code' },
    { title: 'SAP公司代码', field: 'sapCompanyCode' },
    { title: '公司名称', field: 'sapCompanyName' },
    { title: 'PCC文件编码前缀', field: 'pccPrefix' },
    { title: '是否保税', field: 'isBonded', slots: { default: 'isBonded' } },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '备注', field: 'remark' },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  function searchFormSchema() {
    return [
      {
        fieldName: 'FactoryCode',
        label: '',
        component: 'Input',
        i18nField: 'factoryCode',
        componentProps: {
          showSearch: true,
          placeholder: '工厂代码',
        },
        colProps: { span: 3 },
      },
      {
        fieldName: 'type',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('SapFactoryType', true),
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          allowClear: true,
          immediate: true,
        },
        colProps: { span: 3 },
      },
      {
        fieldName: 'Code',
        label: '',
        component: 'Input',
        i18nField: 'code',
        componentProps: {
          showSearch: true,
          placeholder: 'SAP代码',
        },
        colProps: { span: 3 },
      },
      {
        fieldName: 'CreatorUserId',
        label: '',
        component: 'CustomUserSelect',
        i18nField: 'creatorUserName',
        componentProps: {
          showSearch: true,
          placeholder: '创建人',
        },
        colProps: { span: 3 },
      },
    ];
  }

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
      schema: searchFormSchema(),
      i18nConfig: {
        moduleCode: 'FactorySapColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-sap-list',
      columns: columns,
      api: getSapList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'FactorySapColumn',
      },
      afterFetch: data => {
        state.industryTypeList = data.list;
      },
    },
  });

  const { getSelectRowKeys, reload, getFetchParams, clearSelectedRowKeys } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: UpdateHandle.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.deleted'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  //修改
  function UpdateHandle(record: Recordable) {
    openFormModal(true, {
      id: record.id,
      FactoryCode: record.factoryCode,
    });
  }
  //新增
  function handleApply() {
    openApplyPop(true, {});
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteSapFactory(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

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
            const { code } = await blukDeleteSapFactory(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
          } finally {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportFactorySapExcel,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'FactorySapColumn',
      },
    });
  }
  function handleImport() {
    openImportModal(true, {
      importPreviewApi: importPreview,
      importSaveApi: importData,
      templateApi: templateDownload,
      previewColumn: columns,
      usePolling: false,
    });
  }

  function batchImportOrExport({ key }: { key: string }) {
    if (key === 'import') {
      handleImport();
    } else if (key === 'export') {
      handleExport();
    }
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
