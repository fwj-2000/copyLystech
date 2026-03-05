import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/applyworkprocesspersonnel',
}
//查询列表
export function getPositionStaff(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addPositionStaff(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updatePositionStaff(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deletePositionStaff(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukPositionStaff(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

// 批量新增
export function batchaddPositionStaff(data) {
  return defHttp.post({ url: Api.Prefix + '/batchadd', data });
}
