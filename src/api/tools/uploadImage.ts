import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/analysis/analysUpload',
}

//查询列表
export function getUploadImage(data) {
  return defHttp.get({ url: Api.Prefix + '/page', data });
}
//通过Id查询
export function getUploadImageById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addUploadImage(data) {
  return defHttp.post({ url: Api.Prefix + '/add', data });
}

//修改
export function updateUploadImage(data) {
  return defHttp.put({ url: Api.Prefix + `/update`, data });
}

//批量删除
export function blukDeleteUploadImage(data) {
  return defHttp.post({ url: Api.Prefix + '/batchDel', data });
}
