import { BasicColumn } from '/@/components/Table';
import type { ColumnWithI18n } from '/@/effects/plugins/vxe-table/types';
import { isExist } from '/@/utils/is';

const RECEIVE_STATUS_OPTIONS = [
  { id: 0, fullName: '未收货', theme: 'gray', rowKey: 'receiveStatusName' },
  { id: 1, fullName: '已收货', theme: 'green', rowKey: 'receiveStatusName' },
];
const SEND_STATUS_OPTIONS = [
  { id: 0, fullName: '未发料', theme: 'gray', rowKey: 'sendStatusName' },
  { id: 1, fullName: '已发料', theme: 'green', rowKey: 'sendStatusName' },
];

export const formConfig = {
  showActionButtonGroup: true,
  showAdvancedButton: false,
  compact: true,
  labelAlign: 'left',
  labelWidth: 70,
  schemas: [
    {
      field: 'snCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: 'SN', maxlength: 50 },
      colProps: { span: 4 },
    },
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '工单号', maxlength: 50 },
      colProps: { span: 4 },
    },
    {
      field: 'mouldNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '模具编码', maxlength: 50 },
      colProps: { span: 4 },
    },
    {
      field: 'sendStatus',
      label: '',
      component: 'Select',
      componentProps: {
        options: [
          { value: 0, label: '未发料' },
          { value: 1, label: '已发料' },
        ],
      },
      colProps: { span: 4 },
    },
    {
      field: 'receiveStatus',
      label: '',
      component: 'Select',
      componentProps: {
        options: [
          { value: 0, label: '未收货' },
          { value: 1, label: '已收货' },
        ],
      },
      colProps: { span: 4 },
    },
  ],
  fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
};

export const columns: BasicColumn[] = [
  { title: 'SN', dataIndex: 'snCode', width: 130 },
  { title: '工单号', dataIndex: 'workOrderNo', width: 130 },
  { title: '模具编号', dataIndex: 'mouldNo', width: 180 },
  { title: '委外工序', dataIndex: 'processName', width: 100 },
  {
    title: '委外数量',
    dataIndex: 'outsourceQuantity',
    sorter: true,
    width: 100,
  },
  { title: '收货数量', dataIndex: 'receiveQuantity', width: 100 },
  { title: '要求交期', dataIndex: 'demandDeliveryTime', format: 'date|YYYY-MM-DD', width: 120 },
  { title: '供应商', dataIndex: 'supplier', width: 200 },
  { title: '备注', dataIndex: 'remark', width: 150 },
  { title: '发料状态', dataIndex: 'sendStatus', width: 100, format: `tag|${JSON.stringify(SEND_STATUS_OPTIONS)}` },
  { title: '收货状态', dataIndex: 'receiveStatus', width: 100, format: `tag|${JSON.stringify(RECEIVE_STATUS_OPTIONS)}` },
  { title: '委外人', dataIndex: 'applyUserName', width: 200 },
  {
    title: '委外时间',
    dataIndex: 'applyDate',
    width: 140,
    format: 'date|YYYY-MM-DD HH:mm:ss',
  },
  { title: '检测结果', dataIndex: 'testDecideResultName', width: 100 },
  { title: '检测人', dataIndex: 'testUserName', width: 200 },
  { title: '检测时间', dataIndex: 'testTime', width: 120, format: 'date|YYYY-MM-DD' },
];

export const DETAIL_COLUMNS: BasicColumn[] = [
  { title: '工单号', dataIndex: 'workOrderNo', width: 180 },
  { title: '模具编号', dataIndex: 'mouldNo', width: 180 },
  { title: '发料状态', dataIndex: 'sendStatus', width: 100, format: `tag|${JSON.stringify(SEND_STATUS_OPTIONS)}` },
  { title: '收货状态', dataIndex: 'receiveStatus', width: 100, format: `tag|${JSON.stringify(RECEIVE_STATUS_OPTIONS)}` },
  { title: '委外工序', dataIndex: 'processName', width: 100 },
  {
    title: '委外数量',
    dataIndex: 'outsourceQuantity',
    sorter: true,
    width: 100,
  },
  { title: '要求交期', dataIndex: 'demandDeliveryTime', format: 'date|YYYY-MM-DD' },
  { title: '供应商', dataIndex: 'supplier', width: 200 },
  { title: '备注', dataIndex: 'remark', width: 150 },
];

export const gridColumns = [
  {
    type: 'checkbox',
    width: 50,
  },
  {
    title: 'SN',
    field: 'snCode',
    width: 130,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  // {
  //   title: '备案需求单号',
  //   field: 'FilingsApplyNo',
  //   width: 180,
  //   slots: {
  //     default: 'FilingsApplyNo',
  //   },
  // },
  {
    title: '工单号',
    field: 'workOrderNo',
    width: 130,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '模具编号',
    field: 'mouldNo',
    width: 180,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '零件编号',
    field: 'partNo',
    width: 120,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '委外工序',
    field: 'processName',
    width: 100,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '委外数量',
    field: 'outsourceQuantity',
    sortable: true,
    width: 100,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '收货数量',
    field: 'receiveQuantity',
    width: 100,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '要求交期',
    field: 'demandDeliveryTime',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '供应商',
    field: 'supplier',
    width: 200,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '备注',
    field: 'remark',
    width: 150,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '发料状态',
    field: 'sendStatus',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: SEND_STATUS_OPTIONS,
    },
  },
  {
    title: '收货状态',
    field: 'receiveStatus',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: RECEIVE_STATUS_OPTIONS,
    },
  },
  {
    title: '委外人',
    field: 'applyUserName',
    width: 200,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '委外时间',
    field: 'applyDate',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '检测结果',
    field: 'testDecideResultName',
    width: 100,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '检测人',
    field: 'testUserName',
    width: 200,
    formatter: ({ cellValue }) => {
      return isExist(cellValue) ? cellValue : '/';
    },
  },
  {
    title: '检测时间',
    field: 'testTime',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
];

export const gridFormOptions = {
  collapsed: true,
  submitOnChange: false,
  showCollapseButton: true,
  submitOnEnter: true,
  commonConfig: {
    componentProps: {},
    labelClass: 'w-0',
  },
  wrapperClass: 'grid grid-cols-5 gap-4',
  schema: [
    {
      fieldName: 'snCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: 'SN', maxlength: 50 },
    },
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '工单号', maxlength: 50 },
    },
    {
      fieldName: 'mouldNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '模具编码', maxlength: 50 },
    },
    {
      fieldName: 'partNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '零件编号' },
    },
    {
      fieldName: 'sendStatus',
      label: '',
      component: 'Select',
      componentProps: {
        options: [
          { value: 0, label: '未发料' },
          { value: 1, label: '已发料' },
        ],
      },
    },
    {
      fieldName: 'receiveStatus',
      label: '',
      component: 'Select',
      componentProps: {
        options: [
          { value: 0, label: '未收货' },
          { value: 1, label: '已收货' },
        ],
      },
    },
  ],
  i18nConfig: {
    moduleCode: 'OutsourceManageColumn',
    transferRange: ['placeholder'],
  },
};
