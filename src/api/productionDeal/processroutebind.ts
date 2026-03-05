import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/processroutebind',
}

// 分页列表
export function getProcessroutebindList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 详情
export function getProcessroutebindDetails(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

// 新增
export function addProcessroutebind(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 修改
export function updateProcessroutebind(id, data) {
  return defHttp.put({ url: Api.Prefix + `/` + id, data });
}

// 删除
export function deleteProcessroutebind(id) {
  return defHttp.delete({ url: Api.Prefix + `/` + id });
}

// 获取工艺路线图数据.
export function getProcessroutemaplist(data) {
  return defHttp.get({ url: Api.Prefix + `/getprocessroutemaplist`, data });
}

// 批量删除
export function muliteDeleteProcessroutebind(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/delete`, data });
}

// 冻结
export function thawProcessroutebind(data) {
  return defHttp.post({ url: Api.Prefix + `/thaw`, data });
}

// 解冻
export function frozenProcessroutebind(data) {
  return defHttp.post({ url: Api.Prefix + `/frozen`, data });
}

// 终止
export function stopProcessroutebind(data) {
  return defHttp.post({ url: Api.Prefix + `/stop`, data });
}

// 根据ID获取工艺路线图.
export function getProcessroutemapbyid(id) {
  return defHttp.get({ url: Api.Prefix + `/getprocessroutemapbyid?id=${id}` });
}

export function saveNgroute(data) {
  return defHttp.post({ url: Api.Prefix + `/savengroute`, data });
}

export function isexistfrozenroute() {
  return defHttp.get({ url: Api.Prefix + `/isexistfrozenroute` });
}
