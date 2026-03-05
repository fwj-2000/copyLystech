import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/mps/OrderTypeCode',
}

//查询列表
export function getOrderType(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getOrderTypeById(id) {
  return defHttp.get({ url: Api.Prefix + '/GetInfo' + `/${id}` });
}

//新增
export function addOrderType(data) {
  return defHttp.post({ url: Api.Prefix + '/Add', data });
}

//修改
export function updateOrderType(data) {
  return defHttp.post({ url: Api.Prefix + '/Update', data });
}

//删除
export function deleteOrderType(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteOrderType(data) {
  return defHttp.post({ url: Api.Prefix + '/Delete', data });
}
