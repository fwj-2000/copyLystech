import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/information/moldreceive',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getMoidUsedList(params) {
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
 * @description 批量确认领用
 * @param data 主键Id集
 */
export function bulkBackConfirm(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackConfirm`, data });
}

/**
 * @description 批量撤回
 * @param data 主键Id集
 */
export function bulkBackReview(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReview`, data });
}
