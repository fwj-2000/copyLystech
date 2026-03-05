/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useLocale } from '/@/locales/useLocale';
import { unref } from 'vue';
import { getDateFormat } from '/@/utils/lydc';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
const { getTimeZone } = useLocale();
// 添加时区插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 扩展 ISO Week 插件
dayjs.extend(isoWeek);
// 拓展季度插件
dayjs.extend(quarterOfYear);

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export type FormatDate = dayjs.ConfigType;

export function formatToDateTime(date: dayjs.ConfigType = undefined, format = DATE_TIME_FORMAT): string {
  const userTz = format === 'YYYY-MM-DD' ? 'Asia/Shanghai' : unref(getTimeZone);
  return dayjs(date).tz(userTz).format(getDateFormat(format));
  // return dayjs(date).format(getDateFormat(format));
}

export function formatToDate(date: dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  const userTz = format === 'YYYY-MM-DD' ? 'Asia/Shanghai' : unref(getTimeZone);
  return dayjs(date).tz(userTz).format(getDateFormat(format));
  // return dayjs(date).format(getDateFormat(format));
}
export default dayjs;
export const dateUtil = dayjs;
