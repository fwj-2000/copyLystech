import dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash-es';

import { ETimeDimension } from './types';

// 获取页面通用的请求参数
export const getCommonReqParams = (searchFormValue: Record<string, any>) => {
  if (isEmpty(searchFormValue)) {
    return {};
  }
  const { date = dayjs().tz(), dimension } = searchFormValue;
  let timeIndex = date.week();
  let yearIndex = date.year();
  if (dimension === ETimeDimension.MONTH) {
    timeIndex = date.month() + 1;
  } else if (dimension === ETimeDimension.YEAR) {
    timeIndex = date.year();
  }
  return {
    orgCode: searchFormValue?.orgCode?.join(';'),
    dimension: searchFormValue?.dimension,
    materialIsMore: searchFormValue?.materialIsMore,
    customerPerson: searchFormValue?.customerPerson?.join(';'),
    projectPhase: searchFormValue?.projectPhase?.join(';'),
    vmiOrJit: searchFormValue?.vmiOrJit,
    timeIndex,
    yearIndex,
  };
};

// 后台返回字段根据日期维度会变化，这里统一处理返回值
export const removeWeekMonthYear = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(item => removeWeekMonthYear(item));
  }

  if (typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(cloneDeep(obj))) {
      const newKey = key.replace(/(Week|Month|Year)/g, '');
      const newValue = removeWeekMonthYear(value);
      if (newValue !== undefined) {
        newObj[newKey] = newValue;
      }
    }
    return newObj;
  }
  return obj;
};

export const suffixMap = {
  week: '周',
  month: '月',
  year: '年',
};
export const getDimensionName = (
  {
    type,
    dimension,
  }: {
    type: 'last' | 'current';
    dimension: ETimeDimension;
  } = {
    type: 'last',
    dimension: ETimeDimension.WEEK,
  },
) => {
  return `${type === 'last' ? '上' : '当'}${suffixMap[dimension]}`;
};
// 获取维度指标名
export const getMetricNameByDimension = ({ dimension = ETimeDimension.WEEK, value = '' }: { dimension: ETimeDimension; value: string | number }) => {
  return `${value.toString().padStart(2, '0')}${suffixMap[dimension] ?? ''}`;
};

// 获取上一周月年维度数
export const getLastDimensionNum = (
  {
    currentNum,
    dimension,
  }: {
    currentNum: string | number;
    dimension: ETimeDimension;
  } = {
    currentNum: '01',
    dimension: ETimeDimension.WEEK,
  },
) => {
  let last = dayjs().tz().week(Number.parseInt(currentNum, 10)).subtract(1, 'week').week();
  if (dimension === ETimeDimension.MONTH) {
    const currentDay = dayjs().tz().month(Number.parseInt(currentNum, 10));
    last = currentDay.subtract(1, dimension).month();
  } else if (dimension === ETimeDimension.YEAR) {
    const currentDay = dayjs().tz().year(Number.parseInt(currentNum, 10));
    last = currentDay.subtract(1, dimension).year();
  }
  return last;
};
