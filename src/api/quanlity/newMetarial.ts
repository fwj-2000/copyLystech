import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information/materialdevelopqualitydesensitization',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 修改-材料登记
export function updateNewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/updatequalitydesensitization', data });
}

// 暂存
export function storageNewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/temporarystorage', data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + `/getsendsamplesrecord`, data });
}

// 审核
export function reviewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

// 撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}
// 驳回
export function rejectMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulk/reject', data });
}

//导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importengineeringcheckexportexcel`, data });
}

export function exportMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importqualitydesensitizationexportexcel`, data });
}

// 下载报告
export function downloadReport(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}/download/downloadtestreport` });
}

// 获取待登记的数据
export function getListTodo(data) {
  return defHttp.get({ url: Api.Prefix + '/getqualitydesensitizationlist', data });
}

// 获取节点详情
export function getNodeDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/getnodelist', data });
}

// 转办
export function transfer(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/bulktransfer', data });
}

//批量领取
export function sampleCollection(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/Claim', data });
}
