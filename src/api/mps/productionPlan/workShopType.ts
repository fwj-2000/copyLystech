import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/mps/WorkshopTypeCode',
}

//查询列表
export function getWorkshopType(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getWorkshopTypeById(id) {
  return defHttp.get({ url: Api.Prefix + '/GetInfo' + `/${id}` });
}

//新增
export function addWorkshopType(data) {
  return defHttp.post({ url: Api.Prefix + '/Add', data });
}

//修改
export function updateWorkshopType(data) {
  return defHttp.post({ url: Api.Prefix + '/Update', data });
}

//删除
export function deleteWorkshopType(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteWorkshopType(data) {
  return defHttp.post({ url: Api.Prefix + '/Delete', data });
}
