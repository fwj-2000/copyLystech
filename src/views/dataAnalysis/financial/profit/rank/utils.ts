import dayjs from 'dayjs';
/**
 * 获取月份维度的默认日期范围（12号前取上上个月，12号后取上个月）
 */
export const getMonthDimensionDefaultDateRange = () => {
  const today = dayjs();
  const currentDay = today.date(); // 获取当前日期（几号）

  if (currentDay < 12) {
    // 12号前：取上上个月
    return [today.subtract(2, 'month').startOf('month'), today.subtract(2, 'month').endOf('month')];
  } else {
    // 12号后：取上个月
    return [today.subtract(1, 'month').startOf('month'), today.subtract(1, 'month').endOf('month')];
  }
};
