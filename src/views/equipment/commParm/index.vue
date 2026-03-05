<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> 新增</a-button>
            <a-button @click="handleDeleteList()"> 批量删除 </a-button>
            <!-- <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon">
              </i>{{ t('common.exportText') }} </a-button>
            <a-button @click="handleImport"><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{
              t('common.importText') }} </a-button> -->
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.status === 1 ? '是' : '否' }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getEquipmentProtocolParm, deleteEquipmentProtocolParm, blukDeleteEquipmentProtocolParm } from '/@/api/equipment/commParm';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import add from './components/add.vue';

  const [registerForm, { openModal: openFormModal }] = useModal();

  const { t } = useI18n();
  const baseStore = useBaseStore();
  interface State {
    equipmentTypeList: any[];
    commMethodList: any[];
  }

  const state = reactive<State>({
    equipmentTypeList: [],
    commMethodList: [],
  });

  const columnsTCP: BasicColumn[] = [];

  const columnsUDP: BasicColumn[] = [
    { title: '协议类型', dataIndex: 'commMethod', align: 'center' },
    { title: '编码', dataIndex: 'code', align: 'center' },
    { title: '设备类型', dataIndex: 'equipmentType' },
    { title: '报头', dataIndex: 'header' },
    { title: '系统', dataIndex: 'systemNumber' },
    { title: '参数类型', dataIndex: 'parameterType' },
    { title: '轴号', dataIndex: 'axisNumber' },
    { title: '参数代码', dataIndex: 'parameterCode' },
    { title: '参数名称', dataIndex: 'parameterName' },
    { title: '参数值', dataIndex: 'parameterValue' },
    { title: '报尾', dataIndex: 'tail' },
    { title: '是否启用', dataIndex: 'status' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'lastModifyUserName' },
    { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const columnsModbusTcp: BasicColumn[] = [
    { title: '协议类型', dataIndex: 'commMethod', align: 'center' },
    { title: '编码', dataIndex: 'code', align: 'center' },
    { title: '设备分类', dataIndex: 'equipmentType' },
    { title: '从站地址', dataIndex: 'slaveId' },
    { title: '功能码', dataIndex: 'funCode' },
    { title: '起始地址', dataIndex: 'startAddress' },
    { title: '地址数量', dataIndex: 'addressNum' },
    { title: '是否启用', dataIndex: 'status' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'lastModifyUserName' },
    { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'commMethod',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择协议类型',
        onChange: e => {
          init(e);
        },
      },
      colProps: { span: 4 },
    },
    {
      field: 'code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入编码',
      },

      colProps: { span: 4 },
    },
    {
      field: 'equipmentType',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请输入设备类型',
      },
      colProps: { span: 4 },
    },
    {
      field: 'status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: '是', id: 1 },
          { fullName: '否', id: 2 },
        ],
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, reload, getForm, setColumns }] = useTable({
    api: getEquipmentProtocolParm,
    title: '',
    columns: columnsUDP,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
      autoAdvancedLine: 1, //自动展开行
      i18nConfig: {
        moduleCode: 'CommParmColumn',
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
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
    i18nConfig: {
      moduleCode: 'CommParmColumn',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  async function addOrUpdateHandle(id = '') {
    const commMethod = getForm().getFieldsValue().commMethod;
    openFormModal(true, {
      id,
      commMethod,
      equipmentTypeList: state.equipmentTypeList,
      commMethodList: state.commMethodList,
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteEquipmentProtocolParm(record.Id).then(res => {
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
            const { code } = await blukDeleteEquipmentProtocolParm(list);
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
    // openImportModal(true, {});
  }
  //导出
  function handleExport() {
    // const listQuery = {
    //   ...getFetchParams(),
    // };
    // openExportModal(true, { listQuery });
  }

  function init(e) {
    if (e == 'TCP') {
      setColumns(columnsTCP);
    }
    if (e == 'ModbusTcp') {
      setColumns(columnsModbusTcp);
    }
    if (e == 'UDP') {
      setColumns(columnsUDP);
    }
    getForm().submit();
  }

  onMounted(async () => {
    const equipmentTypeList = ((await baseStore.getDictionaryData('EquipmentClass')) as any[]).map(i => {
      return {
        id: i.fullName,
        fullName: i.fullName,
      };
    });
    state.equipmentTypeList = equipmentTypeList;
    const commMethodList = ((await baseStore.getDictionaryData('ProtocolType')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.commMethodList = commMethodList;
    getForm().updateSchema([
      {
        field: 'equipmentType',
        componentProps: {
          options: equipmentTypeList,
        },
      },
      {
        field: 'commMethod',
        defaultValue: commMethodList[0].fullName,
        componentProps: {
          options: commMethodList,
        },
      },
    ]);
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
