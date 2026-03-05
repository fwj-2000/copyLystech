import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
  baseDataPrefix = '/api/BaseData',
  coreCommonPrefix = '/api/CoreCommon',
}
// ECR分页列表查询
// /api/Information/ecr
export function getEcrPageList(data) {
  return defHttp.get({ url: Api.Prefix + '/ecr', data });
}

// ECR新增
// /api/Information/ecr
export function addEcr(data) {
  return defHttp.post({ url: Api.Prefix + '/ecr', data });
}
// ECR详情
// /api/Information/ecr/{id}
export function getEcrDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/ecr/${data.id}` });
}
// 修改ECR
// /Information/ecr/{id}
export function updateEcr(data) {
  return defHttp.put({ url: Api.Prefix + `/ecr/${data.id}`, data });
}

// 撤回ECR
// /Information/ecr/withdraw
export function withdrawEcr(data) {
  return defHttp.post({ url: Api.Prefix + `/ecr/withdraw`, data });
}
// 终止ECR
// /Information/ecr/stop
export function stopEcr(data) {
  return defHttp.post({ url: Api.Prefix + `/ecr/stop`, data });
}
// 导出ECR
// /api/Information/ecr/exportexcel
export function exportEcr(data) {
  return defHttp.get({ url: Api.Prefix + '/ecr/exportexcel', data });
}
// 节点详情
// /api/CoreCommon/flow/{id}/List
export function getNodeDetail(data) {
  return defHttp.get({ url: Api.coreCommonPrefix + `/flow/${data.id}/List`, data });
}
// /Information/ecr/{id}
export function getEcrDetailById(data) {
  return defHttp.get({ url: Api.Prefix + `/ecr/${data.id}` });
}
// 批量删除
// /Information/ecr/bulk/delete
export function deleteEcr(data) {
  return defHttp.post({ url: Api.Prefix + `/ecr/bulk/delete`, data });
}
// 批量删除
// /Information/ecr/bulk/delete
export function deleteEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/bulk/delete`, data });
}
// 同意
// /Information/ecr/Agree
export function agreeEcr(data) {
  return defHttp.post({ url: Api.Prefix + `/ecr/Agree`, data });
}
// /Information/ecr/reject
export function rejectEcr(data) {
  return defHttp.post({ url: Api.Prefix + `/ecr/reject`, data });
}
// 不同意
// /Information/ecr/Disagree
export function disagreeEcr(data) {
  return defHttp.post({ url: Api.Prefix + `/ecr/Disagree`, data });
}

// ECN列表
// /Information/ecn
export function getEcnPageList(data) {
  return defHttp.get({ url: Api.Prefix + `/ecn`, data });
}
// ECN报表
// /Information/ecn/report
export function getEcnReport(data) {
  return defHttp.get({ url: Api.Prefix + `/ecn/report`, data });
}
// 主记录详情
// /Information/ecr/MasterDetail/{id}
export function getMasterDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/ecr/MasterDetail/${data.id}` });
}
// ECN 新增
// /Information/ecn
export function addEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn`, data });
}
// ECN 详情
// /Information/ecn/{id}
export function getEcnDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/ecn/${data.id}` });
}

// ECN 撤回
// /Information/ecn/withdraw
export function withdrawEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/withdraw`, data });
}
// ECN 转办
// /Information/ecn/Transfer
export function turnEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/Transfer`, data });
}

// ECN 转办V2
// /Information/ecn/Transfer
export function turnEcnV2(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/TransferV2`, data });
}
// ECN 提交
// /Information/ecn/commit
export function commitEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/commit`, data });
}
// ECN 驳回
// /Information/ecn/reject
export function rejectEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/reject`, data });
}
// ECN修改
// /Information/ecn/{id}
export function updateEcn(data) {
  return defHttp.put({ url: Api.Prefix + `/ecn/${data.id}`, data });
}
// 终止ECN
// /Information/ecn/stop
export function stopEcn(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/stop`, data });
}
// ECN物料处理
// /Information/ecn/{id}/materialhandle
export function getMaterialHandle(data) {
  return defHttp.put({ url: Api.Prefix + `/ecn/${data.id}/materialhandle`, data });
}
// ECN 物料处理意见
// /Information/ecn/{id}/materialhandlecomments
export function getMaterialHandleComments(data) {
  return defHttp.put({ url: Api.Prefix + `/ecn/${data.id}/materialhandlecomments`, data });
}

// ECN 部门会签
// /Information/ecn/{id}/countersign
export function getCounterSign(data) {
  return defHttp.put({ url: Api.Prefix + `/ecn/${data.id}/countersign`, data });
}

// ECN 最终处理建议
// /Information/ecn/{id}/finalhandle
export function getFinalHandle(data) {
  return defHttp.put({ url: Api.Prefix + `/ecn/${data.id}/finalhandle`, data });
}

// 各部门归档
// /api/Information/ecn/executeconfirm
export function executeConfirm(data) {
  return defHttp.post({ url: Api.Prefix + `/ecn/executeconfirm`, data });
}

// 导出ecn Excel.
// /Information/ecn/exportexcel
export function exportEcn(data) {
  return defHttp.get({ url: Api.Prefix + `/ecn/exportexcel`, data });
}

// 询价
// Information/PriceInquiry
export function getPriceInquiry(data) {
  return defHttp.get({ url: Api.Prefix + `/PriceInquiry`, data });
}
// 转办
export function getTransferuserAPI(data) {
  return defHttp.post({ url: Api.Prefix + `/PriceInquiry/bulk/bulktransfer`, data });
}
// 图纸预览
// /api/Information/partnumberapply/{id}/drawingshistory
// export function previewPartnumberapplyDrawingshistory(data) {
//   return defHttp.get({ url: Api.Prefix + `/partnumberapply/{id}/drawingshistory`, data });
// }

// 驳回
// /api/Information/PriceInquiry/Reject
export function rejectPriceInquiry(data) {
  return defHttp.post({ url: Api.Prefix + `/PriceInquiry/Reject`, data });
}

// 批量已处理
// Information/PriceInquiry/LinkPrices
export function linkPrices(data) {
  return defHttp.post({ url: Api.Prefix + `/PriceInquiry/LinkPrices`, data });
}

// 审核
// /api/Information/purchasequotation/Commit
export function commitPurchasequotation(data) {
  return defHttp.post({ url: Api.Prefix + `/purchasequotation/Commit`, data });
}

// 查询信息
// Information/Material/Search
export function getMaterialBatchSearch(data) {
  return defHttp.post({ url: Api.Prefix + `/Material/Search`, data });
}

export function previewPartnumberapplyDrawingshistory(data) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/${data.id}/drawingshistory`,
  });
}

// 询价标记 /Information/priceinquiry/inquirymark
export function markQuotation(data) {
  return defHttp.post({
    url: Api.Prefix + `/priceinquiry/inquirymark`,
    data,
  });
}

/**
 * 报价需求 - 开始询价
 * @param ids
 * @returns
 */
export function startInquiry(ids: Array<string>) {
  return defHttp.post({
    url: Api.Prefix + `/priceinquiry/StartInquiry`,
    data: ids,
  });
}
