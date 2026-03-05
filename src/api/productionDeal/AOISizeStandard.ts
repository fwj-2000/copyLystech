import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/aoiaizestandard',
}
//查询列表
export function getAOIaizestandard(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addAOIaizestandard(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateAOIaizestandard(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteAOIaizestandard(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukAOIaizestandard(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
