export const getIsGoodProduct = (types: string) => {
  if (types === '汇总') return '';
  return types;
};
export const getZdaysValue = (zdays: string) => {
  return {
    '其中：呆滞库存': '90-9999',
    '0-30天': '0-30',
    '31-45天': '31-45',
    '46-60天': '46-60',
    '61-90天': '61-90',
    '91-120天': '91-120',
    '121-150天': '121-150',
    '151-180天': '151-180',
    '181-360天': '181-360',
    大于360天: '361-9999',
  }[zdays];
};

export const getRowStyle = ({ row }) => {
  const { ProductType } = row;
  return {
    ...(['汇总'].includes(ProductType) ? { fontWeight: '700' } : {}),
  };
};
