import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information/materialdevelopcheck',
}

// 查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增
export function addNewMaterial(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
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

// 导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportMaterialDevelApplyExportExcel`, data });
}
