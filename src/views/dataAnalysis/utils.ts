import dayjs, { ConfigType, Dayjs } from 'dayjs';
import { sortBy } from 'lodash-es';
import { ILineListData, IMetricKeyConfigList, ETimeDimension, DateDetail } from './types';
import weekOfYear from 'dayjs/plugin/weekOfYear'; // 需要确保项目中安装并启用了此插件
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// 加载插件
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

// 折线图配置
export const getLineSeriiesOptions = ({ config, listData }: { config: IMetricKeyConfigList; listData: ILineListData[] }): any => {
  const { suffix = '%', labelPos = 'top', color = '#FF7B00', labelStyle = {} } = config;
  return {
    name: config.name,
    type: 'line',
    smooth: true,
    itemStyle: {
      color,
    },
    label: {
      show: true,
      color: '#333',
      distance: 2,
      position: labelPos,
      formatter: `{c}${suffix}`,
      ...labelStyle,
    },
    data: listData.map(item => ({
      ...item,
      value: Number.parseFloat(item.value),
    })),
    // 设置类别间距
    categoryGap: 30,
  };
};

// 获取季度
const getQuarter = date => {
  const month = dayjs(date).tz().month();
  if (month >= 0 && month <= 2) {
    return 1;
  } else if (month >= 3 && month <= 5) {
    return 2;
  } else if (month >= 6 && month <= 8) {
    return 3;
  } else {
    return 4;
  }
};
// 获取日期范围dateDim
export const getSearchFormDateDim = (searchFormValue: any) => {
  const defaultDate = dayjs().startOf('day');
  const SUBTRACT_NUM = 6;
  const { timeDimension, dateRange } = searchFormValue;
  let [startDate = dayjs(defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(defaultDate).tz()] = dateRange || [];
  let query = {
    startDim: startDate.format('YYYY-MM-DD'),
    endDim: endDate.format('YYYY-MM-DD'),
  };
  switch (timeDimension) {
    case ETimeDimension.WEEK:
      query = {
        startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
        endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
      };
      break;
    case ETimeDimension.MONTH:
      query = {
        startDim: startDate.format('YYYY-MM'),
        endDim: endDate.format('YYYY-MM'),
      };
      break;
    case ETimeDimension.QUARTER:
      query = {
        startDim: `${startDate.format('YYYY')}Q${getQuarter(startDate)}`,
        endDim: `${endDate.format('YYYY')}Q${getQuarter(endDate)}`,
      };
      break;
    case ETimeDimension.YEAR:
      query = {
        startDim: startDate.format('YYYY'),
        endDim: endDate.format('YYYY'),
      };
      break;
    default:
      break;
  }
  return query;
};

// 获取单个日期 dateDim 的查询条件
export const getSearchFormDateDimByDate = (searchFormValue: any) => {
  const { timeDimension, date } = searchFormValue;
  let query = {
    startDim: date.format('YYYY-MM-DD'),
    endDim: date.format('YYYY-MM-DD'),
  };
  switch (timeDimension) {
    case ETimeDimension.WEEK:
      query = {
        startDim: `${date.year()}WK${date.week().toString().padStart(2, '0')}`,
        endDim: `${date.endOf('week').year()}WK${date.week().toString().padStart(2, '0')}`,
      };
      break;
    case ETimeDimension.MONTH:
      query = {
        startDim: date.format('YYYY-MM'),
        endDim: date.format('YYYY-MM'),
      };
      break;
    case ETimeDimension.QUARTER:
      query = {
        startDim: `${date.format('YYYY')}Q${getQuarter(date)}`,
        endDim: `${date.format('YYYY')}Q${getQuarter(date)}`,
      };
      break;
    case ETimeDimension.YEAR:
      query = {
        startDim: date.format('YYYY'),
        endDim: date.format('YYYY'),
      };
      break;
    default:
      break;
  }
  return query;
};

// 根据 dimension 和 dateRange 获取dim字段
export const getDateRangeDim = (dimension: ETimeDimension, dateRange: Dayjs[], formatters?: Record<string, string>) => {
  const defaultDate = dayjs().startOf('day');
  const SUBTRACT_NUM = 6;
  let [startDate = dayjs(defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(defaultDate).tz()] = dateRange || [];
  let query = {
    startDim: startDate.format(formatters?.day ?? 'YYYY-MM-DD'),
    endDim: endDate.format(formatters?.day ?? 'YYYY-MM-DD'),
  };
  switch (dimension) {
    case ETimeDimension.WEEK:
      query = {
        startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
        endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
      };
      break;
    case ETimeDimension.MONTH:
      query = {
        startDim: startDate.format(formatters?.month ?? 'YYYY-MM'),
        endDim: endDate.format(formatters?.month ?? 'YYYY-MM'),
      };
      break;
    case ETimeDimension.QUARTER:
      query = {
        startDim: `${startDate.format('YYYY')}Q${getQuarter(startDate)}`,
        endDim: `${endDate.format('YYYY')}Q${getQuarter(endDate)}`,
      };
      break;
    case ETimeDimension.YEAR:
      query = {
        startDim: startDate.format('YYYY'),
        endDim: endDate.format('YYYY'),
      };
      break;
    default:
      break;
  }
  return query;
};

// 根据 dimension 和 dateRange 获取dim字段
export const getDateDim = (date: Dayjs, dimension: ETimeDimension = ETimeDimension.WEEK) => {
  switch (dimension) {
    case ETimeDimension.WEEK:
      return `${date.endOf('week').year()}WK${date.endOf('week').week().toString().padStart(2, '0')}`;
    case ETimeDimension.MONTH:
      return date.format('YYYY-MM');
    case ETimeDimension.QUARTER:
      return `${date.format('YYYY')}Q${getQuarter(date)}`;
    case ETimeDimension.YEAR:
      return date.format('YYYY');
    default:
      return date.format('YYYY-MM-DD');
  }
};

/**
 * 根据指定字段的顺序对数组进行排序
 * @param {Array} array - 待排序的数组
 * @param {String} field - 排序依据的字段名
 * @param {Array} order - 指定的顺序列表
 * @returns {Array} 排序后的数组
 */
export const sortByFieldOrder = (array, field, order) => {
  // 自定义排序函数
  return sortBy(array, item => {
    const value = item[field];
    const index = order.indexOf(value);

    // 存在于顺序列表中的元素按索引排序，不存在的排在末尾
    return index === -1 ? order.length + 1 : index;
  });
};

// 汇总报表：单位万元，千分位，整数，导出的数据保留4位小数（第5位四舍五入）
// 底稿明细：单位元，千分位，保留2位小数（第3位四舍五入）,导出的数据保留2位小数（第3位四舍五入）
// 图表：单位万元，整数（第1位小数四舍五入）
// 百分比：费用的保留2位，其余保留1位（第2位小数四舍五入）
/**
 * @description  数字格式化
 * @param cellValue 待转换的数字
 * @param metric 数据行说明 例如：'实际模切DL(%)'
 * @param digits 小数位
 * @param isaddThousand 是否千分位
 * @returns 默认不带千分位 + digits位小数
 */
export const transThouIntEx = (cellValue: number, metric: string = '', digits: number = 0, isaddThousand: boolean = false) => {
  if (!cellValue) {
    return '';
  }
  const isPercentage = metric.includes('%');
  const isFeeMetric = metric.includes('费用');

  let decimalPlaces = digits;
  if (isPercentage) {
    decimalPlaces = isFeeMetric ? 2 : 1;
  } // 当检测到%时，会忽略传入的digits值

  //如果是百分比，先将原始值乘以100
  const valueToFormat = isPercentage ? cellValue * 100 : cellValue;

  const roundedValue = roundFun(valueToFormat, decimalPlaces); // 四舍五入
  const formattedValue = isaddThousand ? roundedValue.toLocaleString() : roundedValue; // 千分位处理

  return isPercentage ? `${formattedValue}%` : formattedValue;
};

/**
 * @description: 保留n位小数，代替toFixed银行家算法
 * @param value 待转换的数字
 * @param n 保留的小数个数
 * @returns n位小数
 */
export function roundFun(value: number, n: number) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}
//传递列的filed 合并相同行
export function spanMethodMerge({
  row,
  rowIndex,
  column,
  visibleData,
  spanFields,
}: {
  row: any;
  rowIndex: number;
  column: any;
  visibleData: any[];
  spanFields: string[];
}) {
  const cellValue = row[column.field];
  if (spanFields.includes(column.field)) {
    const prevRow = visibleData[rowIndex - 1];
    let nextRow = visibleData[rowIndex + 1];
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
}

/**
 * 需求逻辑：
 *  @param offsetWeeks：往前推N周 ，默认值4周
 *  @param baseWeek：基准日期，默认2周
 * 1. 每年第1-2周：默认加载去年的最后一段时间（不跨年[当前周是2026第2周，默认 开始1周 结束1周]）。
 * 2. 每年第3周起：加载本年数据。
 * 3. 跨年截断：如果往前推 N 周会跨年，则自动截断至本年1月1日，确保不显示去年的周。
 */
export const getCustomDefaultRange = (offsetWeeks: number = 4, baseWeek: number = 2): Dayjs[] => {
  const now = dayjs(); //dayjs('2026-01-01')
  console.log('🚀 ~ getCustomDefaultRange ~ now:', now.format('YYYY-MM-DD'));
  const currentWeek = now.week();
  const currentYear = now.year();

  let baseDate: Dayjs;
  let isNewYear: boolean = false;

  // 1. 确定基准日期
  if (currentWeek <= baseWeek) {
    // 第1-2周：取去年的最后一天作为基准点
    baseDate = now.subtract(1, 'year').endOf('year');
  } else {
    // 第3周起：取当前日期作为基准点
    baseDate = now;
    isNewYear = true;
  }

  // 2. 计算截止日期（上周）
  const endDate = baseDate.subtract(1, 'week');

  // 3. 计算开始日期（默认往前推 offsetWeeks 周）
  let startDate = endDate.subtract(offsetWeeks, 'week');

  // 4. 满足您的特殊需求：如果是新的一年（第3周起），且开始时间跨到了去年
  if (isNewYear && startDate.year() < currentYear) {
    // 强制截断到本年1月1日（即本年第一周）
    startDate = dayjs().year(currentYear).startOf('year');

    // 注意：如果 1月1日刚好是周日或周六，可能需要根据业务定义调整到该周的周一
    startDate = startDate.startOf('week');
  }

  return [startDate, endDate];
};

export const parseDateByDimension = (dateStr: string, dimension: ETimeDimension) => {
  let date: dayjs.Dayjs; // 修改类型为 Dayjs
  const numbers = dateStr.match(/\d+/g) || [];
  switch (dimension) {
    case 'week': {
      const [year, week] = numbers;
      date = dayjs().year(Number(year)).week(Number(week)).endOf('week');
      return [date, date];
    }
    case 'month': {
      const [year, month] = numbers;
      date = dayjs()
        .year(Number(year))
        .month(Number(month) - 1)
        .endOf('month');
      return [date, date];
    }
    case 'quarter': {
      const [qYear, quarter] = numbers;
      date = dayjs().year(Number(qYear)).quarter(Number(quarter)).endOf('quarter');
      return [date, date];
    }
    default: {
      date = dayjs(dateStr);
      return [date, date];
    }
  }
};

/**
 * 解析日期字符串为详细对象
 * @param {ConfigType} date - 支持 string, Dayjs 对象, Date 对象等
 * @param {string} tz - 目标时区，默认为 'Asia/Shanghai' (北京时间)
 */
export const parseDateDetail = (date: ConfigType, tz: string = 'Asia/Shanghai'): DateDetail | null => {
  if (!date) return null;

  // dayjs(date) 能够自动识别传入的是字符串还是已有的 dayjs 对象
  const d = dayjs(date).tz(tz);

  if (!d.isValid()) {
    return null;
  }

  const year = d.year();
  const week = d.isoWeek();
  const month = d.month();

  let weekYear = year;
  if (month === 11 && week === 1) {
    weekYear = year + 1;
  } else if (month === 0 && week >= 52) {
    weekYear = year - 1;
  }

  return {
    year: year,
    month: month + 1,
    monthStr: month + 1 >= 10 ? String(month + 1) : '0' + (month + 1),
    day: d.date(),
    week: week,
    weekStr: week >= 10 ? String(week) : '0' + week,
    weekYear: weekYear,
    fullString: d.format('YYYY-MM-DD HH:mm:ss'),
  };
};
