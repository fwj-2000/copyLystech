import dayjs from 'dayjs';
/**
 * 格式化时间
 * @param time 时间
 * @param formatType 格式化类型
 * @returns 格式化后的时间
 */
export function forMatTime(time, formatType = 'YYYY-MM-DD HH:mm:ss') {
  if (!time) return '';
  return dayjs(time).tz().format(formatType);
}
