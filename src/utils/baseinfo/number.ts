// 保留原始小数位数格式化千分位
export function formatWithOriginalDecimals(num, ops: any = {}) {
  const { round, decimal } = ops;
  let _decimal = decimal || decimal == 0 ? decimal : (String(num).split('.')[1] || '').length;
  // 处理四舍五入
  if (round) {
    num = Number(Number(num).toFixed(decimal));
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: _decimal,
    maximumFractionDigits: _decimal,
  }).format(num);
}
