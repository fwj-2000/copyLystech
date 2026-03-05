import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/TargetRateConfig',
}

//查询列表
export function getTargetRateConfig(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getTargetRateConfigById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addTargetRateConfig(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateTargetRateConfig(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteTargetRateConfig(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteTargetRateConfig(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}
