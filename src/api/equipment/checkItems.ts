import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/CheckItems',
}

//查询
export function getPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//根据id查询
export function getItemById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//查询List
export function getItemList(data) {
  return defHttp.get({ url: Api.Prefix + `/List`, data });
}

//新增
export function addItem(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateItem(data) {
  return defHttp.put({ url: Api.Prefix, data });
}

//删除
export function deleteItem(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteItems(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}
