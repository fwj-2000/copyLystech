import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/warehouse',
}

// 查询列表
export function getWarehouse(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 领导审批列表.
export function getAuditpage(data) {
  return defHttp.get({ url: Api.Prefix + '/auditpage', data });
}

// 仓库审批列表..
export function getWarehouseauditpage(data) {
  return defHttp.get({ url: Api.Prefix + '/warehouseauditpage', data });
}

// 领导审批驳回.
export function auditreject(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/auditreject', data });
}

// 领导审批同意.
export function auditagree(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/auditagree', data });
}
// 仓库审批驳回.
export function warehouseauditreject(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/warehouseauditreject', data });
}

// 仓库审批同意.
export function warehouseauditagree(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/warehouseauditagree', data });
}

//新增/修改
export function addWarehouse(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//获取暂存数据
export function getdraftlist(data) {
  return defHttp.get({ url: Api.Prefix + '/getdraftlist', data });
}

// 批量撤回.
export function bulkWithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/withdraw', data });
}

// 批量停止.
export function bulkStop(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/stop', data });
}

// 批量删除.
export function bulkDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

// 获取仓库代码..
export function getListbyfactory(data) {
  return defHttp.get({ url: '/api/basedata/shippingspace/getlistbyfactory', data });
}

// 出库列表
export function getoutboundpage(data) {
  return defHttp.get({ url: Api.Prefix + '/outboundpage', data });
}

// 打印出货单
export function printoutbound(data) {
  return defHttp.post({ url: Api.Prefix + '/outbound', data });
}

// 获取出库单详情
export function getOutbounddetail(data) {
  return defHttp.get({ url: Api.Prefix + `/getoutbounddetail`, data });
}
