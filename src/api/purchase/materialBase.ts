import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/BaseData/materialarea',
}
export function getMaterialList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取子级
export function getMaterialSubList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取详情
export function getDetails(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

// 修改
export function updateMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}
// 新增
export function addMaterial(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 删除
export function delMaterial(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

/**
 * 获取带有材料小类编码的材料类型列表
 * @param params
 */
export function getSubclassCodeList(params: { keyword: string }) {
  return defHttp.get({ url: Api.Prefix + '/GetSubclassCodeList', params });
}
