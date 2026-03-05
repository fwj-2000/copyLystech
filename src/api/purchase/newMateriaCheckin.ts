import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information/materialdeveloppurchaseverify',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
}

// 重新送样
export function sampleMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/resendsample', data });
}

// 重新推荐
export function recommendMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/resendrecommend`, data });
}

// 暂存
export function storageMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/temporarystorage`, data });
}

// 撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}

// 退回工程
export function rejectMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/returnengineering', data });
}

// 导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importengineeringcheckexportexcel`, data });
}
