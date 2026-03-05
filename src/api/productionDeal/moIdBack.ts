import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/information/moldrefundapply',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getMoldApplyList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 提交
 * @param params 查询参数
 * @param data 请求体数据
 */
export function applyMoId(params, data) {
  return defHttp.put({ url: Api.Prefix, params, data });
}

/**
 * @description 导出Excel
 * @param params 查询参数
 */
export function exportExcel(params) {
  return defHttp.get({ url: `${Api.Prefix}/exportexcel`, params });
}

/**
 * @description 获取详情
 * @param id 主键Id
 * @param params 查询参数
 */
export function getDetail(id, params) {
  return defHttp.get({ url: `${Api.Prefix}/exportexcel/${id}`, params });
}

/**
 * @description 获取节点履历记录
 * @param params 查询参数
 */
export function getNodeList(params) {
  return defHttp.get({ url: `${Api.Prefix}/GetNodeList`, params });
}

/**
 * @description 批量确认匹配（领退）
 * @param data 请求体数据
 */
export function bulkConfirmRefund(data) {
  return defHttp.post({ url: `${Api.Prefix}/bulkBackConfirmRefund`, data });
}

/**
 * @description 批量终止
 * @param params 查询参数
 * @param data 请求体数据
 */
export function bulkBackTermination(params, data) {
  return defHttp.put({ url: `${Api.Prefix}/stop`, params, data });
}

/**
 * @description 批量撤回
 * @param data 请求体数据
 */
export function bulkWithdraw(data) {
  return defHttp.post({ url: '/information/moldrefundfund/withdraw', data });
}

/**
 * @description 批量打印
 * @param data 请求体数据
 */
export function bulkPrint(data) {
  return defHttp.post({ url: '/information/moldrefundfund/print', data });
}

/**
 * @description 获取详情列表
 * @param params 查询参数
 * @param data 请求体数据
 */
export function getDetailList(params, data) {
  return defHttp.post({ url: `${Api.Prefix}/getList`, params, data });
}
