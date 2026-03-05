import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/system/BaseLang',
}

// 获取语言列表
export function getBaseLangList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
// 新建语言
export function create(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
// 修改语言
export function update(data) {
  return defHttp.put({ url: Api.Prefix + '/' + data.id, data });
}
// 获取语言
export function getInfo(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}
// 删除语言
export function delBaseLang(id) {
  return defHttp.delete({ url: Api.Prefix + '/' + id });
}
// 获取语言内容
export function getLangDict() {
  return defHttp.get({ url: Api.Prefix + '/LangDict' });
}
// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}
// 导入数据
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
// 导出数据
export function exportData(data) {
  return defHttp.post({ url: Api.Prefix + `/ExportData`, data });
}
// 机器翻译文件列表
export function translateFileList(data) {
  return defHttp.get({ url: Api.Prefix + `/TranslateFiles`, data });
}

// 实时翻译
export function realTimeTranslate(data) {
  return defHttp.get({ url: Api.Prefix + `/RealTimeTranslate`, data });
}
