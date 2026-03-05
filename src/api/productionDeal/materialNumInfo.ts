import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/innermaterialnumbersnquantity',
}
//查询列表
export function getMaterialNumInfo(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addMaterialNumInfo(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//通过Id查询
export function getMaterialNumInfoById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}
// 通过热压标签查料号数量等
export function getInfoById(data) {
  return defHttp.get({ url: Api.Prefix + `/get`, data });
}
//修改
export function updateMaterialNumInfo(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteMaterialNumInfo(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteMaterialNumInfo(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
