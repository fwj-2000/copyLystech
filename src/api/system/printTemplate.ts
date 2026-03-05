import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/CoreCommon/PrintTemplate',
  PrefixSelect = '/api/Production/fieldconfig/getlistbyprintcategory',
}

// 获取打印模板列表(分页)
export function getPrintTemplate(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
// 创建更新打印模板
export function addPrintTemplate(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
// 删除打印模板
export function deletePrintTemplate(data) {
  return defHttp.post({ url: Api.Prefix + '/delete', data });
}
// 获取单个打印模板详情
export function getPrintTemplateDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/' + data });
}

// 获取全部的系统字段
export function getPrintTemplateAllText() {
  return defHttp.get({ url: Api.Prefix + '/GetDesignSysFields' });
}
//新增系统字段
export function addSystemText(data) {
  return defHttp.post({ url: Api.Prefix + '/addDesignSysField', data });
}
//修改系统字段类型
export function updateSystemTextType(id, data) {
  return defHttp.put({ url: Api.Prefix + '/editDesignSysFieldType/' + id, data });
}
//新增系统字段类型
export function adSystemTextType(data) {
  return defHttp.post({ url: Api.Prefix + '/addDesignSysFieldType', data });
}
//禁用启用
export function disableEnable(data) {
  return defHttp.post({ url: Api.Prefix + '/DisOrEnable', data });
}
// 删除系统字段
export function DesignSysField(id) {
  return defHttp.delete({ url: Api.Prefix + '/DesignSysField/' + id });
}

// 获取全部的系统字段
export function getlistbyprintcategory(data) {
  return defHttp.get({ url: Api.PrefixSelect + '?printTemCategory=' + data });
}
