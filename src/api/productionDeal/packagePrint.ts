import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/PackLabelPrintRecord',
  ProductionPrefix = '/api/Production/PackLabelPrint',
  PrePrintTemplate = '/api/CoreCommon/PrintTemplate',
  ProductionSinglePrefix = '/api/Production/PackLabelPrintSingle',
}

//查询列表
export function getPackLabelPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

export function getPackLabelInfoForPrint(data) {
  return defHttp.get({ url: Api.Prefix + '/getPackLabelInfoForPrint', data });
}

// 获取主要制程
export function getMainProcessByInnerMaterialCode(data) {
  return defHttp.get({ url: Api.Prefix + '/getMainProcessByInnerMaterialCode', data });
}

// 指定条件查询所有模板
export function getAllPrintTemplate(data) {
  return defHttp.get({ url: '/api/CoreCommon/PrintTemplate/all', data });
}

// 指定条件查询所有模板
export function getPrintTemplateById(id) {
  return defHttp.get({ url: `/api/CoreCommon/PrintTemplate/${id}` });
}

// 获取打印数据
export function getPrintDataList(data) {
  return defHttp.get({ url: Api.Prefix + '/getPrintDataList', data });
}

// 包装打印-分页列表
export function getPackLabelPrint(data) {
  return defHttp.get({ url: Api.ProductionPrefix, data });
}

// 包装打印-导出
export function ExportData(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/ExportData', data });
}

// 根据SN或者单据号获取当前标签的信息
export function GetCurrentDetailBySnOrDocNo(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/GetCurrentDetailBySnOrDocNo', data });
}

// 包装打印-打印
export function PrintApi(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/Print', data });
}

export function getPrintTemplateDetail(data) {
  return defHttp.get({ url: Api.PrePrintTemplate + '/' + data });
}

// 包装打印-单品分页列表
export function getPackLabelPrintSingle(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix, data });
}

// 包装打印-单品打印提交
export function PrintSingleApi(data) {
  return defHttp.post({ url: Api.ProductionSinglePrefix + '/Print', data });
}

// 包装打印-单品导出
export function ExportDataSingle(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/ExportData', data });
}

// 根据SN当前标签的信息
export function GetCurrentDetailBySn(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/GetCurrentDetailBySnOrDocNo', data });
}

// 客户打印获取详情数据
export function getCustomerLabel(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/CustomerLabel', data });
}

export function getDetails(data) {
  return defHttp.post({ url: Api.ProductionSinglePrefix + '/Details', data });
}

// 获取内包标签的详细信息
export function getPackDetail(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/GetPackDetail', data });
}

// 内包合并
export function mergePackage(data) {
  return defHttp.post({ url: Api.ProductionSinglePrefix + '/MergePackage', data });
}

// 内包补码
export function appendPrint(data) {
  return defHttp.post({ url: Api.ProductionSinglePrefix + '/appendPrint', data });
}

// 扫内包码 得到已有的SN信息
export function getSnsByInCode(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/GetSnsByInCode', data });
}
// 包装，单品，获取SN详情
export function getSnDetail(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/GetSnListPage', data });
}
// 包装，单品分页查询
export function PageNew(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/PageNew', data });
}

// 包装打印-获取包装信息详情
export function getUpdatePackDetail(data) {
  return defHttp.get({ url: Api.ProductionSinglePrefix + '/GetUpdatePackDetail', data });
}

// 包装打印-修改包装信息详情
//
export function updatePackDetail(data) {
  return defHttp.post({ url: Api.ProductionSinglePrefix + '/UpdatePackDetail', data });
}

// 批量删除内包
export function deleteInPack(data) {
  return defHttp.post({ url: Api.ProductionSinglePrefix + '/DeletePack', data });
}

// 获取配置参数
export function getpacklabelprint() {
  return defHttp.get({ url: '/api/Production/Productionconfigparam/getpacklabelprint' });
}
