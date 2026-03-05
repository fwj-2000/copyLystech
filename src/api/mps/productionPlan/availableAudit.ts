import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/mps/ReAllocate',
}

//查询列表
export function getAsignList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 导入模板下载
export function exportAsign(data) {
  return defHttp.get({ url: Api.Prefix + `/Export`, data });
}

// 审核
export function auditAsign(data) {
  return defHttp.post({ url: Api.Prefix + `/Approve`, data });
}

// 驳回
export function refuseAsign(data) {
  return defHttp.post({ url: Api.Prefix + '/Refuse', data });
}
