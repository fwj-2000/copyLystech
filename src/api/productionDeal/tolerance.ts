import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/Tolerance',
  PrefixProcess = '/api/BaseData/Process',
}

//查询列表
export function getTolerance(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取工序列表
export function getProcessList(keyword) {
  return defHttp.get({ url: Api.PrefixProcess + `/AllList` }, keyword);
}

//通过Id查询
export function getToleranceById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addTolerance(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateTolerance(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteTolerance(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteTolerance(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportToleranceExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importTolerancePreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importToleranceData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
