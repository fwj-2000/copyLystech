import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information/materialdevelopapplyrepeatedly',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
}

// 暂存
export function storageMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/temporarystorage?id=' + data.id, data });
}

// 修改
export function updateMaterial(data) {
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
// 不寻料
export function notSeekMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/notseekmaterials', data });
}

// 导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importrepeatedlyexportexcel`, data });
}

// 获取供应商
export function getSuppliers(data) {
  return defHttp.get({ url: Api.Prefix + `/getsupplierlist`, data });
}
