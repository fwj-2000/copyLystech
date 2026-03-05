import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/AOISizeDataReport',
}

// AOI数据报表列表
export function getAOISizeDataReportList(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// AOI数据报表导出
export function AOISizeDataReportExport(data) {
  return defHttp.post({ url: Api.Prefix + '/export', data });
}
