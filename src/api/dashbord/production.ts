import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/',
}

const commonRetryRequestOptions = {
  retryRequest: {
    isOpenRetry: true,
    count: 3,
    waitTime: 100,
  }
}
// 查询结单良率
export function fetchCompletionYield(data) {
  return defHttp.get({ url: `${Api.Prefix}stateyield`, data }, commonRetryRequestOptions);
}
// 查询结单良率周明细
export function fetchCompletionYieldWeekly(data) {
  return defHttp.get({ url: `${Api.Prefix}stateyield/weekly`, data }, commonRetryRequestOptions);
}

// 查询结单良率
export function fetchManualYield(data) {
  return defHttp.get({ url: `${Api.Prefix}handyield`, data }, commonRetryRequestOptions);
}
// 查询结单良率周明细
export function fetchManualYieldWeekly(data) {
  return defHttp.get({ url: `${Api.Prefix}stateyield/weekly`, data }, commonRetryRequestOptions);
}

// api/report/environment

// 查询厂区温湿度设备状态列表
export function fetchEnvironment() {
  return defHttp.get({ url: `${Api.Prefix}environment` }, commonRetryRequestOptions);
}

// 查询厂区温湿度设备趋势
export function fetchEnvironmentTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}environment/Trend`, data }, commonRetryRequestOptions);
}
