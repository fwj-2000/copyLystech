import { BasicColumn } from '/@/components/Table';
import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import { getCustomerList, getFactoryList, getinnermaterialnumberlist } from '/@/api/customerSerivce/index';

export const formConfig = {
  baseColProps: { span: 3 },
  actionColOptions: {
    span: 3,
  },
  showActionButtonGroup: true,
  showAdvancedButton: false,
  compact: true,
  labelAlign: 'left',
  labelWidth: 0,
  schemas: [
    {
      field: 'InnerMaterialNumber',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '产品内部料号',
        maxlength: 50,
        submitOnPressEnter: true,
        api: getinnermaterialnumberlist,
        labelField: 'InnerMaterialNumber',
        valueField: 'InnerMaterialNumber',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        useChangeCopy: true,
      },
    },
    {
      field: 'FactoryId',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂:平湖一厂/MQ01',
        maxlength: 50,
        api: getFactoryList,
        nameFormat: ['Name', '/', 'Code'],
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        useChangeCopy: true,
        submitOnPressEnter: true,
      },
    },
    {
      field: 'DirectCustomerName',
      label: '',
      component: 'Input',
      labelWidth: 100,
      componentProps: { placeholder: '直接客户信息', maxlength: 50 },
    },
    {
      field: 'DirectCustomerMaterialNumber',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '直接客户料号',
        maxlength: 50,
        api: getCustomerList,
        // nameFormat: ['name', '/', 'code'],
        labelField: 'name',
        valueField: 'code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        useChangeCopy: true,
        submitOnPressEnter: true,
      },
    },
    {
      field: 'TerminalCustomerMaterialNumber',
      label: '',
      component: 'Input',
      labelWidth: 100,
      componentProps: { placeholder: '终端客户料号', maxlength: 50 },
    },
    {
      field: 'CurrentUser',
      label: '',
      component: 'Input',
      labelWidth: 100,
      componentProps: { placeholder: '当前处理人', maxlength: 50 },
    },
    {
      field: 'Status',
      label: '',
      component: 'ApiSelect',
      labelWidth: 100,
      componentProps: { placeholder: '状态', maxlength: 50 },
    },
    // {
    //   field: 'CustomerPersonName',
    //   label: '',
    //   component: 'CustomUserSelect',
    //   labelWidth: 100,
    //   componentProps: { placeholder: '客服', maxlength: 50 },
    // },
  ],
};

export const columns: BasicColumn[] = [
  { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', sorter: true, width: 240 },
  { title: '状态', dataIndex: 'Status', sorter: true, width: 150 },
  { title: '当前处理人', dataIndex: 'CurrentUser', sorter: true, width: 150 },
  { title: '维护语言', dataIndex: 'language', sorter: true, width: 150 },
  { title: '工厂', dataIndex: 'ProductArea', sorter: true },
  { title: '直接客户名称', dataIndex: 'DirectCustomerName', sorter: true },
  { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', sorter: true, width: 150 },
  { title: '终端客户料号', dataIndex: 'TerminalCustomerMaterialNumber', sorter: true, width: 150 },
  { title: '关务', dataIndex: 'SellCorporation', sorter: true, width: 150 },
  // { title: '来源单号', dataIndex: 'QuantitativeApplyNo', sorter: true, width: 150 },
  // { title: '销售', dataIndex: 'SalesName', sorter: true },
  // { title: '客服', dataIndex: 'CustomersName', sorter: true },
  // { title: '出货备案法人', dataIndex: 'SellCorporation', sorter: true, width: 150 },
  // { title: '客户固定格式备案表格', dataIndex: 'CustomerFilingsExcel', sorter: true, width: 150 },
  // { title: '对应工程师', dataIndex: 'DutyName', sorter: true, width: 150 },
];

// 基础信息
export const descOptions = {
  column: { xs: 1, sm: 2, md: 4 },
  labelStyle: { color: '#999', fontSize: '14px' },
  contentStyle: { color: '#1A1A1A', fontSize: '14px' },
};

// 简表
export const simpleDesc = [
  {
    title: '备案需求单号',
    dataIndex: 'FilingsApplyNo',
  },
  {
    title: '申请人',
    dataIndex: 'ApplyUserName',
  },
  {
    title: '申请部门',
    dataIndex: 'ApplyDeptName',
  },
  {
    title: '申请备案时间',
    dataIndex: 'ApplyDate',
    format: 'date|YYYY-MM-DD HH:MM',
  },
];

export const subColumns: BasicColumn[] = [
  { title: '产品内部料号', dataIndex: 'innerMaterialNumber', width: 180 },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
  },
  {
    title: '当前处理人',
    dataIndex: 'currentProcessor',
    width: 160,
    sorter: true,
  },
  {
    title: '当前节点',
    dataIndex: 'currentNode',
    width: 160,
  },
  {
    title: '节点记录',
    dataIndex: 'nodeDetail',
    width: 160,
    sorter: true,
  },
  {
    title: '终端客户料号',
    dataIndex: 'terminalCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户料号',
    dataIndex: 'immediateCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户简称',
    dataIndex: 'immediateCustomerName',
    width: 120,
  },
  {
    title: '终端项目阶段',
    dataIndex: 'projectPhase',
    key: 'projectPhase',
    className: 'shadow-end',
    width: 120,
  },
  { title: '量试数量（pcs）', dataIndex: 'peakQty', key: 'peakQty', width: 150 },
  {
    title: '客户要求交期',
    dataIndex: 'customerDeliveryTime',
    key: 'customerDeliveryTime',
    width: 140,
    format: 'date|YYYY-MM-DD',
  },
  // {
  //   title: '报关',
  //   dataIndex: 'isDeclareCustoms',
  //   key: 'isDeclareCustoms',
  //   width: 110,
  //   customRender: ({ record }) => {
  //     let item = CONDITIONAL_OPTIONS.filter(o => o.id == record.isDeclareCustoms)[0];
  //     return item && item.fullName ? item.fullName : '';
  //   },
  // },
  {
    title: '工厂',
    dataIndex: 'factory',
    width: 200,
  },
  { title: '产品描述', dataIndex: 'productDesc', key: 'productDesc', width: 300 },
  // { title: '脱敏图纸', dataIndex: 'desensitizedDrawingsName', key: 'desensitizedDrawingsName', width: 300 },
  // { title: 'EPM', dataIndex: 'epm', key: 'epm', width: 150 },
  // { title: 'PD', dataIndex: 'pdName', key: 'pd', width: 150 },
  // { title: 'PD Leader', dataIndex: 'pdLeaderName', key: 'pdLeaderName', width: 150 },
];
