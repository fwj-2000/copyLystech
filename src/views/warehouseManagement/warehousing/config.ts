import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/factory';

const baseStore = useBaseStore();

export const STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'statusName' },
  { id: 1, theme: 'blue', color: '#1890FF', fullName: '处理中', rowKey: 'statusName' },
  { id: 2, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'statusName' },
  { id: 3, theme: 'purple', color: '#DA5BFB', fullName: '撤回', rowKey: 'statusName' },
  { id: 4, theme: 'yellow', color: '#FAAD14', fullName: '驳回', rowKey: 'statusName' },
  { id: 5, theme: 'red', color: '#FF4D4F', fullName: '终止', rowKey: 'statusName' },
];

export const AUDIT_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'auditStatusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'auditStatusName' },
];

export const OUTBOUND_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'warehouseAuditStatusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'warehouseAuditStatusName' },
];

export const formConfig = [
  // showActionButtonGroup: true,
  // showAdvancedButton: false,
  // compact: true,
  // labelAlign: 'left',
  // labelWidth: 70,
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '请输入模具编码', maxlength: 50 },
  },
  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '请输入工单号', maxlength: 50 },
  },
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择厂别',
      api: getFactoryList,
      labelField: 'Name',
      valueField: 'Code',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      showSearch: true,
      useChangeCopy: true,
      resultField: 'data',
    },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      options: STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
    },
    colProps: { span: 4 },
  },
];
// fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],

export const COLUMNS = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '来源类型', field: 'sourceTypeName', width: '90px' },
  { title: '单据号', field: 'documentNumber' },
  { title: '工单号', field: 'workOrderNo' },
  { title: '模具编号', field: 'moldNo' },
  { title: '产品类型', field: 'productTypeName' },
  { title: '描述', field: 'depiction' },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  { title: '节点记录', field: 'nodeDetail', slots: { default: 'nodeDetail' } },
  { title: '当前处理人', field: 'currentProcessorName' },
  { title: '计划入库数量', field: 'planStoreQuantity' },
  { title: '实际入库数量', field: 'actualStoreQuantity' },
  { title: '计量单位', field: 'unitName' },
  { title: '工厂', field: 'factoryName' },
  { title: '仓库代码', field: 'warehouseCode' },
  { title: '仓库名称', field: 'warehouseName' },
  { title: 'LotNo', field: 'lotNo' },
  { title: '创建人', field: 'applyUserName' },
  {
    title: '创建时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '修改人', field: 'lastModifyUserName', width: '260px' },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

export const LEADERSHIP_COLUMNS = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '来源类型', field: 'sourceTypeName' },
  { title: '单据号', field: 'documentNumber' },
  { title: '工单号', field: 'workOrderNo' },
  { title: '模具编号', field: 'moldNo' },
  { title: '描述', field: 'depiction' },
  {
    title: '状态',
    field: 'auditStatus',
    cellRender: {
      name: 'Tag',
      options: AUDIT_STATUS_OPTIONS,
    },
  },
  { title: '节点记录', field: 'nodeDetail', slots: { default: 'nodeDetail' } },
  { title: '当前处理人', field: 'currentProcessorName' },
  { title: '计划入库数量', field: 'planStoreQuantity' },
  { title: '实际入库数量', field: 'actualStoreQuantity' },
  { title: '计量单位', field: 'unitName' },
  { title: '工厂', field: 'factoryName' },
  { title: '仓库代码', field: 'warehouseCode' },
  { title: '仓库名称', field: 'warehouseName' },
  { title: 'LotNo', field: 'lotNo' },
  { title: '创建人', field: 'applyUserName' },
  {
    title: '创建时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

export const WAREHOUSEAPPROVAL_COLUMNS = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '来源类型', field: 'sourceTypeName' },
  { title: '单据号', field: 'documentNumber' },
  { title: '工单号', field: 'workOrderNo' },
  { title: '模具编号', field: 'moldNo' },
  { title: '描述', field: 'depiction' },
  {
    title: '状态',
    field: 'warehouseAuditStatus',
    cellRender: {
      name: 'Tag',
      options: OUTBOUND_STATUS_OPTIONS,
    },
  },
  { title: '节点记录', field: 'nodeDetail', slots: { default: 'nodeDetail' } },
  { title: '当前处理人', field: 'currentProcessorName' },
  { title: '计划入库数量', field: 'planStoreQuantity' },
  { title: '实际入库数量', field: 'actualStoreQuantity' },
  { title: '计量单位', field: 'unitName' },
  { title: '工厂', field: 'factoryName' },
  { title: '仓库代码', field: 'warehouseCode' },
  { title: '仓库名称', field: 'warehouseName' },
  { title: 'LotNo', field: 'lotNo' },
  { title: '创建人', field: 'applyUserName' },
  {
    title: '创建时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

export const DETAIL_COLUMNS: BasicColumn[] = [
  // { title: '来源类型', dataIndex: 'sourceTypeName' },
  { title: '单据号', dataIndex: 'documentNumber' },
  { title: '工单号', dataIndex: 'workOrderNo' },
  { title: '仓库代码', dataIndex: 'warehouseCode' },
  { title: '状态', dataIndex: 'status', format: `tag|${JSON.stringify(STATUS_OPTIONS)}` },
  { title: '实际入库数量', dataIndex: 'actualStoreQuantity' },
  { title: '计量单位', dataIndex: 'unitName' },
  { title: '仓库名称', dataIndex: 'warehouseName' },
  { title: '仓库管理员', dataIndex: 'warehouseKeeperName' },
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: '计划入库数量', dataIndex: 'planStoreQuantity' },
  { title: 'LotNo', dataIndex: 'lotNo' },
  { title: '审核人', dataIndex: 'auditUserName' },
  {
    title: '审批时间',
    dataIndex: 'auditDate',
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
];
