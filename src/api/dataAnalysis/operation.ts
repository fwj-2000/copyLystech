import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  PREFIX = '/api/report/', // 库存在制
  ATTENDANCE_PREFIX = '/api/report/attendance/', // 库存在制
}
const commonOption: AxiosRequestConfig = {
  timeout: 1000 * 60 * 2,
};

// 费用组织层级
export function getFyOrganization(data = {}) {
  return defHttp.get({ url: `/api/report/organization/getfy`, data });
}
// 人均产值明细
export function getPercapitapage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.ATTENDANCE_PREFIX}percapitapage`, data, ...commonOption, ...options });
}

// 获取运营周报
export function getWeeklyreport(data = {}) {
  return defHttp.get({ url: `${Api.PREFIX}weeklyreport`, data });
}

// 运营周报--topx分析详细
export function getProblemDetail(data) {
  return defHttp.get({ url: `${Api.PREFIX}weeklyreport/problemdetail`, data });
}
