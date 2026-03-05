import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/SpotCheck',
}

//查询列表
export function getPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//根据id查询
export function getCheckById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//查询暂存
export function getCheckByStatus() {
  return defHttp.get({ url: Api.Prefix + `/GetCheckByStatus` });
}

//新增
export function addCheck(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//删除暂存
export function deleteStatus() {
  return defHttp.delete({ url: Api.Prefix + `/DeleteStatus` });
}

//保存暂存
export function updateStatus(data) {
  return defHttp.put({ url: Api.Prefix + `/UpdateStatus`, data });
}

//删除
export function deleteCheck(data) {
  return defHttp.delete({ url: Api.Prefix, data });
}
