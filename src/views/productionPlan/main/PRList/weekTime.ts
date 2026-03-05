import dayjs from 'dayjs';

// 获取当前的年-周
export function getYearWeek() {
  const today = dayjs();
  const year = today.year();
  const week = today.isoWeek(); // 获取ISO周数（1-53）
  // 格式化为 YYYY-WW（确保周数两位数，如 01-53）
  return `${year}-${String(week).padStart(2, '0')}`;
}

// 获取某一周（年-周）的往后n周(默认20周)
export function getWeekDays(yearWeek, n = 20) {
  if (!yearWeek) {
    return [];
  }
  const weeksDayjs = dayjs(yearWeek);
  const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
  const [year, week] = yearWeekFormat.split('WK').map(Number);
  const result: any[] = [];

  for (let i = 0; i < n; i++) {
    // 通过 dayjs 的 isoWeek 自动处理跨年
    const targetDate = dayjs()
      .year(year)
      .isoWeek(week + i);
    const currentYear = targetDate.year();
    const currentWeek = targetDate.isoWeek();

    result.push({
      title: `${currentYear}WK${currentWeek}`,
      field: `quantity${i + 1}`,
      year: currentYear,
      width: 100,
      editRender: {
        name: 'InputNumber',
        min: 0,
        thousands: true,
      },
    });
  }
  return result;
}
