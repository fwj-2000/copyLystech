import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

/**
 * 获取工程资料列表
 * @param data
 * @returns
 */
export function getEngineerInfoReviewList(data) {
  return defHttp.get({ url: Api.Prefix + `/engineeringreview`, data });
}

/**
 * 工程资料评审详情
 * @param id
 * @returns
 */
export function getEngineerInfoReviewDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/engineeringreview/${id}` });
}

/**
 * 工程资料评审
 * @param id
 * @returns
 */
export const reviewEngineerInfo = id => defHttp.put({ url: Api.Prefix + `/engineeringreview/${id}` });

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importsampleapplyexportexcel`, data });
}
