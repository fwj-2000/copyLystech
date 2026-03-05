export const STARTWORKSTATUS_OPTIONS = [
  { id: 0, value: 0, theme: 'gray', rowKey: 'statusName' },
  { id: 1, value: 1, theme: 'gray', rowKey: 'statusName' },
  { id: 2, value: 2, theme: 'blue', rowKey: 'statusName' },
  { id: 3, value: 3, theme: 'yellow', rowKey: 'statusName' },
  { id: 4, value: 4, theme: 'green', rowKey: 'statusName' },
  { id: 7, value: 7, theme: 'green', rowKey: 'statusName' },
];

const baseColumns = [
  { title: '工单号', field: 'workOrderNo', width: '' },
  { title: '内部料号', field: 'productCode', width: '', i18nField: 'innerMaterialCode' },
  { title: '工单数量', field: 'workOrderQuantity', width: '90px', i18nField: 'CommonCol.workOrderQuantity' },
  { title: '线体', field: 'lineCode', width: '' },
  { title: '厂别号', field: 'factoryName', width: '' },
  { title: '数量(PCS)', field: 'quantity', width: '90px', i18nField: 'CommonCol.qty' },
  { title: '机台', field: 'machineNo', sortable: true, width: '' },
  { title: '执行工序', field: 'processName', sortable: true, width: '' },
  { title: '处理人', field: 'handleUser', i18nField: 'CommonCol.handleUser' },
  {
    title: '处理时间',
    field: 'handleTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.handleTime',
  },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: STARTWORKSTATUS_OPTIONS,
    },
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 160,
    slots: {
      default: 'nodeDetail',
    },
  },
  { title: '操作员', field: 'operatorName', width: '' },
  { title: '班次', field: 'classesName', sortable: true, width: '90px' },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '100',
    fixed: 'right',
  },
];
export const columns = [
  ...baseColumns,
  { title: '创建人', field: 'creatorUserName', sortable: true, align: 'left' },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
    },
    sortable: true,
    align: 'left',
  },
  // { title: '修改人', dataIndex: 'lastModifyUserName', width: 90 },
  // { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
];
