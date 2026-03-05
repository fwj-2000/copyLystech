import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/ExchangeRate',
  baseData = '/api/BaseData',
}

//查询列表
export function getExchangeRate(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//通过ID查询
export function getExchangeRateById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addExchangeRate(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateExchangeRate(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteExchangeRate(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteExchangeRate(data) {
  return defHttp.post({ url: Api.Prefix + '/BlukDelete', data });
}

//导出Excel
export function exportUnitExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//同步SAP
export function InsertFromSAP() {
  return defHttp.post({ url: Api.Prefix + `/InsertFromSAP` });
}

// 产品类型分页列表
// /api/BaseData/producttype/page
export function getProductType(data) {
  return defHttp.get({ url: Api.baseData + '/producttype/page', data });
}

// 新增产品类型
// /api/BaseData/producttype/create
export function addProductType(data) {
  return defHttp.post({ url: Api.baseData + '/producttype/create', data });
}

// 修改产品类型
// /api/BaseData/producttype/{id}
export function updateProductType(data) {
  return defHttp.put({ url: Api.baseData + `/producttype/${data.id}`, data });
}

export function deleteProductType(data) {
  return defHttp.post({ url: Api.baseData + `/producttype/bulkdelete`, data });
}

// 创建分页列表
// /BaseData/ProductType/ProjectClassPage
export function getProjectClassPage(data) {
  return defHttp.get({ url: Api.baseData + '/producttype/ProjectClassPage', data });
}

// 新增项目分类
// /BaseData/ProductType/CreateProjectClass
export function addProjectType(data) {
  return defHttp.post({ url: Api.baseData + '/productType/CreateProjectClass', data });
}

// 批量删除
// /BaseData/ProductType/Bulk/DeleteProjectClass
export function delProjectClass(data) {
  return defHttp.post({ url: Api.baseData + '/productType/Bulk/DeleteProjectClass', data });
}
