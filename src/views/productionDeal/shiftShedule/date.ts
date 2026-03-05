import { IDayData, IMonthData, ICalendarData } from './types';

/**
 * 生成完整的年份日历数据
 * @param year - 需要生成的年份 (如 2025)
 */
export function generateCalendar(year: number): ICalendarData {
  const HOLIDAYS = new Set<string>([
    '1-1', // 元旦
    '1-29', // 春节
    '1-30', // 春节
    '1-31', // 春节
    '4-4', // 清明节
    '5-1', // 劳动节
    '5-31', // 端午节
    '9-7', // 中秋节
    '10-1', // 国庆节
    '10-2', // 国庆节
    '10-3', // 国庆节
  ]);

  const WEEKDAYS: readonly string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

  const months: IMonthData[] = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    return {
      month: monthIndex + 1,
      name: date.toLocaleString('en', { month: 'long' }),
      days: generateMonthDays(year, monthIndex, HOLIDAYS, WEEKDAYS),
    };
  });

  return { year, months };
}

function generateMonthDays(year: number, monthIndex: number, holidays: Set<string>, weekdays: readonly string[]): IDayData[] {
  const days: IDayData[] = [];
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, monthIndex, day);
    const weekdayIndex = date.getDay();

    days.push({
      day,
      weekday: weekdays[weekdayIndex],
      is_weekend: weekdayIndex === 0 || weekdayIndex === 6,
      is_holiday: holidays.has(`${monthIndex + 1}-${day}`),
    });
  }

  return days;
}

// 使用示例
// const calendarData = generateCalendar(2025);
// console.log(JSON.stringify(calendarData, null, 2));

// 类型验证测试
// function typeTests() {
//   const testData = calendarData.months[0].days[0];

//   // 验证字段类型
//   const asserts: { [K in keyof IDayData]: () => void } = {
//     day: () => testData.day.toFixed(),
//     weekday: () => testData.weekday.toLowerCase(),
//     is_weekend: () => !testData.is_weekend,
//     is_holiday: () => !testData.is_holiday,
//   };
// }
