import { isEmpty } from 'lodash-es';
import { getDateDim } from '/@/views/dashboard/utils';

// 获取页面通用的请求参数
export const getCommonReqParams = (searchFormValue: Record<string, any>) => {
  if (isEmpty(searchFormValue)) {
    return {};
  }
  const { date } = searchFormValue;
  return {
    orgCode: searchFormValue?.orgCode,
    week: getDateDim(date),
  };
};
