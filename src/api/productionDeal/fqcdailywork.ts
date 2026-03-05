import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/fqcdailywork',
}

// 查询列表
export function getFqcdailywork(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addFqcdailywork(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function editFqcdailywork(id, data) {
  return defHttp.post({ url: Api.Prefix + '/id', data });
}

//导出Excel
export function exportFqcdailywork(data) {
  return defHttp.get({ url: Api.Prefix + `/export`, data });
}

//导出Excel
export function importFqcdailywork(data) {
  return defHttp.put({ url: Api.Prefix + `/bathadd`, data });
}

// 查询列表
export function getFqcdailyworkDetail(id) {
  return defHttp.get({ url: Api.Prefix+'/'+id });
}