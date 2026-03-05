import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information/materialdevelopengineeringcheck',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
}

// 结果判定
export function checkMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/updatecheckdetermine', data });
}

// 待验证处理
export function dealMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/processedcheckdetermine`, data });
}

// 撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}
// 待验证撤回
export function recallMaterialToDo(data) {
  return defHttp.put({ url: Api.Prefix + '/waitcheckbulkwithdraw', data });
}
// 驳回
export function rejectMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulk/reject', data });
}

// 终止
export function stopMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbacktermination', data });
}
// 不寻料
export function notSeekMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/notseekmaterials', data });
}

// 导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importengineeringcheckexportexcel`, data });
}

// 获取供应商
export function getSuppliers(data) {
  return defHttp.get({ url: Api.Prefix + `/getsupplierlist`, data });
}
