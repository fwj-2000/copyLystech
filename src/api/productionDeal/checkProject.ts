import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/checkconfigitem',
  nwePrefix = '/api/Production/checkconfig',
}

//查询列表
export function getCheckProject(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增.
export function addCheckProject(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateCheckProject(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteCheckProject(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}
//批量删除
export function blukDeleteCheckProject(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//查询列表点检
export function getCheckt(data) {
  return defHttp.get({ url: Api.nwePrefix, data });
}

// 新增点检
export function addCheckt(data) {
  return defHttp.post({ url: Api.nwePrefix, data });
}

//修改点检
export function updateCheck(data) {
  return defHttp.put({ url: Api.nwePrefix + `/${data.id}`, data });
}

//删除点检
export function deleteCheck(id) {
  return defHttp.delete({ url: Api.nwePrefix + `/${id}` });
}
//批量删除点检
export function blukDeleteCheck(data) {
  return defHttp.post({ url: Api.nwePrefix + '/bulk/delete', data });
}
//执行点检
export function executeCheck(data) {
  return defHttp.get({ url: Api.nwePrefix + `/executecheck/${data.id}?parameterValue=${data.parameterValue}` });
}
