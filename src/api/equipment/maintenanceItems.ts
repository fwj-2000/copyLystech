import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/MaintenanceItems',
}

//查询
export function getPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

export function getMItemById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

export function getMItemList(data) {
  return defHttp.get({ url: Api.Prefix + `/List`, data });
}

//新增
export function addMItem(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateMItem(data) {
  return defHttp.put({ url: Api.Prefix, data });
}

//删除
export function deleteMItem(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

export function blukDeleteMItems(data) {
  return defHttp.delete({ url: Api.Prefix + `/BulkDelete`, data });
}
