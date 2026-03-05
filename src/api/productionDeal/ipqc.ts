import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/ipqcapply',
}

// 查询列表
export function getIpqcapply(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增
export function addIpqcapply(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 修改
export function editIpqcapply(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 历史数据
export function getDraftlist(data) {
  return defHttp.get({ url: Api.Prefix + `/getdraftlist`, data });
}

// 根据单据号获取预打印信息.
export function getProcesspreprintdetail(data) {
  return defHttp.get({ url: Api.Prefix + `/getprocesspreprintdetail`, data });
}

// 数据详情.
export function getIpqcapplyById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

// 数据详情.
export function getlistbycheckprojectname(checkProjectName) {
  return defHttp.get({ url: '/api/Production/badcode/getlistbycheckprojectname?checkProjectName=' + `${checkProjectName}` });
}
