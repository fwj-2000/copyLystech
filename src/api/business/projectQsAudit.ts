import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/ProblemReleaseDqeReview',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getQsAuditList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 问题审核
 * @param data 请求体数据
 */
export function agreeProblem(data) {
  return defHttp.put({ url: `${Api.Prefix}/Handle`, data });
}

/**
 * @description 批量转办
 * @param data 请求体数据
 */
export function bulkTransferQsAudit(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkTransfer`, data });
}

/**
 * @description 批量驳回
 * @param data 请求体数据
 */
export function bulkRejectQsAudit(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkReject`, data });
}

/**
 * @description 批量撤回
 * @param data 请求体数据
 */
export function bulkBackReviewQsAudit(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReview`, data });
}
