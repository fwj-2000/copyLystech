import { isEmpty } from 'lodash-es';
import { getDateRangeDim } from '/@/views/dashboard/utils';

import { ETimeDimension } from './types';

// 获取页面通用的请求参数
export const getCommonReqParams = (searchFormValue: Record<string, any>) => {
  if (isEmpty(searchFormValue)) {
    return {};
  }
  const { dateRange, dimension = ETimeDimension.WEEK } = searchFormValue;
  const { startDim, endDim } = getDateRangeDim(dimension, dateRange);
  return {
    orgCode: searchFormValue?.orgCode,
    dimension: dimension,
    startDim,
    endDim,
  };
};
