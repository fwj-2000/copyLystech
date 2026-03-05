import { isEmpty } from 'lodash-es';
import { getDateRangeDim } from '/@/views/dashboard/utils';

import { ETimeDimension } from '/@/views/dashboard/operation/productionAndSalesRate/types';
import { IOption } from '/@/views/dashboard/types';
import { getChanxiaolvCascade } from '/@/api/dashbord/report';

// 获取页面通用的请求参数
export const getCommonReqParams = (searchFormValue: Record<string, any>) => {
  if (isEmpty(searchFormValue)) {
    return {};
  }
  const { dateRange, dimension = ETimeDimension.WEEK, isSimplify, item, prodline } = searchFormValue;
  const { startDim, endDim } = getDateRangeDim(dimension, dateRange);
  return {
    orgCode: searchFormValue?.orgCode,
    dimension: dimension,
    startDim,
    endDim,
    isSimplify,
    // period: item,
    // prodline,
  };
};

// 获取产品线和项目下拉
export const getAllOptions = async (params: any): Promise<IOption[]> => {
  const { data } = (await getChanxiaolvCascade(params).catch()) || { data: {} };
  const { itemList = [], periodList = [], plineList } = data;

  return [
    {
      text: '产品线',
      width: 100,
      props: 'prodline',
      options: [{ label: '全部', value: '' }].concat(plineList.map(item => ({ label: item, value: item }))),
    },
    {
      text: '新旧项目',
      width: 100,
      props: 'period',
      options: [{ label: '全部', value: '' }].concat(periodList.map(item => ({ label: item, value: item }))),
    },
    {
      text: '项目',
      width: 100,
      props: 'item',
      options: [{ label: '全部', value: '' }].concat(itemList.map(item => ({ label: item, value: item }))),
    },
  ];
};
