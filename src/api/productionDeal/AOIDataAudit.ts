import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/bkkaoicustomerapprover',
}

// 分页列表
export function bkkaoicustomerapprover(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 同意
export function approver(data) {
  return defHttp.post({ url: Api.Prefix + '/approver', data });
}

// 驳回
export function flowreject(data) {
  return defHttp.post({ url: Api.Prefix + '/flowreject', data });
}

// 撤回
export function flowwithdraw(data) {
  return defHttp.post({ url: Api.Prefix + `/${data.id}/flowwithdraw`, data });
}

// 转办
export function flowtransfer(data) {
  return defHttp.post({ url: Api.Prefix + `/${data.id}/flowtransfer`, data });
}

// 获取下一个审批人
export function getAOICustomerReportMemberConfig(data) {
  return defHttp.get({ url: '/api/basedata/approvermaintenance/GetAOICustomerReportMemberConfig', data });
}

// 文件下载
export function downloadfile(data) {
  return defHttp.get({ url: Api.Prefix + '/downloadfile/' + data });
}
