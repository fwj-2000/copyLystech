import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/information/moldreceiveapplyreview',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getMoidAuditList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 导出Excel
 * @param params 查询参数
 */
export function exportExcel(params) {
  return defHttp.get({ url: `${Api.Prefix}/Export`, params });
}

/**
 * @description 批量同意
 * @param data 主键Id集
 */
export function bulkBackAgree(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackAgree`, data });
}

/**
 * @description 批量驳回
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 */
export function bulkBackReject(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReject`, data });
}

/**
 * @description 批量撤回
 * @param data 主键Id集
 */
export function bulkBackReview(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReview`, data });
}
