import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 获取图纸评审查询列表
// /api/Information/drawingsreview
export function getDrawingsReview(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreview`, data });
}

// 撤回图纸评审
// /api/Information/drawingsreview/review/withdraw
export function withdrawDrawingsReview(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/withdraw`, data });
}
// 驳回图纸评审
// /api/Information/drawingsreview/review/reject
export function rejectDrawingsReview(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/reject`, data });
}
