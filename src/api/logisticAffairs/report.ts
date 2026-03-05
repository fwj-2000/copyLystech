import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/',
}

/**
 * @description 关务业务报表 - 分页
 * @param params 请求参数
 */
export function getCustomSaffairsReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'customsaffairsreport', params });
}

/**
 * @description 关务业务报表 - 导出
 * @param params 请求参数
 * @returns
 */
export function exportCustomSaffairsReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'customsaffairsreport/importreportexcel', params });
}
