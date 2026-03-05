import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const schemaLists = [
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
    },
  },
  {
    fieldName: 'molPartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具料号',
    },
  },
  {
    fieldName: 'sapWorkOrder',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: 'SAP Order',
      i18nField: 'DISABLED',
    },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      options: getFlowStatus(),
    },
  },
];

export const columns = [
  { type: 'checkbox', field: 'checkbox' },
  {
    title: '退模单号',
    field: 'moldRefundApplyNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 100,
  },
  // {
  //   title: '状态',
  //   field: 'status',
  //   i18nField: 'CommonCol.status',
  //   width: 100,
  //   cellRender: {
  //     name: 'Tag',
  //     options: getFlowStatus('status'),
  //   },
  // },
  // {
  //   title: '当前处理人',
  //   field: 'currentProcessorNames',
  //   width: 230,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  // },
  // { title: '当前节点', field: 'currentNodeName' },
  // {
  //   title: '节点记录',
  //   field: 'nodeDetail',
  //   width: 120,
  //   slots: {
  //     default: 'nodeDetail',
  //   },
  // },
  { title: '产品内部料号', field: 'insidePartNumber', width: 200, sortable: true },
  { title: '模具料号', field: 'moldPartNumber', width: 160 },
  { title: '模具类型', field: 'moldTypeName', sortable: true, width: 120 },
  {
    title: '计划退回日期',
    field: 'plannedRefundDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },
  { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true, width: 120 },
  { title: '机台位', field: 'machinePosition', width: 120 },
  { title: '单位', field: 'unit', width: 80 },
  { title: '数量', field: 'qty', width: 80, aqpFilter: { cSharpType: 'int' } },
  { title: '工厂', field: 'factory', sortable: true },
  { title: '调入仓库', field: 'callShippingSpaceName', sortable: true },
  { title: '调出仓库', field: 'outShippingSpaceName', sortable: true },
  {
    title: '本次使用寿命(KPCS)',
    field: 'thisUseLife',
    width: 150,
    aqpFilter: { cSharpType: 'int' },
  },
  { title: '剩余寿命(KPCS)', field: 'remainingLife', width: 150, aqpFilter: { cSharpType: 'int' } },
  { title: '事务类型', field: 'affairsTypeName', sortable: true, width: 120 },
  { title: '仓管员', field: 'warehouseKeeperNames', sortable: true },
  { title: '退料人', field: 'refundMoldUserNames', minWidth: 350 },
  { title: '退料部门', field: 'refundDeptName' },
  {
    title: '制单人',
    field: 'applyUserName',
    width: 230,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '申请时间',
    field: 'applyDate',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    cellRender: {
      name: 'Date',
    },
  },
];

export const printColumn = [
  { title: '退模单号', field: 'moldRefundApplyNo', width: 120 },
  { title: '模具料号', field: 'moldPartNumber', width: 160 },
  { title: '模具类型', field: 'moldTypeName', width: 100 },
  {
    title: '单位',
    field: 'unit',
    width: 80,
  },
  {
    title: '数量',
    field: 'qty',
    width: 80,
  },
  // {
  //   title: '备注',
  //   field: 'remark',
  //   i18nField: 'CommonCol.remark',
  // },
  { title: '调入仓库', field: 'callShippingSpaceCode' },
  { title: '调出仓库', field: 'outShippingSpaceCode' },
  { title: '单据类型', field: 'orderTypeName' },
];
