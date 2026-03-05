<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_add'" type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> 新增</a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> 批量删除 </a-button>
            <a-button v-auth="'btn_download'" type="primary" @click="handleExport"
              ><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }}
            </a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? '是' : '否' }}</a-tag>
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
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { debounce } from '/@/utils/debounce';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import { getCustomerCodeByCode } from '/@/api/business/customerCode';
  import { getISOCodeList } from '/@/api/basicData/currency';
  import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
  import { getCustomerMaterial, deleteCustomerMaterial, blukDeleteCustomerMaterial } from '/@/api/business/customerMaterial';

  import ExportModal from './components/ExportModal.vue';
  const { t } = useI18n();

  interface State {
    industryTypeList: any[];
    insidePartNumberList: any[];
    customerCodeList: any[];
  }

  const state = reactive<State>({
    industryTypeList: [],
    insidePartNumberList: [],
    customerCodeList: [],
  });
  //
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const columns: BasicColumn[] = [
    { title: '所属组织', dataIndex: 'OrgName' },
    { title: '内部料号', dataIndex: 'InsidePartNumber' },
    { title: '内部物料描述', dataIndex: 'ProductDesc' },
    { title: '客户编码', dataIndex: 'CustomerCode' },
    { title: '客户物料编码', dataIndex: 'CustomerMaterialCode' },
    { title: '客户物料描述', dataIndex: 'CustomerMaterialDesc' },
    { title: '客户物料规格', dataIndex: 'CustomerMaterialSpec' },
    { title: '单重', dataIndex: 'Weight' },
    { title: '重量单位', dataIndex: 'WeightUnit' },
    { title: '币别', dataIndex: 'ISOCode' },
    { title: '生效日期', dataIndex: 'EffectiveDate', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '失效日期', dataIndex: 'ExpirationDate', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '客服', dataIndex: 'CustomerService' },
    { title: '备注', dataIndex: 'Remark' },
    { title: '创建人', dataIndex: 'CreatorUserName' },
    { title: '创建时间', dataIndex: 'CreatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'LastModifyUserName' },
    { title: '修改时间', dataIndex: 'LastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'InsidePartNumber',
      label: '',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '内部料号',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          getDetailByInsidePartNumber(value);
        },
      },
      colProps: { span: 5 },
    },
    {
      field: 'CustomerCode',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '客户编码',
        showSearch: true,
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateCustomerCode(value);
        },
      },
      colProps: { span: 5 },
    },
    {
      field: 'CustomerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '客户物料编码',
      },
      colProps: { span: 5 },
    },
    {
      field: 'CustomerMaterialDesc',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '客户物料描述',
      },
      colProps: { span: 5 },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据；
  const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
    api: getCustomerMaterial,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
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
    openFormModal(true, {
      id,
      industryTypeList: state.industryTypeList,
      insidePartNumberList: state.insidePartNumberList,
      customerCodeList: state.customerCodeList,
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteCustomerMaterial(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      return message.warning('请选中需要删除的行');
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: '此操作将永久删除该数据, 是否继续？',
        onOk: async () => {
          try {
            const { code } = await blukDeleteCustomerMaterial(list);
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

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, { listQuery });
  }

  //通过内部料号去做模糊查询，更新下拉列表
  const getDetailByInsidePartNumber = debounce(async value => {
    const optionList = await getQuantitationApplyDetailByMaterial(value);
    const optionPartNumber = optionList.data.map(i => {
      return {
        id: i.InsidePartNumber,
        fullName: i.InsidePartNumber,
      };
    });
    getForm().updateSchema([
      {
        field: 'InsidePartNumber',
        componentProps: {
          options: optionPartNumber,
        },
      },
    ]);
  }, 300);

  //通过客户代码去做模糊查询，更新下拉列表
  const updateCustomerCode = debounce(async value => {
    const optionList = await getCustomerCodeByCode(value);
    const optionCustomerCode = optionList.data.map(i => {
      return {
        id: i.Code,
        fullName: i.Code,
      };
    });
    getForm().updateSchema([
      {
        field: 'CustomerCode',
        componentProps: {
          options: optionCustomerCode,
        },
      },
    ]);
  }, 300);

  //组件挂载后给下拉列表赋值
  onMounted(async () => {
    const optionList = await getISOCodeList();
    const optionListDBM = (await getQuantitationApplyDetailByMaterial(' ')).data.map(i => {
      return {
        id: i.InsidePartNumber,
        fullName: i.InsidePartNumber,
      };
    });
    const optionISO = optionList.data.map(i => {
      return {
        id: i.ISOCode,
        fullName: i.ISOCode,
      };
    });

    const optionCustomerCode = (await getCustomerCodeByCode()).data.map(i => {
      return {
        id: i.customerCode,
        fullName: i.customerCode + '(' + i.name + ')',
      };
    });
    state.industryTypeList = optionISO as any[];
    state.insidePartNumberList = optionListDBM as any[];
    state.customerCodeList = optionCustomerCode as any[];
    getForm().updateSchema([
      {
        field: 'InsidePartNumber',
        componentProps: {
          options: optionListDBM,
        },
      },
      {
        field: 'CustomerCode',
        componentProps: {
          options: optionCustomerCode,
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
