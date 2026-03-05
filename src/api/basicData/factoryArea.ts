import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData/FactoryArea',
}

// 获取厂区列表
export function getFactoryAreaList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取BU列表
export function getBuInfoList() {
  return defHttp.get({ url: Api.Prefix + '/GetBuInfo' });
}

//同步厂区
export function syncFactoryArea() {
  return defHttp.post({ url: Api.Prefix + '/SyncFactoryArea' });
}

//通过ID查询
export function getFactoryAreaById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addFactoryArea(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateFactoryArea(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteFactoryArea(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}
