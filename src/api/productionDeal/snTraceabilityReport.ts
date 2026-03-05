import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/sntrace',
}

// SN追溯报表列表.
export function getSNtraceList(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// SN追溯报表列表导出
export function sntraceExport(data) {
  return defHttp.post({ url: Api.Prefix + '/export', data });
}

// SN追溯报表详情列表导出
export function sntraceExportDetail(data) {
  return defHttp.post({ url: Api.Prefix + '/exportdetail', data });
}
