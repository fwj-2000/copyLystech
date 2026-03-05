import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
const { apiUrl } = useGlobSetting();
enum Api {
  Prefix = '/api/Information/moldapply',
  ProductionPrefix = '/api/Production',
  InformationPrefix = '/api/Information',
}

/**
 * 根据内部料号模糊匹配，获取下拉数据.
 * @param data
 * @return
 */
export function getInnermaterialnumberlist(data) {
  return defHttp.get({ url: Api.Prefix + `/getinnermaterialnumberlist`, data });
}

/**
 * 根据内部料号数组，获取料号数据.
 * @param data
 * @return
 */
export function getInnermaterialnumberlistByNumbers(data: Array<string>) {
  return defHttp.post({ url: Api.Prefix + `/GetInnerMaterialNumberListByNumbers`, data: data });
}

/**
 * 获取材质数据.
 * @param data
 * @return
 */
export function getMaterialClassList(data) {
  return defHttp.get({ url: Api.Prefix + `/GetMaterialClassList`, data });
}

/**
 * 获取费用归属下拉数据--返回所有数据.
 * @param data
 * @return
 */
export function getCostcenterlist(data) {
  return defHttp.get({ url: Api.Prefix + `/getcostcenterlist`, data });
}

/**
 * 模具申请分页列表.
 * @param data
 * @return
 */
export function getMoldapply(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

/**
 * 模具申请获取暂存分页列表.
 * @param data
 * @return
 */
export function getDraftlist() {
  return defHttp.get({ url: Api.Prefix + '/getdraftlist' });
}

/**
 * 获取节点记录.
 * @param data
 * @return
 */
export function getNodelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getnodelist', data });
}

/**
 * 数据详情
 * @param data
 * @return
 */
export function getMoldapplyDetail(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

/** 根据子级ids获取详情数据 */
export function getMoldDetailBySubIds(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + '/GetDetail', data: ids });
}

/**
 * 根据子级id或数据对比详情数据
 * @param ids
 * @returns
 */
export function getMoldCompareDetail(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + '/GetDetailCompare', data: ids });
}

/**
 * 表体单条数据详情
 * @param data
 * @return
 */
export function getMoldapplyDetailSingle(id) {
  return defHttp.get({ url: Api.Prefix + '/detail/' + id });
}

/**
 * 新增
 * @param data
 * @param data.list 列表数据
 * @param data.type 此次调用接口是暂存还是提交 0: 暂存 1: 提交
 * @param data.moldNoType 模具新旧类型 0: 新模 1: 旧模
 * @param data.saveType 保存类型（保存界面） 0: 新增 1: 修改
 * @return
 */
export function addMoldapply(data: { list: Array<any>; type: 0 | 1; moldNoType?: '0' | '1'; saveType: 0 | 1 }) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * 模具申请修改
 * @param data
 * @param data.type 修改类型,1-模具图纸 2-基础信息 3-暂停制作 4-重启制作 5-申请终止，可多选
 * @param data.list 列表数据
 * @param data.reason 修改原因
 * @returns
 */
export function applyMoldModify(data: { type: Array<'1' | '2' | '3' | '4' | '5'>; list: Array<any>; reason: string }) {
  return defHttp.post({ url: Api.Prefix + '/ApplyModify', data });
}

/**
 * 批量删除
 * @param data
 * @return
 */
export function bulkDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

/**
 * 批量停止
 * @param data
 * @return
 */
export function bulkStop(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/stop', data });
}

/**
 * 批量撤回
 * @param data
 * @return
 */
export function bulkWithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/withdraw', data });
}

/**
 * 审核分页列表
 * @param data
 * @return
 */
export function getAuditpage(data) {
  return defHttp.get({ url: Api.Prefix + '/auditpage', data });
}

/**
 * 导出SAP模具物料
 * @param data
 * @return
 */
export function exportMoldBySAPTemplate(data) {
  return defHttp.get({ url: Api.Prefix + '/exportMoldBySAPTemplate', data });
}
/**
 * 导出SAP物料号项目号等
 * @param data
 * @return
 */
export function exportMoldNoForSAP(data) {
  return defHttp.get({ url: Api.Prefix + '/exportMoldNoForSAP', data });
}

/**
 * 审核驳回
 * @param data
 * @param data.ids 数据ids
 * @param data.rejectRemark 驳回原因
 * @return
 */
export function bulkAuditreject(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/auditreject', data });
}

/**
 * 审核同意
 * @param data
 * @param data.ids 数据ids
 * @return
 */
export function bulkAuditagree(data: { ids: Array<string> }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/auditagree', data });
}

/**
 * 审核撤回
 * @param data
 * @return
 */
export function bulkAuditwithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/auditwithdraw', data });
}

/**
 * 审核转办
 */
export function auditTransfer(data: { ids: Array<string>; transferRemarks: string; transferUserId: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/auditTransfer', data });
}

/**
 * @description: Upload interface
 */
export function uploadfile(params: any) {
  return defHttp.post({
    url: Api.Prefix + `/uploadfile`,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * 模具采购分页列表.
 * @param data
 * @return
 */
export function getPurchasepage(data) {
  return defHttp.get({ url: Api.Prefix + '/purchasepage', data });
}

/**
 * 根据子项ID集合获取发邮件列表数据.
 * @param data
 * @return
 */
export function getEmaildatalist(data) {
  return defHttp.post({ url: Api.Prefix + '/getemaildatalist', data });
}

/**
 * 模具需求评审分页列表.
 * @param data
 * @return
 */
export function getrequirementReviewpage(data) {
  return defHttp.get({ url: Api.Prefix + '/RequirementReviewPage', data });
}

/**
 * 模具需求评审 - 撤回
 */
export function bulkRequirementReviewPageWithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/requirementWithdraw', data });
}

/**
 * 模具需求评审 - 驳回
 */
export function rejectRequirementReviewPage(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/requirementReviewReject', data });
}

/**
 * 模具需求评审 - 转办
 * @param data
 * @param data.ids 数据ids
 * @param data.transferRemarks 转办备注
 * @param data.transferUserId 转办用户ID
 * @param data.fromType 来源类型 1：模具需求评审；2：模具需求分析；3：回复交期确认页面
 * @returns
 */
export function transferRequirementReviewPage(data: { ids: Array<string>; transferRemarks: string; transferUserId: string; fromType: 1 | 2 | 3 }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/requirementReviewTransfer', data });
}

/**
 * PMC模具需求评审分页列表.
 * @param data
 * @return
 */
export function getPmcReviewPage(data) {
  return defHttp.get({ url: Api.Prefix + '/PmcReviewPage', data });
}

/**
 * PMC模具需求评审分析 - 撤回
 */
export function bulkPmcReviewPageWithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/pmcReviewWithdraw', data });
}

/**
 * PMC模具需求评审分析 - 驳回
 */
export function bulkPmcReviewPageReject(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/pmcReviewReject', data });
}

/**
 * PMC模具需求评审分析 - 导出
 */
export function exportPmcReviewPage(data) {
  return defHttp.get({ url: Api.Prefix + '/ExportRequirementAnalysis', data });
}

/**
 * 设计编程分页列表.
 * @param data
 * @return
 */
export function getProgramPage(data) {
  return defHttp.get({ url: Api.Prefix + '/ProgramPage', data });
}

/**
 * 设计工程、编程工程 - 审核
 * @param data
 * @param data.ids 数据ids
 * @param data.auditType 审核类型 0-设计工程，1-编程工程
 */
export function bulkProgramAudit(data: { ids: Array<string>; auditType: 0 | 1 }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/ProgramAudit', data });
}

/**
 * 设计工程 - 设置审核人
 * @param data
 * @param data.id 数据id
 * @param data.designatedAuditUserId 设置的审核人ID
 */
export function designatedSetAuditUser(data: { id: string; designatedAuditUserId: string }) {
  return defHttp.post({ url: Api.Prefix + '/DesignatedSetAuditUser', data });
}

/**
 * 根据子项ID集合获取评审列表数据.
 * @param data
 * @return
 */
export function getReviewDataList(data) {
  return defHttp.post({ url: Api.Prefix + '/GetReviewDataList', data });
}

// 比价
export function compareprices(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/compareprices', data });
}

// 获取PO号
export function updatePoNumber(data) {
  return defHttp.post({ url: Api.Prefix + '/updatePoNumber', data });
}

// 采购
export function purchase(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/purchase', data });
}

/**
 * 重新发送邮件
 * @param data
 * @returns
 */
export function resendPurchaseEmail(data: any) {
  return defHttp.post({ url: Api.Prefix + '/purchaseSendEmail', data });
}

/**
 * 采购修改确认，确认是否可以进行确认修改
 * @param ids 数据ids
 * @returns
 */
export function purchaseCheckModifyConfirm(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + '/CheckModifyConfirm', data: ids });
}
/**
 * 采购修改同意
 * @param data
 * @param data.ids 数据ids
 * @param data.moldPhysicalStatus 模具物理状态 0：无实物；1：有实物
 * @returns
 */
export function purchaseModifyAgree(data: { ids: Array<string>; moldPhysicalStatus: '0' | '1' }) {
  return defHttp.post({ url: Api.Prefix + '/purchase/modifyAgree', data });
}

/**
 * 采购修改不同意
 * @param data
 * @param data.ids 数据ids
 * @param data.rejectRemark 拒绝原因
 * @returns
 */
export function purchaseModifyDisagree(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + '/purchase/modifyDisagree', data });
}

/**
 * 转办
 */
export function purchaseTransfer(data: { ids: Array<string>; transferRemarks: string; transferUserId: string }) {
  return defHttp.post({ url: Api.Prefix + '/purchase/transfer', data });
}

// 暂存
export function temporarySave(data) {
  return defHttp.put({ url: Api.Prefix + '/bulk/TemporarySave', data });
}
// 提交
export function reviewApply(data) {
  return defHttp.put({ url: Api.Prefix + '/bulk/ReviewApply', data });
}
// 更新报价
export function saveQuotaion(data) {
  return defHttp.put({ url: Api.Prefix + '/bulk/SaveQuotation', data });
}
// 回复交期
export function replydelivery(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/replydelivery', data });
}

// 采购撤回
export function purchasewithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/purchasewithdraw', data });
}

// 采购驳回
export function purchasereject(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/purchasereject', data });
}

// 评审驳回
export function reviewReject(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/ReviewReject', data });
}

//维护工单
export function relateWorkOrder(data) {
  return defHttp.put({ url: Api.Prefix + '/relateWorkOrder', data });
}

//启用工单
export function enableWorkOrder(id) {
  return defHttp.put({ url: Api.Prefix + `/enableWorkOrder/${id}` });
}

// 上传工程图纸
export function uploadProjectDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/${id}/Upload/Engineeringdrawings`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 删除图纸
// /api/Information/partnumberapply/Delete/Drawings/{id}
export function deleteDrawings(id) {
  return defHttp.delete({
    url: Api.Prefix + `/Delete/Drawings/${id}`,
  });
}
// 删除code
// /api/Information/partnumberapply/Delete/Drawings/{id}
export function deleteCode(id) {
  return defHttp.delete({
    url: Api.Prefix + `/Delete/Code/${id}`,
  });
}
// 删除process
// /api/Information/partnumberapply/Delete/Drawings/{id}
export function deleteProcess(id) {
  return defHttp.delete({
    url: Api.Prefix + `/Delete/Process/${id}`,
  });
}

// 上传程序代码
export function uploadProgramCode(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/${id}/Upload/ProgramCode`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 上传程序工艺
export function uploadProgramProcess(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/${id}/Upload/ProgramProcess`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

//申请导出Excel
export function exportmoldapply(data) {
  return defHttp.get({ url: Api.Prefix + `/exportmoldapply`, data });
}

//审核导出Excel
export function exportmoldaudit(data) {
  return defHttp.get({ url: Api.Prefix + `/exportmoldaudit`, data });
}

//采购导出Excel
export function exportmoldpurchase(data) {
  return defHttp.get({ url: Api.Prefix + `/exportmoldpurchase`, data });
}

//需求评审导出Excel
export function exportRequirementReview(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportRequirementReview`, data });
}

//校验模具编号是否存在
export function checkmoldno(data) {
  return defHttp.post({ url: Api.Prefix + `/checkmoldno`, data });
}

// 根据子项ID集合获取交期回复列表数据
export function getReplydeliverylist(data) {
  return defHttp.post({ url: Api.Prefix + `/getreplydeliverylist`, data });
}

// 获取供应商下拉数据.
export function getSupplierlist(data) {
  return defHttp.get({ url: Api.Prefix + `/getsupplierlist`, data });
}

// 获取模具用途.
export function getMoldpirposelist(data) {
  return defHttp.get({ url: Api.Prefix + `/getmoldpirposelist`, data });
}

// 交期确认分页列表.
export function getDeliveryconfirmpaget(data) {
  return defHttp.get({ url: Api.Prefix + `/deliveryconfirmpage`, data });
}

// 导出交期确认Excel.
export function exportDeliveryconfirm(data) {
  return defHttp.get({ url: Api.Prefix + `/exportdeliveryconfirm`, data });
}

// 交期确认不同意..
export function bulkDeliveryconfirmdisagree(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/deliveryconfirmdisagree`, data });
}

/**
 * 交期确认 - 驳回
 */
export function bulkDeliveryconfirmReject(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/deliveryConfirmReject`, data });
}

// 交期确认同意.
export function bulkDeliveryconfirmagree(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/deliveryconfirmagree`, data });
}

//交期确认撤回.
export function bulkDeliveryconfirmwithdrawe(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/deliveryconfirmwithdraw`, data });
}

//工程直接新增.
export function moldDirectadd(data) {
  return defHttp.post({ url: Api.Prefix + `/directadd`, data });
}

/**
 * 通过供应商名称批量获取详情
 * @param names
 * @returns
 */
export function getSuppliersByNames(names: Array<string>) {
  return defHttp.post({ url: Api.Prefix + `/GetSuppliersByNames`, data: names });
}

/**
 * 模具审核 - 推送数据至SAP（获取PO单号或者PR单号都用这个接口，后端会判断获取PO单号还是PR单号）
 * @param ids
 */
export function createSAPPR(ids: Array<string>) {
  return defHttp.get({ url: Api.Prefix + `/ResendSAPPRByDetail`, params: { ids: ids.join(',') } });
}

// 文件上传
export function uploadfiles(data) {
  return defHttp.post({ url: '/api/Information/fileinfo/uploadfiles', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

// 维修模-分页
export function getRepairmoldpage(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/repairmold', data });
}

// 维修模-批量撤回
export function repairmoldWithdraw(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/repairmold/bulk/withdraw', data });
}

// 维修模-驳回
export function repairmoldReject(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/repairmold/auditReject', data });
}

// 维修模-批量删除
export function repairmoldDelete(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/repairmold/bulk/delete', data });
}

// 维修模-详情
export function getRepairmoldDetail(id) {
  return defHttp.get({ url: Api.ProductionPrefix + '/repairmold/detail/' + id });
}

// 维修模-新增、修改、暂存
export function repairmold(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/repairmold', data });
}

//维修模-批量导出
export function repairmoldExport(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/repairmold/export', data });
}

// 维修模-审核
export function repairmoldAudit(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/repairmold/audit', data });
}

// 新模-分页
export function getNewmoldpage(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/newmold', data });
}
// 新模- 下发、编辑、新增
export function newmold(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/newmold', data });
}

// 新模 - 详情
export function newmoldDetail(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/newmold/detail/' + data });
}

// 新模-批量导出
export function newmoldExport(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/newmold/export', data });
}

// 新模-批量删除
export function newmoldDelete(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/newmold/bulk/delete', data });
}

// 新模-批量删除
export function newmoldWithdraw(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/newmold/bulk/withdraw', data });
}

// 新模-下发
export function newmoldIssue(id) {
  return defHttp.put({ url: Api.ProductionPrefix + '/newmold/issue/' + id });
}

// BOM分页
export function getMoldbomPage(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldbom', data });
}

// BOM新增、暂存
export function moldbom(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldbom', data });
}
// BOM新增、暂存
export function newMoldbom(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/MoldBom', data });
}

// BOM - 详情
export function moldbomDetail(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldbom/detail', data });
}

// 获取BOM分类数据.
export function getbomlist(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldbom/getbomlist', data });
}

// BOM-批量删除
export function moldbomDelete(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldbom/bulk/delete', data });
}

// BOM-批量导出
export function moldbomExportdetail(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldbom/exportdetail', data });
}

// BOM-导入模板下载.
export function moldbomGetTemplateDownload() {
  return defHttp.get({ url: Api.InformationPrefix + `/moldbom/download/importtemplate` });
}

// BOM-上传excel文件
export function moldbomImportExcel(data) {
  return defHttp.post({
    url: `${Api.InformationPrefix}/moldbom/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// BOM-导入保存.
export function moldbomSaveBatchData(batchCode, data) {
  return defHttp.post({ url: Api.InformationPrefix + `/moldbom/${batchCode}`, data });
}

// 注塑设计工程
export function getDesignpage(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldapply/designpage', data });
}

// 注塑设计工程-新增工单
export function addWorkorder(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/workorder', data });
}

// 注塑设计工程-关联工单
export function relateworkorder(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/partrelateworkorder', data });
}

// 注塑设计工程-制作BOM
export function makebom(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/makebom', data });
}

// 注塑设计工程-上传图纸
export function uploaddraw(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/uploaddraw', data });
}

// 注塑设计工程--终止.
export function designstop(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/designstop', data });
}

// 工艺-分页
export function getProcesspage(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldapply/processpage', data });
}

// 工艺-上传零件加工图纸.
export function uploadpartdraw(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/uploadpartdraw', data });
}

// 工艺-模糊匹配获取工序数据
export function getProcessAllList(data) {
  return defHttp.get({ url: '/api/BaseData/process/alllist', data });
}

// 根据用户所在厂区获取工序数据--返回所有数据.
export function alllistbyfactory(data) {
  return defHttp.get({ url: '/api/BaseData/process/alllistbyfactory', data });
}

// 工艺-绑定新增工艺路线--新增/保存.
export function bindaddroute(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/processroutebind/bindaddroute', data });
}

// 工艺-根据绑定ID获取绑定的工艺路线图以及NG路线.
export function getroutemapbybindid(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/processroutebind/getroutemapbybindid', data });
}

// 工艺-获取绑定新增工艺路线详情.
export function getbindaddroutedetail(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/processroutebind/getbindaddroutedetail', data });
}

// 工艺详情.
export function processdetail(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldapply/processdetail', data });
}

// 工艺-父表下发
export function parentProcessissue(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/processissue/' + data });
}

// 工艺-子表下发
export function childrenProcessissue(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/processissuedetail/' + data });
}

// 工艺-子表批量下发
export function bathprocessissuedetail(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/bathprocessissuedetail', data });
}

// 工艺-获取零件工艺路线列表数据.
export function getpartroutelist(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldprogram/getpartroutelist', data });
}

// 工艺-零件电极绑定工艺路线.
export function partbindroute(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/processroutebind/partbindroute', data });
}

// 工艺-获取电极工艺路线列表数据.
export function getelectroderoutelist(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldprogram/getelectroderoutelist', data });
}

// 工艺--确认加工.
export function confirmprocess(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/confirmprocess', data });
}

// 根据ID集合获取工艺打印数据.
export function getprocessprintlist(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/getprocessprintlist', data });
}

// 设计工程父表下发
export function parentDesignissue(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/designissue/' + data });
}

// 设计工程子表下发
export function childrenDesignissue(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/designissuedetail/' + data });
}

// 维护工单.
export function moldcreatworkorder(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldapply/moldcreatworkorder', data });
}

// 维护委外.
export function updateoutsource(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/updateoutsource', data });
}

// 模具大计划-获取模具已下发列表数据
export function getIssuedlist(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/newmold/issuedlist', data });
}

// 模具大计划-新增/修改
export function moldplan(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldplan', data });
}

// 模具大计划-分页
export function moldplanPage(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/moldplan', data });
}

// 模具大计划-详情
export function moldplanDetail(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/moldplan/detail/' + data });
}

// 模具大计划-批量删除
export function moldplanBulkDelete(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldplan/bulk/delete', data });
}

// 模具大计划-导出
export function moldplanExport(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/moldplan/export', data });
}

// 电极BOM分页
export function getElectrodebomPage(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/electrodebom', data });
}

// 获取电极BOM分类数据.
export function getElectrodebomlist(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/electrodebom/getbomlist', data });
}
// 电极BOM新增、修改
export function electrodebom(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/electrodebom', data });
}

// 电极BOM数据详情
export function electrodebomDetail(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/electrodebom/detail', data });
}

// 导出电极BOM详情.
export function electrodebomExportdetail(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/electrodebom/exportdetail', data });
}

// 电极BOM-上传excel文件
export function electrodebomImportExcel(data) {
  return defHttp.post({
    url: `${Api.ProductionPrefix}/electrodebom/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 电极BOM-导入保存.
export function electrodebomSaveBatchData(batchCode) {
  return defHttp.post({ url: Api.ProductionPrefix + `/electrodebom/${batchCode}` });
}

// BOM-导入模板下载.
export function electrodebomGetTemplateDownload() {
  return defHttp.get({ url: Api.ProductionPrefix + `/electrodebom/download/importtemplate` });
}

// 电极BOM-批量删除
export function electrodebomDelete(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/electrodebom/bulk/delete', data });
}

// 注塑编程工程-分页
export function getMoldprogramPage(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldprogram', data });
}

// 注塑编程工程-维护是否电极
export function updateiselectrode(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldprogram/updateiselectrode', data });
}

// 注塑编程工程-制作BOM.
export function moldprogramMakebom(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldprogram/makebom', data });
}

// 注塑编程工程-维护工单.
export function moldprogramcreatworkorder(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldprogram/moldcreatworkorder', data });
}

// 注塑编程工程-维护委外.
export function moldprogramUpdateoutsource(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldprogram/updateoutsource', data });
}

// 注塑编程工程-根据ID集合获取工艺打印数据.
export function moldprogramGetprintlist(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldprogram/getprintlist', data });
}

// 注塑编程工程-父表下发
export function parentMoldprogramDesignissue(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldprogram/issue/' + data });
}

// 注塑编程工程-子表下发
export function childrenMoldprogramDesignissue(data) {
  return defHttp.put({ url: Api.InformationPrefix + '/moldprogram/issuedetail/' + data });
}
//

// 注塑编程工程-上传程序附件.
export function moldprogramUploaddraw(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldprogram/uploaddraw', data });
}

// 零件加工计划-零件计划分页
export function getMoldpartplange(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/moldpartplan', data });
}

// 零件加工计划-电极计划分页
export function getElectrodepage(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/moldpartplan/electrodepage', data });
}

// 零件加工计划-根据零件关联表ID获取计划详情.
export function getplandetailbyid(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/moldpartplan/getplandetailbyid', data });
}

// 零件加工计划-新增、修改
export function moldpartplan(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan', data });
}

// 零件加工计划-批量删除
export function moldpartplanDelete(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/bulk/delete', data });
}

// 零件加工计划-批量导出
export function moldpartplanExport(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/export', data });
}

// 零件加工计划-导出导入模板
export function moldpartplanExportImportTemp(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/exportImportTemp', data });
}

// 零件加工计划-下发
export function moldpartplanIssue(data) {
  return defHttp.put({ url: Api.ProductionPrefix + '/moldpartplan/issue/' + data });
}

// 零件加工计划-根据父表ID下发零件计划.
export function issuepartplan(data) {
  return defHttp.put({ url: Api.ProductionPrefix + '/moldpartplan/issuepartplan/' + data });
}

// 零件加工计划-同意终止.
export function agreestop(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/agreestop', data });
}

// 零件加工计划-驳回.
export function rejectstop(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/reject', data });
}

// 零件加工计划-导入模板下载.
export function importtemplate(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/download/importtemplate', data });
}

// 零件加工计划-导入保存.
export function importSaveBatchData(batchcode) {
  return defHttp.post({ url: Api.ProductionPrefix + '/moldpartplan/' + batchcode });
}

// 零件加工计划-导入excel.
export function importExcel(data) {
  return defHttp.post({
    url: Api.ProductionPrefix + '/moldpartplan/import',
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 电极加工计划-根据父表ID下发电极计划.
export function issueelectrodeplan(data) {
  return defHttp.put({ url: Api.ProductionPrefix + '/moldpartplan/issueelectrodeplan/' + data });
}

// 模具资料分页
export function getMoldfilePage(data) {
  return defHttp.get({ url: Api.InformationPrefix + '/moldfile', data });
}

// 模具审核 - 转办 /Information/moldapply/AuditTransfer
export function moldfileTransfer(data) {
  return defHttp.post({ url: Api.InformationPrefix + '/moldapply/AuditTransfer', data });
}

// 编程工程-取消下发--父表.
export function cancelissue(id) {
  return defHttp.put({ url: Api.InformationPrefix + `/moldprogram/cancelissue/${id}` });
}

// 设计工程取消下发--父表.
export function canceldesignissue(id) {
  return defHttp.put({ url: Api.InformationPrefix + `/moldapply/canceldesignissue/${id}` });
}

// 工序排期计划-分页
export function processscheduleplan(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/processscheduleplan', data });
}

// 工序排期计划-保存标准产能.
export function saveprocesscapacity(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/processscheduleplan/saveprocesscapacity', data });
}

// 工序排期计划-根据厂区获取工序数据--返回所有数据.
export function getlistbyfactory() {
  return defHttp.get({ url: '/api/BaseData/process/getlistbyfactory' });
}

// 工序排期计划-总表导出Excel.
export function processscheduleplanExport(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/processscheduleplan/export', data });
}

// 工序排期计划-导出详情Excel.
export function processscheduleplandetailExport(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/processscheduleplan/exportdetail', data });
}
