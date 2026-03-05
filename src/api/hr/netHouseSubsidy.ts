import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/netroomsubsidy/',
}

export function getNetroomsubsidyBasis(data) {
  return defHttp.get({ url: Api.Prefix + `basis`, data });
}
/**
 * 导入模板下载 V2
 * @param templateType 0提报模版、1补贴模版
 */
export function subsidyTempDownApi({ templateType }: { templateType: '1' | '0' }) {
  return defHttp.get({ url: Api.Prefix + `downloadtemplate?templateType=${templateType}` });
}
// /report/netroomsubsidy/basisdel
export function basisdel(data) {
  return defHttp.post({ url: Api.Prefix + `basisdel`, data });
}
// /report/netroomsubsidy/submitbasisdata
export function submitbasisdata(data) {
  const queryString = new URLSearchParams(data).toString(); // 手动拼接 query 参数
  return defHttp.post({ url: Api.Prefix + `submitbasisdata?${queryString}` });
}
// 总览1页面
export function getReportdata(data) {
  return defHttp.get({ url: Api.Prefix + `reportdata`, data });
}
//总览1-存档// 总览1-存档
export function approvalreportdata(data) {
  const queryString = new URLSearchParams(data).toString(); // 手动拼接 query 参数
  return defHttp.post({ url: Api.Prefix + `approvalreportdata?${queryString}` });
}
// 总览1-解锁
export function unlockbasisdata(data) {
  return defHttp.post({ url: Api.Prefix + `unlockbasisdata`, data });
}
// 总览2页面
export function reportdetail(data) {
  return defHttp.get({ url: Api.Prefix + `reportdetail`, data });
}
// 导出已处理excel
export function exportReportDataApi(data) {
  return defHttp.get({ url: Api.Prefix + 'exportreportdata', data });
}
// 导出已处理excel
export function getfloorList() {
  return defHttp.get({ url: Api.Prefix + 'floor' });
}
export function getReportDataSelectOptParam(data) {
  return defHttp.get({ url: Api.Prefix + 'reportdataselectoptparam', data });
}

export function addorupdatebasis(data) {
  return defHttp.post({ url: Api.Prefix + 'addorupdatebasis', data });
}
export function reportdatapageparam(data) {
  return defHttp.get({ url: Api.Prefix + 'reportdatapageparam', data });
}
export function getSupRegPageParam(data) {
  return defHttp.get({ url: Api.Prefix + 'supRegPageParam', data });
}

export function getStandardApi(data) {
  return defHttp.get({ url: Api.Prefix + 'standard', data });
}
export function updateStandardApi(data) {
  return defHttp.put({ url: Api.Prefix + 'updatestandard', data });
}
export function reportstatus(data) {
  return defHttp.get({ url: Api.Prefix + 'reportstatus', data });
}
export function standardDel(data) {
  return defHttp.post({ url: Api.Prefix + 'standardDel', data });
}
export function getReportDataSupReg(data) {
  return defHttp.get({ url: Api.Prefix + 'reportDataSupReg', data });
}
export function exportSupRegData(data) {
  return defHttp.get({ url: Api.Prefix + 'exportSupRegData', data });
}
export function delSupReg(data) {
  return defHttp.post({ url: Api.Prefix + 'supRegDel', data });
}
export function submitSupReg(data) {
  return defHttp.post({ url: Api.Prefix + 'submitSupReg', data });
}
// 总览1-解锁
export function unlockSupRegData(data) {
  return defHttp.post({ url: Api.Prefix + `unlockSupRegData`, data });
}
export function getSupRegSelectOptParam(data) {
  return defHttp.get({ url: Api.Prefix + 'supRegSelectOptParam', data });
}
