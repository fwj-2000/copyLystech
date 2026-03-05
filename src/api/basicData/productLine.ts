import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/ProductLine',
}

//查询列表
export function getProductLine(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//产品线列表
export function getProductLineList(searchKey = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetProductLineList/${searchKey}` });
}

//通过ID查询
export function getProductLineById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addProductLine(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProductLine(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteProductLine(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteProductLine(data) {
  return defHttp.post({ url: Api.Prefix + '/BlukDelete', data });
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
export function exportProductLineExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//获取生成线
export function getProductLineCode(data = ' ', mainProcess = 0) {
  return defHttp.get({ url: Api.Prefix + `/GetProductLineCode/${data}/${mainProcess}` });
}

//获取未使用的字母
export function getCode() {
  return defHttp.get({ url: Api.Prefix + `/GetCode` });
}

// 获取产品线编码列表
// /Information/ProductLine/GetProductLineCodeList
export function getProductLineCodeList(data) {
  return defHttp.get({ url: Api.Prefix + `/GetProductLineCodeList`, data });
}

// 新增/修改产品线编码
// /Information/ProductLine/ProductLineCode
export function addProductLineCode(data) {
  return defHttp.post({ url: Api.Prefix + `/ProductLineCode`, data });
}

// 获取产品线可使用编码
// /Information/ProductLine/GetCode/{mainProcess}
export function getProductLineCodeByMainProcess(data) {
  return defHttp.get({ url: Api.Prefix + `/GetCode/${data.mainProcess}` });
}
