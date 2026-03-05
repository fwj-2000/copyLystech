import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/AOISizeDataReport',
}

// AOI数据报表列表
export function getAOISizeDataReportList(data) {
  return defHttp.post({ url: Api.Prefix + '/CustomerReport', data });
}

// AOI数据报表导出
export function AOISizeDataReportExport(data) {
  return defHttp.post({ url: Api.Prefix + '/CustomerExport', data });
}

// 推送
export function AOISizeDataReportSendSerin(data) {
  return defHttp.post({ url: Api.Prefix + '/CustomerSendSerin', data });
}

// 查看推送记录
export function datatransferrecord(data) {
  return defHttp.get({ url: '/api/Production/datatransferrecord', data });
}

// 获取审核
export function getapprover(data) {
  return defHttp.post({ url: Api.Prefix + '/getapprover', data });
}

// 提交审核
export function addapprover(data) {
  return defHttp.post({ url: Api.Prefix + '/addapprover', data });
}
