import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = 'api/BaseData/producttype',
}

//查询列表
export function getProductTypeList(data) {
  return defHttp.get({ url: Api.Prefix + '/page', data });
}

//通过ID查询
export function getProductTypeById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addProductType(data) {
  return defHttp.post({ url: Api.Prefix + '/create', data });
}

//修改
export function updateProductType(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteProductType(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteProductType(data) {
  return defHttp.post({ url: Api.Prefix + '/bulkdelete', data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/templatedownload` });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/importdata`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/importpreview`, data });
}

//导出Excel
export function exportProductTypeExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/exportData`, data });
}
