<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_add'" type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <!-- <a-dropdown>
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item v-if="hasBtnP('btn_upload')" key="import">{{ t('common.batchImport') }}</a-menu-item>
                  <a-menu-item v-if="hasBtnP('btn_download')" key="export">{{ t('common.batchExport') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown> -->
            <!-- <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button> -->
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'statusDesc'">
              <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.statusDesc }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'typeDesc'">
              <a-tag :color="record.type === 1 ? 'success' : record.type === 2 ? 'warning' : record.type === 3 ? 'blue' : 'error'">{{ record.typeDesc }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'processTypeDesc'">
              <a-tag :color="record.processType === 1 ? 'success' : record.processType === 2 ? 'warning' : 'blue'">{{ record.processTypeDesc }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <!-- <ExportModal @register="registerExportModal" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" /> -->
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getProcessCode, deleteProcessCode, blukDeleteProcessCode, exportProcessCodeExcel } from '/@/api/engineering/process';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  // import ExportModal from '/@/components/ExportModal/index.vue';
  // import BatchUpload from './components/importPop.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    typeList: any[];
    processTypeList: any[];
  }

  const state = reactive<State>({
    typeList: [],
    processTypeList: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns: BasicColumn[] = [
    { title: '类型', dataIndex: 'type' },
    { title: '类型名称', dataIndex: 'typeCodeName' },
    { title: '代码', dataIndex: 'code', align: 'center' },
    { title: '名称', dataIndex: 'name', align: 'center' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'typeCode',
      label: '',
      i18nField: 'type',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择类型',
        api: () => {
          return baseStore.getDictionaryData('PCC.ProcessType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入代码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入名称',
      },
      colProps: { span: 4 },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, clearSelectedRowKeys, reload, getFetchParams, getForm }] = useTable({
    api: getProcessCode,
    title: '',
    columns,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      i18nConfig: {
        moduleCode: 'ProcessCodeColumn',
        transferRange: ['placeholder'],
      },
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开
    bordered: true, //显示表格边框
    showIndexColumn: false, //显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 70,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    i18nConfig: {
      moduleCode: 'ProcessCodeColumn',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
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
  function addOrUpdateHandle(record = '') {
    openFormModal(true, { record, typeList: state.typeList, processTypeList: state.processTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcessCode(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      getRowSelection().selectedRowKeys = [];
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code, msg } = await blukDeleteProcessCode(list);
            if (code == 200) {
              message.warning(msg);
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
  function handleExport() {
    openExportModal(true, {
      api: exportProcessCodeExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }
</script>
