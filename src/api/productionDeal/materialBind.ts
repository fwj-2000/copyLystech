import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/stackmaterial',
}

//查询列表
export function getStackmaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 校验热压标签.
export function checktemplabel(data) {
  return defHttp.get({ url: Api.Prefix + '/checktemplabel', data });
}

// 获取SN数据.
export function getsninfo(data) {
  return defHttp.get({ url: Api.Prefix + '/getsninfo', data });
}

// 新增.
export function addStackmaterial(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 详情
export function getStackmaterialDetail(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

// 单个SN新增
// onesncreate
export function onesncreate(data) {
  return defHttp.post({ url: Api.Prefix + '/onesncreate', data });
}
