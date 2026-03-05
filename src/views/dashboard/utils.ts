import dayjs, { Dayjs } from 'dayjs';
import { ILineListData, IMetricKeyConfigList } from './types';
import { TimeDimension } from './operate/types';

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
    case TimeDimension.WEEK:
      query = {
        startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
        endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
      };
      break;
    case TimeDimension.MONTH:
      query = {
        startDim: startDate.format('YYYY-MM'),
        endDim: endDate.format('YYYY-MM'),
      };
      break;
    case TimeDimension.QUARTER:
      query = {
        startDim: `${startDate.format('YYYY')}Q${getQuarter(startDate)}`,
        endDim: `${endDate.format('YYYY')}Q${getQuarter(endDate)}`,
      };
      break;
    case TimeDimension.YEAR:
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
    case TimeDimension.WEEK:
      query = {
        startDim: `${date.year()}WK${date.week().toString().padStart(2, '0')}`,
        endDim: `${date.endOf('week').year()}WK${date.week().toString().padStart(2, '0')}`,
      };
      break;
    case TimeDimension.MONTH:
      query = {
        startDim: date.format('YYYY-MM'),
        endDim: date.format('YYYY-MM'),
      };
      break;
    case TimeDimension.QUARTER:
      query = {
        startDim: `${date.format('YYYY')}Q${getQuarter(date)}`,
        endDim: `${date.format('YYYY')}Q${getQuarter(date)}`,
      };
      break;
    case TimeDimension.YEAR:
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
export const getDateRangeDim = (dimension: TimeDimension, dateRange: Dayjs[]) => {
  const defaultDate = dayjs().startOf('day');
  const SUBTRACT_NUM = 6;
  let [startDate = dayjs(defaultDate).tz().subtract(SUBTRACT_NUM, 'day'), endDate = dayjs(defaultDate).tz()] = dateRange || [];
  let query = {
    startDim: startDate.format('YYYY-MM-DD'),
    endDim: endDate.format('YYYY-MM-DD'),
  };
  switch (dimension) {
    case TimeDimension.WEEK:
      query = {
        startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
        endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
      };
      break;
    case TimeDimension.MONTH:
      query = {
        startDim: startDate.format('YYYY-MM'),
        endDim: endDate.format('YYYY-MM'),
      };
      break;
    case TimeDimension.QUARTER:
      query = {
        startDim: `${startDate.format('YYYY')}Q${getQuarter(startDate)}`,
        endDim: `${endDate.format('YYYY')}Q${getQuarter(endDate)}`,
      };
      break;
    case TimeDimension.YEAR:
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
export const getDateDim = (date: Dayjs, dimension: TimeDimension = TimeDimension.WEEK) => {
  switch (dimension) {
    case TimeDimension.WEEK:
      return `${date.endOf('week').year()}WK${date.endOf('week').week().toString().padStart(2, '0')}`;
    case TimeDimension.MONTH:
      return date.format('YYYY-MM');
    case TimeDimension.QUARTER:
      return `${date.format('YYYY')}Q${getQuarter(date)}`;
    case TimeDimension.YEAR:
      return date.format('YYYY');
    default:
      return date.format('YYYY');
  }
};

/**
 * 舍弃传入数字或者`xx.xx%`的百分比格式的小数为，返回其整数位
 * @param cellValue
 * @returns
 */
export function truncateToInteger(cellValue: any): string {
  // 1. 处理纯数字类型
  if (typeof cellValue === 'number') {
    return Math.trunc(cellValue).toString();
  }

  // 2. 处理字符串类型
  if (typeof cellValue === 'string' && cellValue !== '') {
    // 检查百分比格式 (xx.xx%)
    const percentMatch = cellValue.match(/^(-?\d+\.?\d*)%$/);
    if (percentMatch) {
      const numValue = Number.parseFloat(percentMatch[1]);
      return `${Math.trunc(numValue)}%`;
    }

    // 检查纯数字格式
    const numberMatch = cellValue.match(/^(-?\d+\.?\d*)$/);
    if (numberMatch) {
      const numValue = Number.parseFloat(numberMatch[1]);
      return Math.trunc(numValue).toString();
    }
  }

  // 3. 非数字/百分比格式返回原值
  return cellValue;
}

/**
 * 舍弃传入数字或者`xx.xx%`的百分比格式的小数为，返回其整数位(千分位显示)
 * @param cellValue 单元格值
 * @param title row横向标题
 * @param useGrouping 默认开启千分位显示
 * @returns
 */
export function truncateToThouInt(cellValue: any, title: any, useGrouping: boolean = true): string {
  if (title.includes('%')) {
    if (Number.isNaN(cellValue)) return '';
    return `${Math.round(cellValue * 100)}%`;
  } else {
    // 1. 处理纯数字类型
    if (typeof cellValue === 'number') {
      return Math.round(cellValue).toLocaleString('en-US', { useGrouping });
    }

    // 2. 处理字符串类型
    if (typeof cellValue === 'string' && cellValue !== '') {
      // 检查百分比格式 (xx.xx%)
      const percentMatch = cellValue.match(/^(-?\d+\.?\d*)%$/);
      if (percentMatch) {
        const numValue = Number.parseFloat(percentMatch[1]);
        return `${Math.round(numValue)}%`;
      }

      // 检查纯数字格式
      const numberMatch = cellValue.match(/^(-?\d+\.?\d*)$/);
      if (numberMatch) {
        const numValue = Number.parseFloat(numberMatch[1]);
        return Math.round(numValue).toLocaleString('en-US', { useGrouping });
      }
    }
    // 3. 非数字/百分比格式返回原值
    return cellValue;
  }
}
