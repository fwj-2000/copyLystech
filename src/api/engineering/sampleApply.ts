import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/sampledeliveryreply',
  labelPrintPrefix = '/api/Information/samplelabelprint',
}

// 查询列表
export function getList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 导出未处理exce
export function exportunhandle(data) {
  return defHttp.get({
    url: Api.Prefix + '/exportunhandle',
    data,
  });
}

// 导出已处理exce
export function exporthandled(data) {
  return defHttp.get({
    url: Api.Prefix + '/exporthandled',
    data,
  });
}

// 已处理分页列表.
export function handledpage(data) {
  return defHttp.get({
    url: Api.Prefix + '/handledpage',
    data,
  });
}

// 获取节点记录数据.
export function getNodelist(data) {
  return defHttp.get({
    url: Api.Prefix + '/getnodelist',
    data,
  });
}

// 批量转办
export function bulkTransfer(data) {
  return defHttp.post({
    url: Api.Prefix + '/bulk/transfer',
    data,
  });
}

// 批量撤回
export function bulkWithdraw(data) {
  return defHttp.post({
    url: Api.Prefix + '/bulk/withdraw',
    data,
  });
}

// 交期回复
export function deliveryDateResponse(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * @description 根据id获取详情
 */
export function getDeliveryDateDetailById(id: string) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

/**
 * 批量驳回
 * @param data
 */
export function bulkReject(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/reject', data });
}

// ---------------------标签打印接口--------------------

// 未处理分页列表.
export function getSamplelabelprint(data) {
  return defHttp.get({ url: Api.labelPrintPrefix, data });
}

// 已处理分页列表.
export function getSamplelabelprintHandledpage(data) {
  return defHttp.get({ url: Api.labelPrintPrefix + '/handledpage', data });
}

// 新增.
export function addSamplelabelprint(data) {
  return defHttp.post({ url: Api.labelPrintPrefix, data });
}

/**
 * @description 用于已打印更新需求数量、材料两个字段
 * @param data 更新数据
 */
export function updateSamplelabelprint(data: any) {
  return defHttp.post({ url: Api.labelPrintPrefix + '/Update', data });
}

// 导出未处理
export function exportUnhandleLabelPrint(data) {
  return defHttp.get({ url: Api.labelPrintPrefix + '/exportunhandle', data });
}

// 导出已处理
export function exportHandleLabelPrint(data) {
  return defHttp.get({ url: Api.labelPrintPrefix + '/exporthandled', data });
}

// 获取节点记录数据..
export function getNodelistLabelPrint(data) {
  return defHttp.post({ url: Api.labelPrintPrefix + 'getnodelist', data });
}

// 批量转办
export function bulkTransferLabelPrint(data) {
  return defHttp.post({
    url: Api.labelPrintPrefix + '/bulk/transfer',
    data,
  });
}

// 批量撤回
export function bulkWithdrawLabelPrint(data) {
  return defHttp.post({
    url: Api.labelPrintPrefix + '/bulk/withdraw',
    data,
  });
}
