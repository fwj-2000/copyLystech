import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/bomtosap',
}

/**
 * PCC转化 - BOM数据列表
 * @param params
 */
export function getBomtosap(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * PCC转化 - 工艺路线数据列表
 * @param params
 */
export function getProcess(params: any) {
  return defHttp.get({ url: Api.Prefix + '/process', params });
}

/**
 * PCC转化 - 生产版本数据列表
 * @param params
 */
export function getProduceversion(params: any) {
  return defHttp.get({ url: Api.Prefix + '/produceversion', params });
}

/**
 * 导出excel
 * @param params
 * @returns
 */
export function exportExcel(params: any) {
  return defHttp.get({ url: Api.Prefix + '/export', params });
}

/**
 * 同步sap
 * @param params
 * @returns
 */
export function syncToSAP(params: any) {
  return defHttp.get({ url: Api.Prefix + '/SyncToSAP', params });
}
