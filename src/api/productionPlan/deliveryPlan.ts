import { defHttp } from '/@/utils/http/axios';

// 主计划 量试计划
enum Api {
  Prefix = '/api/Information',
}
// 获取需求计划列表
export function getListAPI(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativedeliveryplan`, data });
}
// 获取需求计划的详情
export function getDetailAPI(id) {
  return defHttp.get({ url: Api.Prefix + `/quantitativedeliveryplan/${id}` });
}
// 获取详情列表
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativedeliveryplan/getdetail`, data });
}
// 更新需求计划
export function updateAPI(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativedeliveryplan/updatequantitative`, data });
}
// 转办
export function gettransferuserAPI(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativedeliveryplan/bulk/bulktransfer`, data });
}
// 导出
export function exportExleAPI(data) {
  return defHttp.get({
    url: Api.Prefix + '/quantitativedeliveryplan/importquantitativedeliveryplanexportexcel',
    data,
  });
}
// 驳回
export function rejectApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativedeliveryplan/bulk/reject',
    data,
  });
}
// 撤回
export function recallApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativedeliveryplan/bulkwithdraw',
    data,
  });
}
// 暂存数据
export function storageDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativedeliveryplan/temporarystorage`, data });
}

// 模切计划

// 获取需求计划列表
export function getDcListAPI(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativediecuttingplan`, data });
}
// 获取需求计划的详情
export function getDcDetailAPI(id) {
  return defHttp.get({ url: Api.Prefix + `/quantitativediecuttingplan/${id}` });
}
// 获取详情列表
export function getDcDetails(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativediecuttingplan/getdetail`, data });
}
// 更新需求计划 /Information/quantitativediecuttingplan/updatequantitative
export function updateDcAPI(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativediecuttingplan/updatequantitative`, data });
}
// 转办
export function getDctransferuserAPI(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativediecuttingplan/bulk/bulktransfer`, data });
}
// 导出
export function exportDcExleAPI(data) {
  return defHttp.get({
    url: Api.Prefix + '/quantitativediecuttingplan/importquantitativediecuttingplanexportexcel',
    data,
  });
}
// 驳回
export function rejectDcApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativediecuttingplan/bulk/reject',
    data,
  });
}
// 撤回
export function recallDcApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativediecuttingplan/bulkwithdraw',
    data,
  });
}
// 暂存数据
export function storageDcDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativediecuttingplan/temporarystorage`, data });
}

// 获取交期
export function getDyColTitle(data) {
  return defHttp.put({
    url: Api.Prefix + '/quantitativedeliveryplan/getdetailconfig',
    data,
  });
}
