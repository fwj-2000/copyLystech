import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { fieldCol } from './components/config';
import { getinnermaterialnumberlist, getCustomerList } from '/@/api/customerSerivce/index';
import { t, useI18n } from '/@/hooks/web/useI18n';
// import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';

const { t: $t } = useI18n();

// export const approveStatusList = [
//   { id: 0, fullName: '未建单', theme: 'gray', rowKey:'statusDesc' },
//   { id: 1, fullName: '待审核', theme: 'success', rowKey:'statusDesc' },
//   { id: 2, fullName: '已审核', theme: 'warning', rowKey:'statusDesc' },
//   { id: 3, fullName: '驳回', theme: 'error', rowKey:'statusDesc' },
// ]

export const formConfig = {
  showActionButtonGroup: true,
  showAdvancedButton: false,
  compact: true,
  labelAlign: 'left',
  labelWidth: 70,
  baseColProps: { span: 3 },
  actionColOptions: {
    span: 3,
  },
  schemas: [
    {
      field: 'FilingsApplyNo',
      label: '',
      component: 'Input',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '备案需求单号', maxlength: 50, allowClear: true },
    },
    {
      field: 'InnerMaterialNumber',
      label: '',
      component: 'Input',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
    },
    {
      field: 'DirectCustomerName',
      label: '',
      component: 'Input',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '直接客户信息',
        allowClear: true,
      },
    },
    {
      field: 'DirectCustomerMaterialNumber',
      label: '',
      component: 'Input',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '直接客户料号',
        allowClear: true,
      },
    },
    {
      field: 'TerminalCustomerMaterialNumber',
      label: '',
      component: 'Input',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '终端客户料号', maxlength: 50, allowClear: true },
    },
    {
      field: 'CustomersId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'CustomersName',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '客服', maxlength: 50, allowClear: true },
    },
    {
      field: 'CustomsPersonId',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 100,
      i18nField: 'CustomsPersonName',
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '关务', maxlength: 50, allowClear: true },
    },
    // {
    //   field: 'AuditUserName',
    //   label: '',
    //   component: 'CustomUserSelect',
    //   labelWidth: 100,
    //   colProps: {
    //     span: 2,
    //   },
    //   componentProps: { placeholder: '复核人', maxlength: 50 },
    // },
    // {
    //   field: 'Status',
    //   label: '',
    //   component: 'Select',
    //   labelWidth: 100,
    //   colProps: {
    //     span: 2,
    //   },
    //   componentProps: { placeholder: '状态', maxlength: 50, options: approveStatusList },
    // },
  ],
  // fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
  i18nConfig: {
    moduleCode: 'FilingsBillColumn',
    transferRange: ['placeholder'],
  },
};

export const waitAuditFormConfig = {
  showActionButtonGroup: true,
  showAdvancedButton: false,
  compact: true,
  labelAlign: 'left',
  labelWidth: 70,
  baseColProps: { span: 3 },
  actionColOptions: {
    span: 3,
  },
  schemas: [
    {
      field: 'FilingsBillNo',
      label: '',
      component: 'Input',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '备案需求单号', maxlength: 50, allowClear: false },
    },
    {
      field: 'InnerMaterialNumber',
      label: '',
      component: 'ApiSelect',
      colProps: {
        span: 3,
      },
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
      field: 'ImmediateCustomerCode',
      label: '',
      component: 'Input',
      colProps: {
        span: 3,
      },
      componentProps: {
        // api: getCustomerList,
        placeholder: '直接客户信息',
        allowClear: false,
        // showSearch: true,
        // // TerminalCustomerCode
        // apiSearch: {
        //   show: true,
        //   // 搜索字段名
        //   searchName: 'keyword',
        // },
        // labelField: 'name',
        // valueField: 'customerCode',
        // resultField: 'data',
        // filterOption: false,
        // // nameFormat: ['Code', '-', 'Name'],
        // notFoundContent: null,
        // immediate: true,
      },
    },
    {
      field: 'DirectCustomerMaterialNumber',
      label: '',
      component: 'ApiSelect',
      colProps: {
        span: 3,
      },
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
      field: 'TerminalCustomerPartNumber',
      label: '',
      component: 'Input',
      labelWidth: 100,
      colProps: {
        span: 3,
      },
      componentProps: { placeholder: '终端客户料号', maxlength: 50, allowClear: false },
    },
    {
      field: 'CustomerName',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 100,
      colProps: {
        span: 2,
      },
      componentProps: { placeholder: '客服', maxlength: 50 },
    },
    {
      field: 'CustomsName',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 100,
      colProps: {
        span: 2,
      },
      componentProps: { placeholder: '关务', maxlength: 50 },
    },
    {
      field: 'AuditUserName',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 100,
      colProps: {
        span: 2,
      },
      componentProps: { placeholder: '复核人', maxlength: 50 },
    },
    // {
    //   field: 'Status',
    //   label: '',
    //   component: 'Select',
    //   labelWidth: 100,
    //   colProps: {
    //     span: 2,
    //   },
    //   componentProps: { placeholder: '状态', maxlength: 50, options: approveStatusList },
    // },
  ],
  // fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
};

const _columns: BasicColumn[] = [
  { title: '备案需求单号', dataIndex: 'FilingsApplyNo', width: 200 },
  { title: '备案单号', dataIndex: 'FilingsBillNo', width: 180 },
  { title: '客户备案品名', dataIndex: 'GoodsName', width: 180 },
  { title: '出口类型', dataIndex: 'ExportTypeDesc', width: 120 },
  { title: '状态', dataIndex: 'StatusName', width: 90 },
  { title: '单据记录', dataIndex: 'DataRecord', width: 180 },
  { title: '客户商品编码', dataIndex: 'GoodsCode', width: 120 },
  {
    title: '申报要素',
    dataIndex: 'DeclElements',
    key: 'DeclElements',
    width: 120,
  },
  { title: '内部料号', dataIndex: 'InnerMaterialNumber', width: 240 },
  { title: '申报单位', dataIndex: 'DeclUnit', width: 100 },
  { title: '法定单位', dataIndex: 'LegalUnit', width: 150 },
  { title: '原产国', dataIndex: 'OriginCountry', width: 100 },
  { title: '地区', dataIndex: 'Region', width: 150 },
  { title: '项目', dataIndex: 'ProjectName', width: 150 },
  { title: '客户料号', dataIndex: 'CustomerMaterialNumber', key: 'CustomerMaterialNumber', width: 150 },
  { title: '备案规格', dataIndex: 'ApplySpec', key: 'ApplySpec', width: 150 },
  { title: '单重（KG）', dataIndex: 'Weight', key: 'Weight', width: 150 },
  { title: '客服', dataIndex: 'CustomersName', key: 'CustomersName', width: 150 },
  { title: '备案人员', dataIndex: 'ApplyUserName', key: 'ApplyUserName', width: 150 },
  {
    title: '申请日期',
    dataIndex: 'ApplyDate',
    key: 'ApplyDate',
    width: 120,
    sorter: true,
    customRender: ({ record }) => {
      return record.ApplyDate ? dayjs(record.ApplyDate).format('YYYY-MM-DD') : '';
    },
  },
  { title: '材质成分', dataIndex: 'MaterialQuality', key: 'MaterialQuality', width: 150 },
  { title: '客户', dataIndex: 'DirectCustomerName', key: 'DirectCustomerName', width: 150 },
  { title: '口岸', dataIndex: 'Prot', key: 'Prot', width: 150 },
  { title: '用途', dataIndex: 'UseDesc', key: 'UseDesc', width: 150 },
  { title: '备注', dataIndex: 'Rmk', key: 'Rmk', width: 150 },
];

export const columns = _columns.concat(fieldCol);

// 审批状态
export const REVIEW_STATUS_OPTIONS = [
  // // 待制作
  { id: -2, fullName: $t('common.waitMadeText'), color: '#B2B2B2', theme: 'gray' },
  // 草稿
  { id: -1, fullName: $t('common.draft'), color: '#B2B2B2', theme: 'gray' },
  // 待审核
  { id: 0, fullName: $t('common.waitAuditText'), color: '#B2B2B2', theme: 'gray' },
  // 驳回
  { id: 1, fullName: $t('common.rejectText'), color: '#B2B2B2', theme: 'gray' },
  // 已审核
  { id: 2, fullName: $t('common.audited'), color: '#FF7B00' },
  // 终止
  { id: 3, fullName: $t('common.endding'), color: '#52C41A', theme: 'green' },
  // { id: 4, fullName: '已废弃', color: '#FF4D4F' },
];

export const commonColumns: BasicColumn[] = [
  { title: '备案需求单号', dataIndex: 'FilingsApplyNo', width: 150, sorter: true },
  { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', width: 150, sorter: true },
  { title: '状态', dataIndex: 'Status', width: 100, format: 'tag|' + JSON.stringify(REVIEW_STATUS_OPTIONS), sorter: true },
  { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 150, sorter: true },
  { title: '终端客户料号', dataIndex: 'TerminalCustomerMaterialNumber', width: 150, sorter: true },
  { title: '直接客户名称', dataIndex: 'DirectCustomerName', width: 150, sorter: true },
  { title: '客服', dataIndex: 'CustomersName', width: 150, sorter: true },
  // { title: '客服', dataIndex: 'CustomersId', extraKey: 'CustomersName', width: 150, sorter: true, compType: 'UserSelect' },
  { title: '关务', dataIndex: 'CustomsPersonName', width: 150, sorter: true },
];

export const waitAuditColumns: BasicColumn[] = [
  { title: '需求单号', dataIndex: 'FilingsBillNo', width: 150, sorter: true },
  { title: '备案需求单号', dataIndex: 'FilingsApplyNo', width: 150, sorter: true },
  { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', width: 180, sorter: true },
  { title: '状态', dataIndex: 'Status', width: 100, format: 'tag|' + JSON.stringify(REVIEW_STATUS_OPTIONS), sorter: true },
  { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 150, sorter: true },
  { title: '终端客户料号', dataIndex: 'TerminalCustomerMaterialNumber', width: 150, sorter: true },
  { title: '直接客户名称', dataIndex: 'DirectCustomerName', width: 180, sorter: true },
  { title: '客服', dataIndex: 'CustomersName', width: 180, sorter: true },
  // { title: '客服', dataIndex: 'CustomersId', extraKey: 'CustomersName', width: 150, sorter: true, compType: 'UserSelect' },
  { title: '关务', dataIndex: 'CustomsPersonName', width: 150, sorter: true },
  { title: '复核人', dataIndex: 'AuditUserName', width: 150, sorter: true },
];
