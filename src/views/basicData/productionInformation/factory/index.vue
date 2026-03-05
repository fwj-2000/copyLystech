<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'add'" type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> 新增</a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> 批量删除 </a-button>
            <a-button v-auth="'btn_download'" type="primary" @click="handleExport"
              ><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }}
            </a-button>
            <a-button v-auth="'btn_upload'" @click="handleImport"
              ><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.importText') }}
            </a-button>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? '有效' : '失效' }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getFactory, deleteFactory, blukDeleteFactory } from '/@/api/basicData/factory';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  import ExportModal from './components/ExportModal.vue';
  import ImportModal from './components/ImportModal.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    typeOption: any[];
    SAPFactoryCodes: any[];
    SAPFactoryNames: any[];
    MainProcess: any[];
  }

  const state = reactive<State>({
    typeOption: [],
    SAPFactoryCodes: [],
    SAPFactoryNames: [],
    MainProcess: [],
  });

  const [registerForm, { openModal: openFormModal, setModalProps }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns: BasicColumn[] = [
    { title: '工厂编码', dataIndex: 'Code', align: 'center' },
    { title: '工厂名称', dataIndex: 'Name' },
    { title: 'SAP工厂编码', dataIndex: 'SAPFactoryCodeTitle' },
    { title: 'SAP工厂名称', dataIndex: 'SAPFactoryNameTitle' },
    { title: '厂区', dataIndex: 'FactoryArea' },
    { title: '主要制程', dataIndex: 'MainProcessTitle' },
    { title: '是否启用', dataIndex: 'Status' },
    { title: '备注', dataIndex: 'Remark' },
    { title: '创建人', dataIndex: 'CreatorUserName' },
    { title: '创建时间', dataIndex: 'CreatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'LastModifyUserName' },
    { title: '修改时间', dataIndex: 'LastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'Code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入工厂编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'Name',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工厂名称',
      },
      colProps: { span: 4 },
    },
    {
      field: 'SAPFactoryCode',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择SAP工厂编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'SAPFactoryName',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择SAP工厂名称',
      },
      colProps: { span: 4 },
    },
    {
      field: 'MainProcess',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择主要制程',
      },
      colProps: { span: 4 },
    },
    {
      field: 'pickerVal',
      label: '',
      labelWidth: 70,
      component: 'DateRange',
      colProps: { span: 4 },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
    api: getFactory,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开
    bordered: true, //显示表格边框
    showIndexColumn: true, //显示序号
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
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    setModalProps({ height: 860, width: 600, useWrapper: false });
    openFormModal(true, { id, SAPFactoryCodes: state.SAPFactoryCodes, SAPFactoryNames: state.SAPFactoryNames, MainProcess: state.MainProcess });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteFactory(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      getRowSelection().selectedRowKeys = [];
      return message.warning('请选中需要删除的行');
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: '此操作将永久删除该数据, 是否继续？',
        onOk: async () => {
          try {
            const { code } = await blukDeleteFactory(list);
            if (code == 200) {
              getRowSelection().selectedRowKeys = [];
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            getRowSelection().selectedRowKeys = [];
            reload();
          }
        },
      });
    }
  }

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, { listQuery });
  }

  onMounted(async () => {
    baseStore.getDictionaryData('SAPFactoryCode').then(res => {
      state.SAPFactoryCodes = res as any[];
      getForm().updateSchema({
        field: 'SAPFactoryCode',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });

    baseStore.getDictionaryData('SAPFactoryName').then(res => {
      state.SAPFactoryNames = res as any[];
      getForm().updateSchema({
        field: 'SAPFactoryName',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });

    baseStore.getDictionaryData('MainProcess').then(res => {
      var result = res as any[];
      for (let i = 0; i < result.length; i++) {
        result[i].enCode = Number(result[i].enCode);
      }
      state.MainProcess = result;
      getForm().updateSchema({
        field: 'MainProcess',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
