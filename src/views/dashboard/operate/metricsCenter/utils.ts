import dayjs from 'dayjs';
import { isNil } from 'lodash-es';

/**
 * 将对象转换成路由参数拼接
 * 输入：{ a: 'a', b: 'b' }
 * 返回：a=a&b=b
 * @param   obj 参数对象
 * @return  String
 */
export const objectToQueryParams = (obj: Record<string, any>): string => {
  return Object.keys(obj)
    .filter(key => !isNil(obj[key]))
    .map(key => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(obj[key]);
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');
};

/**
 * 将周维度字符串转换成具体的日期值
 * 输入：2024WK51
 * 返回：{ start: '2024-12-16', end: '2024-12-22' }
 * @param   obj 参数对象
 * @return  String
 */
export function convertWeekToDate(weekStr) {
  // 提取年份和周数
  const year = Number.parseInt(weekStr.slice(0, 4));
  const week = Number.parseInt(weekStr.slice(6));
  // 使用 dayjs 创建代表该年1月1日的对象
  const firstDayOfYear = dayjs(`${year}-01-01`).tz();
  // 获取该年第一周的起始日期（保证第一周是完整的一周，若1月1日不是星期一，则往前推相应天数）
  const firstWeekStart = firstDayOfYear.startOf('year').startOf('week');
  // 计算指定周的起始日期
  const targetWeekStart = firstWeekStart.add(week - 1, 'week');
  // 计算指定周的结束日期（加6天得到该周的最后一天）
  const targetWeekEnd = targetWeekStart.add(6, 'day');
  return {
    start: targetWeekStart.format('YYYY-MM-DD'),
    end: targetWeekEnd.format('YYYY-MM-DD'),
  };
}
