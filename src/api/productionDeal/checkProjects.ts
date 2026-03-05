import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/checkproject',
}

//查询列表
export function getCheckproject(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getCheckprojectlist() {
  return defHttp.get({ url: Api.Prefix + `/getcheckprojectlist` });
}

//新增
export function addCheckproject(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateCheckproject(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteCheckproject(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteCheckproject(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportCheckprojectExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/export`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importCheckprojectPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importCheckprojectData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
