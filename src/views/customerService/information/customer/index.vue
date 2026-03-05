<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <!--            <a-button v-auth="'btn_download'" type="primary" @click="handleExport"-->
            <!--              ><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }}-->
            <!--            </a-button>-->
            <!--            <a-button v-auth="'btn_upload'" type="link" @click="handleImport"-->
            <!--              ><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.importText') }}-->
            <!--            </a-button>-->
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-auth="'btn_upload'">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-auth="'btn_download'">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_sapSync'" @click="handleTogether"> {{ t('common.syncSap') }} </a-button>
          </template>
          <template #mainProcess="{ row }">
            {{ optionsProcessList.find(c => c.id == row.mainProcess)?.fullName }}
          </template>
          <template #labelImage="{ row }">
            <div class="table-a" @click="showLableImage(row)">{{ t('common.viewDetails') }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <SyncSAP @register="registerSyncSAPForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @reload="reload"></ImportModal>
    <LabelImageModal @register="registerLabelImageModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getCustomerCode,
    deleteCustomerCode,
    bulkDeleteCustomerCode,
    exportCustomerCodeExcel,
    importExcel,
    saveBatchData,
    getTemplateDownload,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
  } from '/@/api/business/customerCode';
  import { getHarhorList } from '/@/api/basicData/harhor';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted, toRefs } from 'vue';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { useBaseStore } from '/@/store/modules/base';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  import SyncSAP from './components/SyncSAP.vue';
  import { usePopup } from '/@/components/Popup';
  import { usePermission } from '/@/hooks/web/usePermission';
  import LabelImageModal from './components/labelImageModal.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  defineOptions({ name: 'customerService-information-customer' });

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  interface State {
    industryTypeList: any[];
    industryCustomerType: any[];
    industryFilingsApply: any[];
    optionsProcessList: any[];
  }

  const state = reactive<State>({
    industryTypeList: [],
    industryCustomerType: [],
    industryFilingsApply: [],
    optionsProcessList: [],
  });
  const { optionsProcessList } = toRefs(state);

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerSyncSAPForm, { openModal: openSyncSAPFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerLabelImageModal, { openModal: openLabelImageModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox' },
    {
      title: '主要制程',
      field: 'mainProcess',
      importField: 'mainProcessName',
      slots: { default: 'mainProcess' },
    },
    { title: 'SAP代码', field: 'code', width: 100 },
    { title: '直接客户代码', field: 'customerCode', width: 100 },
    { title: '直接客户简称', field: 'name', width: 100 },
    { title: '直接客户全称', field: 'fullName' },
    {
      title: '标签图片',
      field: 'labelImage',
      slots: { default: 'labelImage' },
    },
    { title: '备案语言', field: 'filingLanguageName' },
    { title: '所属组织', field: 'orgName' },
    { title: '口岸', field: 'harhor' },
    { title: '客服', field: 'customerService' },
    { title: '出货方式', field: 'shipmentMode' },
    { title: '客户所属地区', field: 'region' },
    {
      title: '是否启用',
      field: 'status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: [
          { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'status' }, // 启用
          { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'status' }, // 禁用
        ],
      },
    },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 150,
      cellRender: { name: 'Date' },
    },
    { title: '修改人', field: 'lastModifyUserName' },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      width: 150,
      cellRender: { name: 'Date' },
    },
    { title: '备注', field: 'remark' },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      fixed: 'right',
      width: 70,
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'code',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入SAP代码',
      },
    },
    {
      fieldName: 'customerCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入直接客户代码',
      },
    },
    {
      fieldName: 'name',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入直接客户名称',
      },
    },
    {
      fieldName: 'mainProcess',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择主要制程',
        fieldNames: {
          value: 'id',
          label: 'fullName',
        },
      },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      componentProps: {
        options: [
          { label: t('common.yes'), value: 1 },
          { label: t('common.no'), value: 2 },
        ],
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'CustomerColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-customer-list',
      columns: columns,
      showIndexColumn: true,
      api: getCustomerCode,
      toolbarConfig: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'CustomerColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams, updateSchema } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.id),
        auth: 'btn_detail',
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
  async function addOrUpdateHandle(id = '') {
    const harhorList = (await getHarhorList()).data;
    const harhorOptions = harhorList
      ? harhorList.map(i => {
          return {
            id: i.Name,
            fullName: i.Name,
          };
        })
      : [];
    state.industryTypeList = harhorOptions as any[];
    openFormModal(true, {
      id,
      industryTypeList: state.industryTypeList,
      industryCustomerType: state.industryCustomerType,
      industryFilingsApply: state.industryFilingsApply,
      optionsProcessList: state.optionsProcessList,
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteCustomerCode(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const ids = getSelectRowKeys();
    if (ids?.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          const { code } = await bulkDeleteCustomerCode(ids);
          if (code == 200) {
            createMessage.success(t('common.delSuccess'));
          }
          reload();
        },
      });
    }
  }

  //导出
  async function handleExport() {
    const listQuery = {
      ...(await getFetchParams()),
    };
    openExportModal(true, {
      api: exportCustomerCodeExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      excludeFields: ['labelImage'],
      i18nConfig: {
        moduleCode: 'CustomerColumn',
      },
    });
  }

  //同步SAP数据
  function handleTogether() {
    openSyncSAPFormModal(true, {
      optionsProcessList: state.optionsProcessList,
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importExcel,
      importSaveApi: saveBatchData,
      templateApi: getTemplateDownload,
      previewColumn: columns,
      usePolling: true,
      pollingParams: {
        interval: 3000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      excludeFields: ['customerCode', 'orgName', 'labelImage', 'creatorUserName', 'creatorTime', 'lastModifyUserName', 'lastModifyTime'],
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  function showLableImage(row: any) {
    openLabelImageModal(true, row);
  }

  onMounted(async () => {
    //主要制程
    const process = (await baseStore.getDictionaryData('MainProcess')) as any[];
    const optionsProcess = process.map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.optionsProcessList = optionsProcess;

    //FilingsApply
    const FilingsApply = (await baseStore.getDictionaryData('ShipmentType')) as any[];
    state.industryFilingsApply = FilingsApply.map(i => {
      return {
        id: i.fullName,
        fullName: i.fullName,
      };
    });
    const res = (await getBaseDataTerminalCustomerList()) as any[];
    const CustomerType = res.data;
    state.industryCustomerType = CustomerType.map(i => {
      return {
        id: i.enCode,
        fullName: i.enCode + '(' + i.fullName + ')',
      };
    });
    updateSchema([
      {
        fieldName: 'mainProcess',
        componentProps: {
          options: optionsProcess,
        },
      },
    ]);
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }

  .table-a {
    color: #1890ff;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
