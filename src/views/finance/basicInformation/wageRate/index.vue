<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerOrgForm" @submit="handleSubmit" @reset="handleReset">
          <template #orgId>
            <lydcOrganizeSelect v-model:value="organizeIdTree" @change="onOrganizeChange" />
          </template>
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleApply">
              {{ t('common.add') }}
            </a-button>
            <!--            <a-button @click="handleImport">导入</a-button>-->
            <a-button v-auth="'btn_batchRemove'" @click="handleDel">{{ t('views.business.quota.delete') }}</a-button>
            <!--            <a-button @click="handleExport">{{ t('views.business.quota.export') }}</a-button>-->
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
          </template>
          <!-- <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'status'">
              <template v-if="text == '2'">
                <Badge color="#f50" :text="STATE_MAP[text]" />
              </template>
              <template v-if="text == '1'">
                <Badge color="#87d068" :text="STATE_MAP[text]" />
              </template> -->
          <!--              <template v-if="column.dataIndex === 'indirectManTotal'">-->
          <!--                <span>{{ text * 100 }}%</span>-->
          <!--              </template>-->
          <!-- </template> -->
          <!-- <template v-else-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template> -->
          <!-- </template> -->
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <Form @register="registerForm" @reload="reload" />
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
    <ExportModal @register="registerExportModal" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    bulkdeleteBaseDataWagerate,
    delBaseDataWagerate,
    downloadBaseDataWagerateImportTemplate,
    exportBaseDataWagerate,
    getBaseDataWagerate,
    importBaseDataWagerate,
    saveBaseDataWagerate,
  } from '/@/api/finance/wageRate';
  import { onMounted, reactive, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { Badge } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import Form from './Form.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { cloneDeep } from 'lodash-es';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePopup } from '/@/components/Popup';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getTemplateDownload, importExcel, saveBatchData } from '/@/api/basicData/productCodeApply';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  defineOptions({ name: 'finance-basicInformation-wageRate' });
  const { hasBtnP } = usePermission();

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  // const STATE_MAP = {
  //   '1': t('dict.enableStatus.1'),
  //   '2': t('dict.enableStatus.2'),
  // };
  const STATE_MAP = [
    { id: '1', fullName: t('dict.enableStatus.1'), theme: 'green' },
    { id: '2', fullName: t('dict.enableStatus.2'), theme: 'red' },
  ];

  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '组织', field: 'orgName', width: 200 },
    {
      title: '主要制程',
      field: 'mainProcess',
      width: 160,
      formatter({ cellValue }) {
        const current = state.mainProcessList.find(item => item.enCode == cellValue);
        return current ? current.fullName : '-';
      },
    },
    {
      title: '工厂',
      field: 'factoryList',
      width: 260,
      formatter({ cellValue }) {
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          return cellValue.map(item => `${item.name}(${item.code})`).join(';');
        }
        return '';
      },
    },
    { title: '基数', field: 'baseName', width: 220 },
    { title: '直接', field: 'direct', width: 120 },
    { title: '间接', field: 'indirect', width: 120 },
    { title: '间/直%(公允)', field: 'indirectDirect', width: 180 },
    { title: '合计', field: 'total', width: 180 },
    { title: '系数', field: 'coefficient', width: 100 },
    {
      title: '间接总人工(%)',
      field: 'indirectManTotal',
      width: 180,
      formatter: ({ cellValue }) => {
        if (cellValue == null || cellValue === '') return '-';
        return (cellValue * 100).toFixed(2);
      },
    },
    {
      title: '是否启用',
      field: 'status',
      cellRender: {
        name: 'Tag',
        options: STATE_MAP,
      },
      width: 100,
    },
    { title: '备注', field: 'remark', width: 200 },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  interface StateType {
    sign: 'edit' | 'add';
    organizeIdTree: any[];
    mainProcessList: any[];
  }

  const state = reactive<StateType>({
    sign: 'edit',
    organizeIdTree: [],
    mainProcessList: [],
  });
  const { organizeIdTree } = toRefs(state);
  const [registerForm, { openModal: openFormModal }] = useModal();

  const [registerOrgForm, { getFieldsValue, setFieldsValue, updateSchema, clearValidate }] = useForm({
    schemas: getFormConfig(),
    labelWidth: 100,
    showActionButtonGroup: true,
    showAdvancedButton: false,
    useSearchForm: true,
    labelAlign: 'left',
    i18nConfig: {
      moduleCode: 'WageRateColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'finance-basicInformation-wageRate-list',
      columns: columns,
      api: getBaseDataWagerate,
      showIndexColumn: true,
      i18nConfig: { moduleCode: 'WageRateColumn' },
      rowConfig: {
        resizable: true,
      },
      showOverflow: false,
    },
  });

  const { reload, getSelectRowKeys, clearSelectedRowKeys } = gridApi;

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importBaseDataWagerate,
      importSaveApi: saveBaseDataWagerate,
      templateApi: downloadBaseDataWagerateImportTemplate,
      previewColumn: columns,
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  function getFormConfig() {
    return [
      //   resetFunc: async () => {
      //     state.organizeIdTree = [];
      //   },
      //   schemas: [
      {
        label: '',
        field: 'orgId',
        component: 'OrganizeSelect',
        slot: 'orgId',
        componentProps: {
          // placeholder: '组织',
          submitOnPressEnter: true,
        },
        colProps: { span: 5 },
      },
      {
        label: '',
        field: 'mainProcess',
        component: 'Select',
        componentProps: {
          placeholder: '主要制程',
          submitOnPressEnter: true,
        },
        colProps: { span: 5 },
      },
      {
        label: '',
        field: 'status',
        component: 'Select',
        componentProps: {
          placeholder: '选择状态',
          submitOnPressEnter: true,
        },
        colProps: { span: 5 },
      },
    ];
  }

  // getFieldsValue
  function handleSubmit() {
    const values = getFieldsValue();
    console.log(values);
    console.log(gridApi, 'gridApigridApigridApi');
    const { grid } = gridApi;
    grid.commitProxy('query', values);
  }

  function handleReset() {
    state.organizeIdTree = [];
    clearValidate();
    setFieldsValue({
      orgId: '',
      mainProcess: '',
      status: '',
    });
    gridApi?.grid?.commitProxy?.('query', {});
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, { ...record, sign: 'view' }),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-extend-pencil',
        onClick: handleEdit.bind(null, { ...record, sign: 'edit' }),
        auth: 'btn_edit',
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
    openFormModal(true, record);
  }

  function handleExport() {
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      listQuery: {
        ...getFieldsValue(),
      },
      api: exportBaseDataWagerate,
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'WageRateColumn',
      },
    });
  }

  async function onDelete(id) {
    const { code, msg } = await delBaseDataWagerate(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }

  async function handleDel() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectDelDatasTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await bulkdeleteBaseDataWagerate(selectKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  function handleApply() {
    openFormModal(true, {
      id: '',
    });
  }

  async function getTypeOps() {
    const mainProcesslist = await baseStore.getDictionaryData('MainProcess');
    const list = await baseStore.getDictionaryData('Supplier.Status');
    state.mainProcessList = (mainProcesslist as any[]) || [];
    updateSchema([
      {
        field: 'status',
        componentProps: {
          options: list,
          fieldNames: { value: 'enCode' },
        },
      },
      {
        field: 'mainProcess',
        componentProps: {
          options: mainProcesslist,
          fieldNames: { value: 'enCode', label: 'fullName' },
        },
      },
    ]);
  }

  function handleImport() {
    openImportModal(true, {});
  }

  onMounted(async () => {
    await getTypeOps();
    reload();
  });
</script>
<style lang="less" scoped>
  // :deep(.icon-ym) {
  //   font-size: 18px;
  // }
</style>
