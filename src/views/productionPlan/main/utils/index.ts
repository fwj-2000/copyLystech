import dayjs from 'dayjs';

export const factoryFilterOption = (inputValue, path) => {
  return [path].some(option => option.label.indexOf(inputValue) > -1);
};

// 校验排产数量
// 0<排产触发周数<=排产上限周数<=排产释放周数
export const notMatchNum = data => {
  if (Number(data.triggerWeeks) <= 0) {
    return '排产触发周数必须大于0';
  }
  if (Number(data.triggerWeeks) > Number(data.upperLimitWeeks)) {
    return '排产触发周数必须小于等于排产上限周数';
  }
  if (Number(data.upperLimitWeeks) > Number(data.releaseWeeks)) {
    return '排产上限周数必须小于等于排产释放周数';
  }
  return false;
};

export const getYearWeekFormat = (
  option: {
    yearWeek?: string;
    year?: number;
    week?: number;
  },
  columnCount = 20,
) => {
  const { yearWeek, year, week } = option;
  // yearWeek 和 (year, week) 二选一，如果都没传，返回空数组
  if (!yearWeek && (!year || !week)) {
    return [];
  }
  let _year = year || 0;
  let _week = week || 0;
  // 如果没有传入 year 和 week，则根据 yearWeek 计算出 year 和 week
  if (!year && !week) {
    const weeksDayjs = dayjs(yearWeek);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const splitYW = yearWeekFormat.split('WK').map(Number);
    _year = splitYW[0];
    _week = splitYW[1];
  }
  const result: any[] = [];

  for (let i = 0; i < columnCount; i++) {
    // 通过 dayjs 的 isoWeek 自动处理跨年
    const targetDate = dayjs()
      .year(_year)
      .isoWeek(_week + i);
    const currentYear = targetDate.year();
    const currentWeek = targetDate.isoWeek().toString().padStart(2, '0');

    result.push({
      title: `${currentYear}WK${currentWeek}`,
      field: `quantity${i + 1}`,
      width: 80,
      cellRender: {
        name: 'Number',
      },
    });
  }
  return result;
};
