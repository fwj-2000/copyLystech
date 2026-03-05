import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/moldRefundApply',
}

// 分页列表
export function getMoldRefundList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

// 导出Excel
export function exportMoldRefund(params) {
  return defHttp.get({
    url: Api.Prefix + '/ExportExcel',
    params,
  });
}

// 获取流程节点
export function getProcessNodes(params) {
  return defHttp.get({ url: Api.Prefix + '/GetNodeList', params });
}

// 获取详情
export function getMoldRefundDetail(id) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail', data: id });
}

// 新增申请
export function createMoldRefund(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 暂存申请
export function tempSaveMoldRefund(data) {
  return defHttp.put({ url: Api.Prefix + '/TemporaryStorage', data });
}

// 终止申请
export function terminateMoldRefund(ids, remarks) {
  return defHttp.put({
    url: Api.Prefix + '/Termination',
    data: { ids, terminationRemarks: remarks },
  });
}

// 撤回申请
export function withdrawMoldRefund(id) {
  return defHttp.put({ url: Api.Prefix + '/Withdraw', data: [id] });
}

// 打印列表 /Information/moldRefundApply/PrintedPage
export function printMoldRefundList(params) {
  return defHttp.get({ url: Api.Prefix + '/PrintedPage', params });
}

// 打印 /Information/moldRefundApply/Print
export function printMoldRefund(id) {
  return defHttp.put({ url: Api.Prefix + '/Print', data: id });
}

// 打印页面导出 /Information/moldRefundApply/PrintedExportExcel
export function exportPrintMoldRefund(params) {
  return defHttp.get({ url: Api.Prefix + '/PrintedExportExcel', params });
}
