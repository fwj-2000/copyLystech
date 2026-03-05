import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/cloudmeasureqms',
}

//QMS查询列表
export function getQMS(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getQMSById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addQMS(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateQMS(data) {
  return defHttp.put({ url: Api.Prefix, data });
}

//删除
export function deleteQMS(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteQMS(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}
