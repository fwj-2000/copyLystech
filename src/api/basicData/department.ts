import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData/Department',
}

//查询列表
export function getDepartment(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//查询厂区下的部门
export function getDepartmentList(data) {
  return defHttp.get({ url: Api.Prefix + '/GetDepartmentList', data });
}

//获取部门下拉选择数据
export function getDepartmentSelector(name = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetDepartmentSelector/${name}` });
}

//通过Id查询
export function getDepartmentById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addDepartment(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateDepartment(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteDepartment(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteDepartment(data) {
  return defHttp.post({ url: Api.Prefix + `/BulkDelete`, data });
}

//导出Excel
export function exportDepartmentExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
