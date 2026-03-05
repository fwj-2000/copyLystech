export const baseColumns = [
  { title: '工单号', field: 'workOrderNo' },
  { title: '物料编码', field: 'materialCode' },
  { title: '物料描述', field: 'materialDesc', minWidth: 260 },
  { title: '数量', field: 'materialQuantity', minWidth: 90 },
  { title: '单位', field: 'materialUnit', minWidth: 90 },
  { title: '项号', field: 'itemNo' },
  { title: '厂区', field: 'factoryAreaName' },
  {
    title: '需求日期',
    field: 'requirementDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
];

export const columns = [
  ...baseColumns,
  // { title: '创建人', dataIndex: 'creatorUserName', width: 90 },
  // { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  // { title: '修改人', dataIndex: 'lastModifyUserName', width: 90 },
  // { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
];
