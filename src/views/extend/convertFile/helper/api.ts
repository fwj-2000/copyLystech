import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/demo/ConvertFileTask',
}

// 获取列表
export function getList(data) {
  return defHttp.post({ url: Api.Prefix + `/List`, data });
}
// 获取
export function getInfo(id) {
  return defHttp.get({ url: Api.Prefix + `/` + id });
}
// 新建
export function create(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
// 修改
export function update(data) {
  return defHttp.put({ url: Api.Prefix + `/` + data.id, data });
}
// 删除
export function del(id) {
  return defHttp.delete({ url: Api.Prefix + `/` + id });
}
// 详情
export function getDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/Detail/` + id });
}
