import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/Procedure',
}

//查询列表
export function getProcedure(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getProcedureById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addProcedure(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProcedure(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteProcedure(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteProcedure(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportProcedureExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importProcedurePreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importProcedureData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
