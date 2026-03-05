import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/basedata/approvermaintenance',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getFcAuditList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 新增
 * @param data 请求体数据
 */
export function addFcAudit(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * @description 修改
 * @param data 请求体数据
 */
export function updateFcAudit(data) {
  return defHttp.put({ url: Api.Prefix, data });
}

/**
 * @description 获取详情
 * @param id 主键Id
 * @param params 查询参数
 */
export function getFcAuditDetail(id, params) {
  return defHttp.get({ url: `${Api.Prefix}/${id}`, params });
}

/**
 * @description 获取成员列名配置
 * @param params 查询参数
 */
export function getFcAuditConfigColumn(params) {
  return defHttp.get({ url: `${Api.Prefix}/GetConfigColumn`, params });
}

/**
 * @description 批量获取详情
 * @param data 请求体数据
 */
export function getFcAuditBulkDetail(data) {
  return defHttp.put({ url: `${Api.Prefix}/GetDetail`, data });
}

/**
 * @description 批量删除
 * @param data 请求体数据
 */
export function bulkDeleteFcAudit(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackDelete`, data });
}
