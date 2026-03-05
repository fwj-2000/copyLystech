import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/information/moldreceiverefund',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getUseBackList(params) {
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
 * @description 获取节点履历记录
 * @param params 查询参数
 */
export function getNodeList(params) {
  return defHttp.get({ url: `${Api.Prefix}/GetNodeList`, params });
}

/**
 * @description 批量匹配货架号
 * @param data 主键Id集
 */
export function bulkBackMatch(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackMatch`, data });
}

/**
 * @description 批量确认发放
 * @param data 主键Id集
 */
export function bulkBackConfirmReceive(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackConfirmReceive`, data });
}
/**
 * @description 确认发放
 * @param data 主键Id集
 */
export function BulkBackConfirmRefund(data) {
  return defHttp.post({ url: `${Api.Prefix}/BulkBackConfirmRefund`, data });
}

/**
 * @description 批量驳回
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 */
export function bulkBackReject(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReject`, data });
}

/**
 * @description 批量驳回
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 */
export function bulkBackDelete(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackDelete`, data });
}

/**
 * @description 暂存领用临时单
 * @param data 主键Id集
 */
export function temporaryStorage(data) {
  return defHttp.put({ url: `${Api.Prefix}/TemporaryStorage`, data });
}

/**
 * @description 创建领用临时单
 * @param data 主键Id集
 */
export function createTemporaryReceive(data) {
  return defHttp.put({ url: `${Api.Prefix}/CreateTemporaryReceive`, data });
}

/**
 * @description 创建退回临时单
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 */
export function createTemporaryRefund(data) {
  return defHttp.put({ url: `${Api.Prefix}/CreateTemporaryRefund`, data });
}

/**
 * @description 暂存退回临时单
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 */
export function temporaryStorageRefund(data) {
  return defHttp.put({ url: `${Api.Prefix}/TemporaryStorageRefund`, data });
}

/**
 * @description 核销
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 */
export function bulkBackConfirmWriteOff(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackConfirmWriteOff`, data });
}

/**
 * @description 获取已领用模具料号
 * @param data 包含主键Id集、驳回原因和节点Id的对象
 *  */
export function getReceiveMoldPartNumberList(data) {
  return defHttp.get({ url: `${Api.Prefix}/GetReceiveMoldPartNumberList`, params: data });
}

/**
 * @description 获取临时单据详情 /information/moldreceiverefund/GetTemporaryOrderDetail
 * @param data 包含主键Id集
 *  */
export function getTemporaryOrderDetail(data) {
  return defHttp.put({ url: `${Api.Prefix}/GetTemporaryOrderDetail`, data: data });
}
