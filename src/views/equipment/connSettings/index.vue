<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> 新增</a-button>
            <a-button @click="handleDeleteList()"> 批量删除 </a-button>
            <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }} </a-button>
          </template>
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'status'">
              <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.status === 1 ? t('common.yesText') : t('common.noText') }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'commMethod'">
              <div>{{ state.commMethodList.find(item => item?.id == text)?.fullName }}</div>
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
    <bindParmPopup @register="registerbindParmPopup" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getDataFormat, deleteDataFormat, blukDeleteDataFormat, exportDataFormatExcel } from '/@/api/equipment/connSettings';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import bindParmPopup from './components/bindParmPopup.vue';
  import { usePopup } from '/@/components/Popup';

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

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerbindParmPopup, { openPopup: openbindParmPopup }] = usePopup();

  const columns: BasicColumn[] = [
    { title: '编码', dataIndex: 'code', align: 'center' },
    { title: '名称', dataIndex: 'name' },
    { title: '设备分类', dataIndex: 'equipmentType' },
    { title: '通讯协议', dataIndex: 'commMethod' },
    { title: 'ip地址', dataIndex: 'ip' },
    { title: '端口号', dataIndex: 'port' },
    { title: '版本号', dataIndex: 'version' },
    { title: '是否启用', dataIndex: 'status' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'lastModifyUserName' },
    { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'Code',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'name',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称',
      },
      colProps: { span: 4 },
    },
    {
      field: 'equipmentType',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备类型',
      },
      colProps: { span: 4 },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
    api: getDataFormat,
    title: '',
    columns,
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
        moduleCode: 'ConnSettingsColumn',
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
      width: 100,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    i18nConfig: {
      moduleCode: 'ConnSettingsColumn',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        tooltip: t('common.view'),
        onClick: addOrUpdateHandle.bind(null, record.id),
      },
      {
        icon: 'icon-ym icon-ym-h5',
        tooltip: t('common.bindParm'),
        onClick: bindParm.bind(null, record),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, equipmentTypeList: state.equipmentTypeList, commMethodList: state.commMethodList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteDataFormat(record.id).then(res => {
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
            const { code } = await blukDeleteDataFormat(list);
            if (code == 200) {
              getRowSelection().selectedRowKeys = [];
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            getRowSelection().selectedRowKeys = [];
            reload();
            throw e;
          }
        },
      });
    }
  }

  //导出
  //导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportDataFormatExcel,
      listQuery: {
        ...getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'dataIndex',
      exportOptions: columns,
      i18nConfig: {
        moduleCode: 'ConnSettingsColumn',
      },
    });
  };

  //绑定命令
  function bindParm(param) {
    openbindParmPopup(true, {
      param: param,
    });
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
