import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/productionconfigparam',
}
//查询列表
export function getProductConfigParam(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addProductConfigParam(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProductConfigParam(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteProductConfigParam(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukProductConfigParam(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
