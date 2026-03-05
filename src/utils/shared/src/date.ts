import dayjs from 'dayjs';
import { dateUtil } from '../../dateUtil';

export function formatDate(time: number | string, format = 'YYYY-MM-DD') {
  try {
    const date = dateUtil(time);
    if (!date.isValid()) {
      throw new Error('Invalid date');
    }
    return date.format(format);
  } catch (error) {
    console.error(`Error formatting date: ${error}`);
    return time;
  }
}

export function formatDateTime(time: number | string) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isDayjsObject(value: any): value is dayjs.Dayjs {
  return dateUtil.isDayjs(value);
}
