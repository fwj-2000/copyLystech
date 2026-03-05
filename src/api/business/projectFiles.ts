import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/ProjDoc',
}

/**
 * @description 分页查询
 * @param params 查询参数
 */
export function getPagingList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 总览页面
 * @param params 查询参数
 */
export function getOverviewList(params) {
  return defHttp.get({ url: Api.Prefix + '/Overview', params });
}

/**
 * @description 保存
 * @param data 请求体数据
 */
export function saveProjFiles(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * @description 获取料号阶段文件类型是否已上传过
 * @param params 查询参数
 */
export function checkUploadStatusProjFiles(params) {
  return defHttp.get({ url: `${Api.Prefix}/AlreadyUpload`, params });
}

/**
 * 资料维护人上传文件后的提交
 * @param data
 * @returns
 */
export function saveProjectDoc(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/DocUpload`, data });
}

/**
 * @description 批量删除
 * @param data 请求体数据
 */
export function bulkDeleteProjFiles(data) {
  return defHttp.post({ url: `${Api.Prefix}/bulk/delete`, data });
}

/**
 * @description 提交--同意
 * @param data 请求体数据
 */
export function submitProjFiles(data) {
  return defHttp.post({ url: `${Api.Prefix}/Commit`, data });
}

/**
 * @description 驳回
 * @param data 请求体数据
 */
export function rejectProjFiles(data) {
  return defHttp.post({ url: `${Api.Prefix}/Reject`, data });
}

/**
 * @description 撤回
 * @param data 请求体数据
 */
export function bulkWithdrawProjFiles(data) {
  return defHttp.post({ url: `${Api.Prefix}/Withdraw`, data });
}

/**
 * @description  下载
 * @param data 请求体数据
 */
export function downloadProjFiles(data) {
  return defHttp.post({ url: `${Api.Prefix}/Download`, data: { ids: data } });
}

/**
 * @description 获取升版详情
 * @param data 请求体数据
 * */
export function getUpgradeDetails(data) {
  return defHttp.post({ url: `${Api.Prefix}/Upgrade`, data });
}
