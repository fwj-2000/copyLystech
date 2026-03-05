import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/lineType',
}
//查询列表
export function getLineType(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addLineType(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateLineType(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteLineType(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukLineType(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
