import { isEmpty } from 'lodash-es';
import { ETimeDimension } from './types';
import { getDateRangeDim } from '/@/views/dashboard/utils';

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

// 获取行样式
export const getRowStyle = ({ row }) => {
  const { Title1, Title2 } = row;
  return {
    ...(['在制', 'VMI在库'].includes(Title1) ? { fontWeight: '700' } : {}),
    ...(['汇总', '在仓合计', '结单率%', '其中：逾期工单'].includes(Title2) ? { fontWeight: '700' } : {}),
  };
};

export const getZdaysValue = (zdays: string) => {
  return {
    '其中：呆滞库存': '90-9999',
    '0-30天': '0-30',
    '30-45天': '30-45',
    '45-60天': '45-60',
    '60-90天': '60-90',
    '90-180天': '90-180',
    '181天-360天': '181-360',
    大于360天: '360-9999',
  }[zdays];
};
export const getTypesValue = (types: string) => {
  return {
    汇总: '',
  }[types];
};
export const getIsGoodProduct = (types: string) => {
  return {
    汇总: '',
    良品: '良品',
    不良品: '不良品',
    良品库存: '良品',
    不良库存: '不良品',
  }[types];
};
