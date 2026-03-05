import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData/FactorySap',
}

//查询列表
export function getSapList(data) {
  return defHttp.get({ url: Api.Prefix + '/page', data });
}

//通过ID查询
export function getSapFactoryById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addSapFactory(data) {
  return defHttp.post({ url: Api.Prefix + '/Create', data });
}

//修改
export function updateSapFactory(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteSapFactory(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteSapFactory(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

//导出Excel
export function exportFactorySapExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//上传文件
export function uploadFile(data) {
  return defHttp.get({ url: Api.Prefix + `/uploader`, data });
}

//工厂代码下拉框
export function getFactoryCode(data) {
  return defHttp.get({ url: Api.Prefix + `/getfactoryAreaType`, data });
}
