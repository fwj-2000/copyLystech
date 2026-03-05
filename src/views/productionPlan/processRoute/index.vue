<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="addOrUpdateHandle" v-if="hasBtnP('btn_add')">{{ t('common.add') }}</a-button>
              <vShowDropdown>
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                  <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <a-button @click="handleDeleteList()" v-if="hasBtnP('btn_batchRemove')">{{ t('common.batchDelText') }}</a-button>
              <a-button @click="handleObsoleteList()" v-if="hasBtnP('btn_btn_obsoleteProcessRoute')">{{ t('common.abandonedProcessRoute') }}</a-button>
            </a-space>
          </template>
          <template #id="{ row }">
            <span class="table-a" @click="handleViewFlow(row)">{{ t('common.viewDetails') }}</span>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <a-modal v-model:visible="isShowModalconfirm" centered :title="t('common.copyProcessRoute')" @ok="handleOk">
      <div class="p-16px">
        <a-input v-model:value="routeName" :placeholder="t('dict.CommonCol.enterProcessRoute')" allowClear />
      </div>
    </a-modal>
    <add @register="registerForm" @reload="reload" @saveAndDesign="saveAndDesign" />
    <ExportModal @register="registerExportModal" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" />
    <FlowPop @register="registerFlowPop" @refresh="reload" />
    <FlowModal @register="registerFlowModal" />
  </div>
</template>

<script setup lang="ts">
  import { cloneDeep } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getProcessRoute,
    deleteProcessRoute,
    blukDeleteProcessRoute,
    obsoleteProcessRoute,
    exportProcessRouteExcel,
    copyRoute,
  } from '/@/api/productionPlan/processRoute';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import FlowPop from './components/FlowPop.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted, ref, unref, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { FlowModal } from '/@/components/CustomComponents';

  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { getRouteDetail } from '/@/api/productionPlan/processRoute';
  import { usePermission } from '/@/hooks/web/usePermission';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { hasBtnP } = usePermission();

  const { t } = useI18n();
  const baseStore = useBaseStore();

  defineOptions({ name: 'productionPlan-processRoute' });
  interface State {
    routeTypeList: any[];
    copyItem: { id? };
  }
  const RouteStatus_OPTIONS = [
    { id: 0, fullName: t('dict.newMoldStatus.0'), theme: 'gray', rowKey: 'routeStatus' },
    { id: 1, fullName: t('dict.ProcessRoute.RouteStatus.1'), theme: 'green', rowKey: 'routeStatus' },
  ];

  const STATUS_OPTIONS = [
    { id: 1, fullName: t('dict.enableStatus.1'), theme: 'green', rowKey: 'status' },
    { id: 2, fullName: t('dict.enableStatus.2'), theme: 'red', rowKey: 'status' },
  ];

  const state = reactive<State>({
    routeTypeList: [],
    copyItem: {},
  });

  const isShowModalconfirm = ref(false);
  const routeName = ref('');

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerFlowModal, { openModal: openFlowModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerFlowPop, { openPopup: openFlowPop }] = usePopup();

  const column = [
    // { title: '工艺路线类型', dataIndex: 'routeTypeName', align: 'center' },
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '版本', field: 'version', width: 100 },
    { title: '工艺路线编码', field: 'routeCode', width: 120 },
    { title: '工艺路线名称', field: 'routeName', minWidth: 130 },
    { title: '工艺路线图', field: 'id', slots: { default: 'id' }, width: 120 },
    { title: '工艺路线类型', field: 'processRouteTypeName', width: 120 },
    {
      title: '工艺路线状态',
      field: 'routeStatus',
      i18nField: 'routeStatusName',
      cellRender: {
        name: 'Tag',
        options: RouteStatus_OPTIONS,
      },
      width: 120,
    },
    { title: '所属组织', field: 'orgName', width: 120 },
    {
      title: '是否启用',
      i18nField: 'CommonCol.isEnable',
      field: 'status',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 120,
    },
    { title: '申请部门', field: 'applyDeptName', width: 120 },
    { title: '创建人', field: 'creatorUserName', width: 150 },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
      width: 120,
    },
    { title: '修改人', field: 'lastModifyUserName', width: 150 },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      width: 130,
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 120, fixed: 'right' },
    { title: '备注', field: 'remark' },
  ];

  function getVxeSchema() {
    return [
      {
        fieldName: 'routeCode',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '请输入工艺路线编码',
        },
        colProps: { span: 5 },
      },
      {
        fieldName: 'routeName',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '请输入工艺路线名称',
        },
        colProps: { span: 5 },
      },
      {
        fieldName: 'processRouteType',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '工艺路线类型',
          api: () => baseStore.getDictionaryData('processRouteType'),
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'fullName',
          valueField: 'enCode',
        },
        colProps: { span: 5 },
      },
      {
        fieldName: 'status',
        label: '',
        component: 'Select',
        i18nField: 'CommonCol.isEnable',
        componentProps: {
          placeholder: '状态',
          options: [
            { fullName: t('dict.enableStatus.1'), id: 1 },
            { fullName: t('dict.enableStatus.2'), id: 2 },
          ],
          fieldNames: { label: 'fullName', value: 'id' },
        },
        colProps: { span: 5 },
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
        moduleCode: 'ProcessRouteColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-processRoute-list',
      columns: column,
      api: getProcessRoute,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ProcessRouteColumn',
      },
    },
  });
  const { reload, getSelectRowKeys, clearSelectedRowKeys, updateSchema, getFetchParams, getDataSource } = gridApi;

  // //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, clearSelectedRowKeys, reload, getFetchParams, getForm, getDataSource }] = useTable({
  //   api: getProcessRoute,
  //   title: '',
  //   columns,
  //   rowKey: 'id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     autoAdvancedLine: 0, //自动展开行
  //     showAdvancedButton: false,
  //     baseColProps: { span: 5 },
  //     actionColOptions: {
  //       span: 4,
  //     },
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: true, //刷新按钮,默认打开
  //   showIndexColumn: true, //显示序号
  //   pagination: {
  //     size: 'small',
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 120,
  //     title: '操作',
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   i18nConfig: {
  //     moduleCode: 'ProcessRouteColumn',
  //   },
  // });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: copyProcess.bind(null, record),
        auth: 'btn_copy',
        tooltip: t('common.copy'),
      },
      {
        icon: 'ym-diecut ym-diecut-fork',
        onClick: setProcess.bind(null, record),
        auth: 'btn_design',
        tooltip: t('common.design'),
      },
      {
        icon: 'ym-diecut ym-diecut-a-chakanxiangqing1',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_edit',
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  async function saveAndDesign() {
    await reload();
    setProcess(getDataSource()[0]);
  }

  async function handleOk() {
    if (!routeName.value) return createMessage.warning(t('common.enterProcessRoute'));
    const { code, msg } = await copyRoute({ id: state.copyItem.id, routeName: unref(routeName) });
    if (code === 200) {
      isShowModalconfirm.value = false;
      await reload();
      setProcess(getDataSource()[0]);
      return createMessage.success(msg);
    }
    createMessage.warning(msg);
  }

  function copyProcess(item) {
    state.copyItem = item;
    isShowModalconfirm.value = true;
  }

  function setProcess(record: any) {
    openFlowPop(true, { id: record.id, title: t('layout.header.setting'), routeStatus: record.routeStatus, circulationType: record.circulationType });
  }

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    openFormModal(true, { record, routeTypeList: state.routeTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcessRoute(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return createMessage.warning(t('common.selectDataToDelete'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteProcessRoute(list);
            if (code == 200) {
              createMessage.warning(t('common.delSuccess'));
            }
            clearSelectedRowKeys();
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  //废弃工艺路线
  async function handleObsoleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return createMessage.warning(t('common.selectDiscardedData'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.isAbandonProcessRoute'),
        onOk: async () => {
          try {
            const { code, msg } = await obsoleteProcessRoute(list);
            if (code == 200) {
              createMessage.warning(msg);
            }
            clearSelectedRowKeys();
            reload();
          } catch (e) {
            clearSelectedRowKeys();
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
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }
  //导出
  async function handleExport() {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      api: exportProcessRouteExcel,
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ProcessRouteColumn',
      },
    });
  }

  const handleViewFlow = record => {
    if (!hasBtnP('btn_detail')) return createMessage.warning(t('common.noViewingPermission'));
    openFlowModal(true, {
      title: t('common.add'),
      flowId: record.id,
      flowApi: getRouteDetail,
      isPreview: true,
    });
  };

  onMounted(async () => {
    const process = (await baseStore.getDictionaryData('ProcessRoute.RouteType')) as any[];
    const optionsProcess = process.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.routeTypeList = optionsProcess;
    updateSchema([
      {
        fieldName: 'routeType',
        componentProps: {
          options: optionsProcess,
        },
      },
    ]);

    // const routeStatus = (await baseStore.getDictionaryData('ProcessRoute.RouteStatus')) as any[];
    // const optionsRouteStatus = routeStatus.map(i => {
    //   return {
    //     id: i.enCode,
    //     fullName: i.fullName,
    //   };
    // });
    // getForm().updateSchema({
    //   field: 'routeStatus',
    //   componentProps: {
    //     options: optionsRouteStatus,
    //   },
    // });
  });
</script>
