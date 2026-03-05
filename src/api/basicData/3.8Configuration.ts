import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/BaseData/Config3_8',
}

//查询列表
export function getConfig3_8(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//详情
export function getConfig3_8Detail(id) {
  return defHttp.get({ url: Api.Prefix + '/GetInfo' + `/${id}` });
}

//新增
export function addConfig3_8(data) {
  return defHttp.post({ url: Api.Prefix + '/Add', data });
}

//修改
export function updateConfig3_8(data) {
  return defHttp.post({ url: Api.Prefix + '/Update', data });
}

//批量删除
export function blukDeleteConfig3_8(data) {
  return defHttp.post({ url: Api.Prefix + '/Delete', data });
}
