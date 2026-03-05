import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/ProblemRelease',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getQsList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 问题发布
 * @param data 请求体数据
 */
export function publishProblem(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * @description 获取节点履历记录
 * @param params 查询参数
 */
export function getNodeDetail(params) {
  return defHttp.get({ url: `${Api.Prefix}/GetNodeList`, params });
}

/**
 * @description 获取问题发布文件
 * @param params 查询参数
 */
export function getProblemReleaseFiles(params) {
  return defHttp.get({ url: `${Api.Prefix}/GetProblemReleaseFileList`, params });
}

/**
 * @description 获取详情
 * @param data 请求体数据
 */
export function getQsDetail(data) {
  return defHttp.put({ url: `${Api.Prefix}/GetDetail`, data });
}

/**
 * @description 暂存
 * @param data 请求体数据
 */
export function temporaryStorage(data) {
  return defHttp.put({ url: `${Api.Prefix}/TemporaryStorage`, data });
}

/**
 * @description 删除上传文件
 * @param id 文件Id
 */
export function deleteFile(id) {
  return defHttp.put({ url: `${Api.Prefix}/${id}` });
}

/**
 * @description 批量删除
 * @param data 请求体数据
 */
export function bulkDeleteQs(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackDelete`, data });
}

/**
 * @description 批量撤回
 * @param data 请求体数据
 */
export function bulkWithdrawQs(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReview`, data });
}
