import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/ProblemReleaseHandle',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getQsDealList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 问题处理
 * @param data 请求体数据
 */
export function handleProblem(data) {
  return defHttp.put({ url: `${Api.Prefix}/Handle`, data });
}

/**
 * @description 暂存
 * @param data 请求体数据
 */
export function temporaryStorage(data) {
  return defHttp.put({ url: `${Api.Prefix}/TemporaryStorage`, data });
}

/**
 * @description 批量撤回
 * @param data 请求体数据
 */
export function bulkWithdrawQsDeal(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReview`, data });
}

/**
 * @description 批量驳回
 * @param data 请求体数据
 */
export function bulkRejectQsDeal(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkReject`, data });
}

/**
 * @description 批量转办
 * @param data 请求体数据
 */
export function bulkTransferQsDeal(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkTransfer`, data });
}
