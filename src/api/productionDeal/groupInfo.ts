import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/GroupInfo',
}

//查询列表
export function getGroupInfo(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getGroupInfoById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addGroupInfo(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateGroupInfo(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteGroupInfo(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteGroupInfo(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportGroupInfoExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importGroupInfoPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importGroupInfoData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
