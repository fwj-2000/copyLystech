/*
 * @Author: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @Date: 2024-07-15 08:41:30
 * @LastEditors: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @LastEditTime: 2024-08-05 14:10:57
 * @FilePath: \lydc.server.web\src\api\engineering\drawingReview.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}
enum BaseDataApi {
  Prefix = '/api/BaseData',
}
// 工程报价未审核列表
// /api/Information/quotation/tomake
export function getQuotationTomakeList(params) {
  return defHttp.get({ url: Api.Prefix + `/quotation/tomake`, params });
}
// 工程报价已审核列表
// /api/Information/quotation/made
export function getQuotationMadeList(params) {
  return defHttp.get({ url: Api.Prefix + `/quotation`, params });
}
// 工程报价撤回
// /api/Information/quotation/made
export function withdrawQuotation(params) {
  return defHttp.post({ url: Api.Prefix + `/quotation/Withdraw`, params });
}

// 工程报价驳回
// /api/Information/quotation/reject
export function rejectQuotation(params) {
  return defHttp.post({ url: Api.Prefix + `/quotation/reject`, params });
}

// 报价提交
// /api/Information/quotation/commit
export function commitQuotation(params) {
  return defHttp.post({ url: Api.Prefix + `/quotation/commit`, params });
}

// 工程报价详情
// /api/Information/quotation/{id}
export function getQuotationDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/${data.id}` });
}
// 获取工序编码列表
// /api/BaseData/process/alllist
export function getProcessAllList(data) {
  return defHttp.get({ url: BaseDataApi.Prefix + `/process/alllist`, data });
}
// 获取刀数
// BaseData/ProcessPara/List
export function getProcessParaList(data) {
  return defHttp.get({ url: BaseDataApi.Prefix + `/ProcessPara/Search`, data });
}
// 获取设备工费率
// /api/basedata/laborrate/list
export function getLaborRateList(data) {
  return defHttp.get({ url: BaseDataApi.Prefix + `/laborrate/list`, data });
}
// 获取设备材料价格
// /api/Information/purchasequotation
export function getMaterialPriceList(data) {
  return defHttp.get({ url: Api.Prefix + `/purchasequotation/list`, data });
}
// 新增成品BOM报价数据
// /api/Information/quotation/finishedparts
export function addQuotationFinishedParts(data) {
  return defHttp.post({ url: Api.Prefix + `/quotation/finishedparts`, data });
}

export function bulkDeleteQuotation(data) {
  return defHttp.post({ url: Api.Prefix + `/quotation/bulk/delete`, data });
}
// 获取BOM结构
// /api/Information/quotation/{id}/BOM
export function getQuotationBOM(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/${data.bomId}/BOM` });
}

// 新增半成品BOM报价数据.
// /api/Information/quotation/halffinishedparts
export function addQuotationHalfFinishedParts(data) {
  return defHttp.post({ url: Api.Prefix + `/quotation/halffinishedparts`, data });
}

// BOM明细
// /api/Information/quotation/{id}/BOMDetail
export function getQuotationBOMDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/${data.id}/BOMDetail` });
}

// 修改成品BOM报价数据.
// /api/Information/quotation/{id}/finishedparts
export function updateQuotationFinishedParts(data) {
  return defHttp.put({ url: Api.Prefix + `/quotation/${data.id}/finishedparts`, data });
}
// 修改半成品BOM报价数据.
// /api/Information/quotation/{id}/halffinishedparts
export function updateQuotationHalfFinishedParts(data) {
  return defHttp.put({ url: Api.Prefix + `/quotation/${data.id}/halffinishedparts`, data });
}

//转办.
// /api/Information/quotation/transfer
export function transferQuotation(data) {
  return defHttp.post({ url: Api.Prefix + `/quotation/transfer`, data });
}

// 转办价格确认
// /api/Information/Quotation/Transfer/Confirm
export function confirmTransferQuotation(data) {
  return defHttp.post({ url: Api.Prefix + `/Quotation/Transfer/Confirm`, data });
}
//导出Excel-未制作.
// /api/Information/quotation/exportexcel/tomake
export function exportQuotationTomake(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/exportexcel/tomake`, data });
}
//导出Excel-已制作.
// /api/Information/quotation/exportexcel/made
export function exportQuotationMade(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/exportexcel`, data });
}
// 价格确认
// /api/Information/quotation/{id}/confirm
export function confirmQuotation(data) {
  return defHttp.put({ url: Api.Prefix + `/quotation/${data.id}/confirm`, data });
}

//保存GP价格
// /api/Information/quotation/{id}/savegp
export function saveGpPrice(data) {
  return defHttp.put({ url: Api.Prefix + `/quotation/${data.id}/savegp`, data });
}
// 审核
// /api/Information/quotation/review
export function reviewQuotation(data) {
  return defHttp.put({ url: Api.Prefix + `/quotation/review`, data });
}

// 引用历史记录
// /api/Information/pcc/CreateFrom
export function postHistoryRecord(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/CreateFrom`, data });
}
// 创建报价历史记录
// /api/Information/quotation/CreateFrom
export function postHistoryQuotation(data) {
  return defHttp.post({ url: Api.Prefix + `/quotation/CreateFrom`, data });
}

/**
 * 获取半成品工程图纸
 * @param id
 */
export function getHalfFinishedPartFile(id: string) {
  return defHttp.get({ url: Api.Prefix + `/Quotation/GetHalfFinishedPartFile/${id}` });
}
