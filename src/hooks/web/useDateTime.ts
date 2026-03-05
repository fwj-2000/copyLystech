import dayjs from 'dayjs';

export function useDateTime() {
  /*
   * @description 格式化日期
   * @param date
   * @param format
   */
  const formatDate = (date, format = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
  };

  /*
   * @description 格式化时间
   * @param date
   * @param format
   */
  const formatTime = (date, format = 'YYYY-MM-DD HH:MM') => {
    return dayjs(date).format(format);
  };

  /*
   * @description 日期加天数
   * @param date
   * @param daysToAdd 需要增加的天数
   */
  const addDays = (date, daysToAdd) => {
    return dayjs(date).add(daysToAdd, 'day').toDate();
  };

  /*
   * @description 日期减天数
   * @param date
   * @param daysToSubtract 需要减去的天数
   */
  const subtractDays = (date, daysToSubtract) => {
    return dayjs(date).subtract(daysToSubtract, 'day').toDate();
  };

  return { formatDate, addDays, subtractDays, formatTime };
}
