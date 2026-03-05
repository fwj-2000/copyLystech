// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '内部料号',
    field: 'innerMaterialNumber',
  },
  {
    title: '旧内部料号',
    field: 'insidePartNumberOld',
  },
  {
    title: '数量',
    field: 'sNQuantity',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];
