import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/SkillLevel',
}

//查询列表
export function getSkillLevel(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getSkillLevelById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addSkillLevel(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateSkillLevel(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteSkillLevel(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteSkillLevel(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportSkillLevelExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importSkillLevelData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importSkillLevelPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}
