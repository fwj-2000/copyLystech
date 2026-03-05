export function getColumn(hasColumnP: (permissionStr: string) => boolean) {
  return [
    {
      title: '成本类别',
      field: 'name',
    },
    {
      title: '成本小计',
      field: 'value',
      width: 120,
      visible: hasColumnP('cost_subtotal'),
    },
    {
      title: '占比',
      field: 'rate',
      width: 100,
    },
  ];
}
