export const tempColums = [
  { type: 'checkbox', field: 'checkbox' },
  { title: '工厂', field: 'factory', sortable: true },
  { title: '模具料号', field: 'moldPartNumber', sortable: true, width: 160 },
  { title: '模具状态', field: 'statusName', sortable: true, width: 120 },
  { title: '模具类型', field: 'moldTypeName', sortable: true, width: 120 },
  { title: '当前仓位', field: 'shippingSpaceCode', sortable: true },
  { title: '收货处理人', field: 'deliveryHandleName', sortable: true },
  { title: '产品内部料号', field: 'insidePartNumber', sortable: true },
  { title: '检测报告', field: 'testReportList', sortable: true, slots: { default: 'files' } },
  { title: '数量', field: 'existStockQty', sortable: true, width: 120 },
  { title: '厂商', field: 'manufacturer', sortable: true },
  { title: '备注1', field: 'remarksOne', sortable: true },
  { title: '备注2', field: 'remarksTwo', sortable: true },
  { title: '备注3', field: 'remarksThree', sortable: true },
  { title: '备注4', field: 'remarksFour', sortable: true },
  { title: '备注5', field: 'remarksFive', sortable: true },
];

export const schemas: any[] = [
  {
    fieldName: 'moldPartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具料号',
    },
  },
  {
    fieldName: 'deliveryHandleId',
    i18nField: 'deliveryHandleName',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '收货处理人',
    },
  },
  // {
  //   fieldName: 'status',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     placeholder: '模具状态',
  //   },
  // },
];
