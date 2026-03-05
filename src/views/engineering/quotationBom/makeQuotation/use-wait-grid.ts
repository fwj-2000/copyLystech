import { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';

export const CURRENT_RM_NODE = 'PDTLeaderReview'; // 备注节点
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

const getCheckboxColumn = (): VxeGridPropTypes.Column => ({
  type: 'checkbox',
  field: 'checkbox',
  width: 70,
  fixed: 'left',
});

// Common form configuration
const getCommonFormItems = (): FormSchema[] => [
  {
    fieldName: 'qrApplyCode',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '报价需求单号' },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '产品内部料号' },
  },
  {
    fieldName: 'insidePartNumberOld',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '旧版成品编码' },
  },
  {
    fieldName: 'qrApplyUserName',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '申请人' },
  },
  {
    fieldName: 'quotationEngineerName',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '工程报价' },
  },
];

// Common column configuration
const getCommonColumns = (): VxeGridPropTypes.Columns => [
  {
    title: '单号',
    field: 'qrApplyCode',
    sortable: true,
    width: 150,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    sortable: true,
    width: 220,
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    sortable: true,
    width: 220,
  },
  {
    title: '项目总量(W)',
    field: 'totalQty',
    width: 140,
  },
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
  },
  {
    title: '终端客户信息',
    field: 'terminalCustomerCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
    formatter: ({ row }) => `${row.terminalCustomerName || ''}(${row.terminalCustomerCode})`,
  },
  {
    title: '工厂',
    field: 'factory',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
    formatter: ({ row }) => [row.factory, row.factoryName].filter(Boolean).join('/'),
  },
  {
    title: '产品描述',
    field: 'productDesc',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
  },
  {
    title: '报价用途',
    field: 'purpose',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
  },
];

const getPersonColumns = (): VxeGridPropTypes.Columns => [
  {
    title: '申请人',
    field: 'qrApplyUserName',
    sortable: true,
    width: 150,
  },
  {
    title: '报价工程',
    field: 'quotationEngineerName',
    sortable: true,
    width: 210,
  },
];

const getStatusColumn = (): VxeGridPropTypes.Column => ({
  title: '状态',
  field: 'status',
  width: 120,
  cellRender: {
    name: 'Tag',
    options: STATUS_OPTIONS,
  },
});

const getProcessColumns = (): VxeGridPropTypes.Columns => [
  {
    title: '当前处理人',
    field: 'handlerName',
    width: 220,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    width: 220,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
    width: 220,
  },
];

const getRemarkColumn = (): VxeGridPropTypes.Column => ({
  title: '备注',
  field: 'nodeRemark',
  i18nField: 'CommonCol.remark',
  width: 150,
  cellRender: {
    name: 'Remark',
    nodeCode: CURRENT_RM_NODE,
  },
});

const getActionColumn = (): VxeGridPropTypes.Column => ({
  title: '操作',
  field: 'action',
  slots: { default: 'action' },
  width: 80,
  fixed: 'right',
});

export function getToMakeColumn(): VxeGridPropTypes.Columns {
  return [getCheckboxColumn(), ...getCommonColumns(), ...getPersonColumns(), getRemarkColumn(), getActionColumn()];
}

export function getToMakeSchema(): FormSchema[] {
  return getCommonFormItems();
}

export function waitGetColumns(): VxeGridPropTypes.Columns {
  return [getCheckboxColumn(), ...getCommonColumns(), getStatusColumn(), ...getProcessColumns(), ...getPersonColumns(), getRemarkColumn(), getActionColumn()];
}

export function waitGetFormConfig(): FormSchema[] {
  return getCommonFormItems();
}

export function doneGetColumns(): VxeGridPropTypes.Columns {
  return [getCheckboxColumn(), ...getCommonColumns(), getStatusColumn(), ...getProcessColumns(), ...getPersonColumns(), getActionColumn()];
}

// doneGetFormConfig
export function doneGetFormConfig() {
  return [
    {
      fieldName: 'qrApplyCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '报价需求单号',
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'insidePartNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      fieldName: 'qrApplyUserName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
      },
    },
    {
      fieldName: 'quotationEngineerName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工程报价',
      },
    },
    {
      fieldName: 'currentNode',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '当前节点',
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('QuotationFlowNode'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
      colProps: { span: 6 },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '状态',
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('Flow.BillStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
      colProps: { span: 6 },
    },
    // 终端项目代码
    {
      fieldName: 'terminalCustomerProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '终端项目代码',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'terminalCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户信息',
        submitOnPressEnter: true,
      },
    },
  ];
}

export function getViewColumns() {}
