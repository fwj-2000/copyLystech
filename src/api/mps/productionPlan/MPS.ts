import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/mps/masterdemandplan',
  MaterialPrefix = '/api/mps/materialdemandplan',
  PRPrefix = '/api/mps/prorder',
  POPrefix = '/api/mps/poOrder',
  FeedPrefix = '/api/mps/incomingmatplan',
}

// 主需求计划-查询列表
export function getMasterdemandplanPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 主需求计划-根据id集合获取详情
export function getMasterdemandplanDetail(data) {
  return defHttp.post({ url: Api.Prefix + '/detail', data });
}

// 主需求计划-修改
export function updateplan(data) {
  return defHttp.post({ url: Api.Prefix + '/updateplan', data });
}

// 主需求计划-导出Excel.
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + '/export', data });
}

// 主需求计划-获取排产建议数详情
export function getWeeksppsDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/detail', data });
}

// 主需求计划-计算首次建议排产数.
export function calcweekspps(data) {
  return defHttp.post({ url: Api.Prefix + '/calcweekspps', data });
}

// 主需求计划-修改排产建议数.
export function updateweekspps(data) {
  return defHttp.post({ url: Api.Prefix + '/updateweekspps', data });
}

// 主需求计划-获取修改排产周数记录.
export function getupdateweekspps(data) {
  return defHttp.get({ url: Api.Prefix + '/getupdateweekspps', data });
}

// 主需求计划-通知客服
export function sendmessage(data) {
  return defHttp.post({ url: Api.Prefix + '/SendMessage', data });
}

// 主需求计划-合并料号说明
export function getMergeMaterialRecord(data) {
  return defHttp.get({ url: Api.Prefix + '/getmergematerialrecord', data });
}

// 主需求计划-更新数据
export function updateData(data) {
  return defHttp.post({ url: Api.Prefix + '/updatedata', data });
}

// 主需求计划-重新下推
export function againPushMrp(data) {
  return defHttp.post({ url: Api.Prefix + '/againPushMrp', data });
}

// 主需求-获取是否下推物料需求
export function getTopushmrp(data) {
  return defHttp.get({ url: Api.Prefix + '/topushmrp', data });
}

// 主需求计划-获取下推主生产数据
export function pushmpslist(data) {
  return defHttp.post({ url: Api.Prefix + '/pushmpslist', data });
}

// 主需求计划-下推主生产
export function pushmps(data) {
  return defHttp.post({ url: Api.Prefix + '/pushmps', data });
}

// PR单列表
export function PRprorderList(data) {
  return defHttp.get({ url: Api.PRPrefix, data });
}

// PR单列表-新增
export function addPRprorder(data) {
  return defHttp.post({ url: Api.PRPrefix, data });
}

// PR单列表-修改
export function updatePRprorder(data) {
  return defHttp.put({ url: Api.PRPrefix, data });
}

// PR单列表-获取节点履历记录
export function getnodelist(data) {
  return defHttp.get({ url: Api.PRPrefix + '/getnodelist', data });
}

// PR单列表-导出
export function prorderExport(data) {
  return defHttp.get({ url: Api.PRPrefix + '/export', data });
}

// PR单-根据id获取详情
export function getPRprorderDetail(id) {
  return defHttp.get({ url: Api.PRPrefix + '/' + id });
}

// 获取详情-PO单-是否独占-计划日期
export function getDetailPR(data) {
  return defHttp.post({ url: Api.PRPrefix + '/detail', data });
}

// PR单-释放独占物料
export function updateonlymaterialPR(data) {
  return defHttp.post({ url: Api.PRPrefix + '/updateonlymaterial', data });
}

// PR单-修改计划使用日期
export function updatellanusedatePR(data) {
  return defHttp.post({ url: Api.PRPrefix + '/updatellanusedate', data });
}

// PR单-批量删除
export function prBulkdelete(data) {
  return defHttp.post({ url: Api.PRPrefix + '/bulkdelete', data });
}

//  PR单审核-分页列表.
export function getAuditpage(data) {
  return defHttp.get({ url: Api.PRPrefix + '/auditpage', data });
}

// PR单审核-导出审核列表.
export function exportaudit(data) {
  return defHttp.get({ url: Api.PRPrefix + '/exportaudit', data });
}

// PR单审核-同意
export function prAgree(data) {
  return defHttp.post({ url: Api.PRPrefix + '/agree', data });
}

// PR单审核-驳回
export function prReject(data) {
  return defHttp.post({ url: Api.PRPrefix + '/reject', data });
}

// PR单审核-撤回
export function prWithdraw(data) {
  return defHttp.post({ url: Api.PRPrefix + '/withdraw', data });
}

// PR单审核-终止
export function prStop(data) {
  return defHttp.post({ url: Api.PRPrefix + '/stop', data });
}

// PO单列表
export function poOrderList(data) {
  return defHttp.get({ url: Api.POPrefix, data });
}

// PO单导出
export function poOrderExport(data) {
  return defHttp.get({ url: Api.POPrefix + '/export', data });
}

// 获取详情-PO单-是否独占-计划日期
export function getDetailPO(data) {
  return defHttp.post({ url: Api.POPrefix + '/detail', data });
}

// PO单-释放独占物料
export function updateOnlymaterialPO(data) {
  return defHttp.post({ url: Api.POPrefix + '/updateonlymaterial', data });
}

// PO单-修改计划使用日期
export function updatellanusedatePO(data) {
  return defHttp.post({ url: Api.POPrefix + '/updatellanusedate', data });
}

// 获取PO单明细数据
export function getPoOrderDeteil(id) {
  return defHttp.get({ url: Api.POPrefix + `/${id}` });
}

// 释放PO单独占物料
export function updateOnlyMaterial(data) {
  return defHttp.post({ url: Api.POPrefix + '/updateonlymaterial', data });
}

// PO单列表同步数据
export function poSyncsap(data) {
  return defHttp.post({ url: Api.POPrefix + '/syncsap', data });
}

// 根据PR单号获取PO单详情
export function getPoOrderDeteilByPROrderNo(prOrderNo) {
  return defHttp.get({ url: Api.POPrefix + '/podetail' + `?prOrderNo=${prOrderNo}` });
}

// 进料计划-list
export function getFeedPlanList(data) {
  return defHttp.get({ url: Api.FeedPrefix + '/popage', data });
}

// 进料计划-PO单列表
export function getAvailablePOList(data) {
  return defHttp.get({ url: Api.FeedPrefix + '/poselect', data });
}

// 进料计划-下推进料详情
export function getPODetailsByPoOrderNos(data) {
  return defHttp.post({ url: Api.FeedPrefix + '/GetPODetailsByPoOrderNos', data });
}

// 进料计划-下推进料表
export function poFeedList(data) {
  return defHttp.post({ url: Api.FeedPrefix, data });
}

// 进料计划-导出
export function poFeedPlanExport(data) {
  return defHttp.get({ url: Api.FeedPrefix + '/POExport', data });
}

// 进料表-列表
export function getFeedList(data) {
  return defHttp.get({ url: Api.FeedPrefix, data });
}

// 进料计划-PO详情列表
export function getPODetail(data) {
  return defHttp.get({ url: Api.FeedPrefix + `/PODetail?id=${data}` });
}

// 进料表-录入供应商交期详情
export function getSupplierDetailByInMaterialNos(data) {
  return defHttp.post({ url: Api.FeedPrefix + '/SupplierDetailByInMaterialNos', data });
}

// 进料表-录入供应商交期提交
export function poSupplierDelivery(data) {
  return defHttp.post({ url: Api.FeedPrefix + '/supplierDelivery', data });
}

// 进料表-更新要求供应商交期详情
export function getShouldSupplierDetailByInMaterialNos(updateFlag, data) {
  return defHttp.post({ url: Api.FeedPrefix + '/SupplierDetailByInMaterialNos' + `?updateFlag=${updateFlag}`, data });
}

// 进料表-更新要求供应商交期提交
export function poUpdateSupplierBatch(data) {
  return defHttp.post({ url: Api.FeedPrefix + '/UpdateSupplierBatch', data });
}

// 进料表-终止进料
export function poAbortBatch(data) {
  return defHttp.post({ url: Api.FeedPrefix + '/AbortBatch', data });
}

// 进料表-批量同意
export function poApprovedbatch(flag, data) {
  return defHttp.post({ url: Api.FeedPrefix + '/approvedbatch' + `?flag=${flag}`, data });
}

// 进料表-批量驳回
export function poRejectbatch(flag, remark, data) {
  return defHttp.post({ url: Api.FeedPrefix + '/approvedbatch' + `?flag=${flag}&remark=${remark}`, data });
}

// 进料表-导出
export function feedListExport(data) {
  return defHttp.get({ url: Api.FeedPrefix + '/Export', data });
}

// 进料表-供应商变更记录
export function getSupplierDeliveryList(data) {
  return defHttp.get({ url: Api.FeedPrefix + `/SupplierDeliveryList?inMaterialNo=${data}` });
}

// 进料表-邮件详情
export function getEmailDetail(data) {
  return defHttp.post({ url: Api.FeedPrefix + '/EmailDetail', data });
}

// 进料表-发邮件
export function sendmail(data) {
  return defHttp.put({ url: Api.FeedPrefix + '/SendEmail', data });
}

// 进料表-po单详情记录
export function getImpPoDetail(data) {
  return defHttp.get({ url: Api.FeedPrefix + `/ImpPoDetail?inMaterialNo=${data}` });
}
