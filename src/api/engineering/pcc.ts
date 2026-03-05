import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
  baseDataPrefix = '/api/BaseData',
}

// 未制作
// /api/Information/pcc/tomake
export function getPccTomake(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/tomake`, data });
}

// PCC转办
export function postPCCReviewTransfer(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/transfer`, data });
}

// 根据8码模糊搜索
// /api/Information/material/SearchByShortCode
export function getMaterialSearchByShortCode(data, config?: any) {
  return defHttp.get({ url: Api.Prefix + `/material/SearchByShortCode`, data, signal: config?.signal });
}

// 批量查找料号
// /dev/api/Information/material/QueryByMaterialCode
export function getMaterialQueryByMaterialCode(data) {
  console.log('🚀 ~ getMaterialQueryByMaterialCode ~ data: ', data);
  return defHttp.put({ url: Api.Prefix + `/material/QueryByMaterialCode`, data });
}

/***
 * @description 转换引用数据
 * @param data { docId: string; inputDocType: 1:PCC | 2：工程报价 | 3：量试订单; outputDocType: 1 | 2 | 3; }
 * */
// /Information/pcc/ConvertHistoryData
export function postConvertHistoryData(data: {
  docId: string; // 选中的id
  inputDocType: 1 | 2 | 3; // 输入类型 1：PCC 2：工程报价 3：量试订单
  outputDocType: 1 | 2 | 3; // 输出类型 1：PCC 2：工程报价 3：量试订单
}) {
  return defHttp.put({ url: Api.Prefix + `/pcc/ConvertHistoryData`, data });
}

// 新增成品BOMPCC数据
// /api/Information/pcc/finishedparts
export function addFinishedPartsBomPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/finishedparts`, data });
}

// 修改成品BOMPCC数据
// /api/Information/pcc/{id}/finishedparts
export function updateFinishedPartsBomPcc(data) {
  return defHttp.put({ url: Api.Prefix + `/pcc/${data.id}/finishedparts`, data });
}

// 获取BOM结构
// /api/Information/pcc/{id}/bom
export function getBomStructure(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/${data.id}/bom` });
}

// 获取包材显示接口
// BaseData/MaterialArea/GetChildren
export function getMaterialAreaChildren(data) {
  return defHttp.get({ url: Api.baseDataPrefix + `/MaterialArea/GetChildren`, data });
}

// 查询用量倍数及单位
// Information/PCCPackingType/List
export function getPCCPackingTypeList(data) {
  return defHttp.get({ url: Api.Prefix + `/PCCPackingType/List`, data });
}

// 分页列表-申请
// /api/Information/pcc/ApplyPage
export function getPccApplyPage(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/ApplyPage`, data });
}

// 上传装机图
// /api/Information/fileinfo/Upload/Image
export function uploadInstallImg(data) {
  return defHttp.post({
    url: Api.Prefix + `/fileinfo/Upload/Image`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

export function uploadInstallFile(data) {
  return defHttp.post({
    url: Api.Prefix + `/fileinfo/Upload/File`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 获取PCCPreview
// /api/Information/pcc/GetPCCPreview
export function getPccPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/GetPCCPreview`, data });
}

// BOM详情.
// /api/Information/pcc/{id}/bomdetail
export function getBomDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/${data.id}/bomdetail` });
}

// 获取是否可上传图纸
// Information/EngineeringDocApply/IsOngoing/{PartNumber}
export function getIsOngoing(data) {
  return defHttp.get({ url: Api.Prefix + `/EngineeringDocApply/IsOngoing/${data.PartNumber}` });
}

// PCC 详情.
// /api/Information/pcc/{id}
export function getPccDetail(data) {
  if (!data.id)
    return new Promise(resolve => {
      resolve({ code: 200, data: {} });
    });
  return defHttp.get({ url: Api.Prefix + `/pcc/${data.id}` });
}

//  变更履历
// Information/PCC/RevisionHistory/{PartNumber}
export function getPccRevisionHistory(data) {
  return defHttp.get({ url: Api.Prefix + `/PCC/RevisionHistory/${data.PartNumber}`, data });
}

// 新增半成品BOMPCC数据.
// /api/Information/pcc/halffinishedparts
export function addHalfFinishedPartsBomPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/halffinishedparts`, data });
}

// 修改半成品BOMPCC数据.
// /api/Information/pcc/{id}/halffinishedparts
export function updateHalfFinishedPartsBomPcc(data) {
  return defHttp.put({ url: Api.Prefix + `/pcc/${data.id}/halffinishedparts`, data });
}

// PCC提交
// /api/Information/pcc/commit
export function commitPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/commit`, data });
}

// 导出Excel-未制作.
// /api/Information/pcc/exportexcel/tomake
export function exportExcelTomake(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/exportexcel/tomake`, data });
}

// 导出申请
// /api/Information/pcc/exportexcel/ApplyPage
export function exportExcelApplyPage(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/exportexcel/ApplyPage`, data });
}

// 导出处理
// /api/Information/pcc/exportexcel/HandlePage
export function exportExcelHandlePage(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/exportexcel/HandlePage`, data });
}

// 删除PCC
// /api/Information/pcc/{id}
export function deletePcc(data) {
  return defHttp.delete({ url: Api.Prefix + `/pcc/${data.id}` });
}

// 批量删除
// /api/Information/pcc/bulk/delet
export function bulkDeletePcc(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/bulk/delete`, data });
}

// 查询PCC全部状态列表
// /api/Information/pcc
export function getPccList(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc`, data });
}

// 查询PCC报表
// /api/Information/pcc
export function getPccReportList(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/Report`, data });
}

// 导出PCC转化
// /Information/BomToSAP/PccToSapExport
export function exportPccToSap(data) {
  return defHttp.get({ url: Api.Prefix + `/BomToSAP/PccToSapExport`, data });
}

// 查询PCC处理列表
// /api/Information/pcc/HandlePage
export function getPccHandlePage(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/HandlePage`, data });
}

// 撤回PCC
// Information/PCC/Withdraw
export function withdrawPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/PCC/Withdraw`, data });
}

// 图纸历史记录
//  Information/PCC/EngineeringDrawingsHistory/{PartNumber}
export function getEngineeringDrawingsHistory(data) {
  console.log(data, 'data.bomTypedata.bomTypedata.bomTypedata.bomTypedata.bomType');
  return defHttp.get({ url: Api.Prefix + `/PCC/EngineeringDrawingsHistory/${data.PartNumber}/${data.bomType}` });
}

// 获取产品类型
// /BaseData/ProductType/GetListType
export function getProductType(data) {
  return defHttp.get({ url: Api.baseDataPrefix + `/ProductType/GetListType`, data });
}

// 获取项目分类列表
// /BaseData/ProductType/GetListProjectClass
export function getProjectClass(data) {
  return defHttp.get({ url: Api.baseDataPrefix + `/ProductType/GetListProjectClass`, data });
}

// 获取项目分类列表
// /BaseData/ProductType/GetProjectClassList
export function getListProjectClass(data) {
  return defHttp.get({ url: Api.baseDataPrefix + `/ProductType/GetProjectClassList`, data });
}

// 获取SAP工厂
// BaseData/FactorySap/GetOneByCondition
export function getFactorySap(data) {
  return defHttp.get({ url: Api.baseDataPrefix + `/FactorySap/GetOneByCondition`, data });
}

// 获取升版列表
// /api/Information/pcc/HandledPage
export function getPccHandledPage(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/HandledPage`, data });
}

// PCC升版
// Information/PCC/ConfirmUpgradeVersion
export function confirmUpgradeVersion(data) {
  return defHttp.post({ url: Api.Prefix + `/PCC/ConfirmUpgradeVersion`, data });
}

// 保存模板
// /Information/pcc/saveastemplate
export function saveAsTemplate(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/saveastemplate`, data });
}

// 模版列表
// /Information/pcc/TemplatePage
export function getTemplatePage(data) {
  return defHttp.get({ url: Api.Prefix + `/pcc/TemplatePage`, data });
}

// PCC提交查询
// /api/Information/ecn/GetECNByPartNumber
export function getECNByPartNumber(data) {
  return defHttp.get({ url: Api.Prefix + `/ecn/GetECNByPartNumber`, data });
}

// 立即发起ECN
// /api/Information/pcc/CanMakeECN
export function canMakeECN(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/CanMakeECN`, data });
}

// PCC驳回
// /Information/pcc/reject
export function rejectPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/pcc/reject`, data });
}

// 工程资料驳回
// /Information/pcc/EngineeringDocApply/Reject
export function rejectEngineeringDocApply(data) {
  return defHttp.post({ url: Api.Prefix + `/EngineeringDocApply/Reject`, data });
}

// Information/PCC/Bulk/Commit
export function bulkCommitPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/PCC/Bulk/Commit`, data });
}

// EngineeringDocApply/Bulk/Commit
export function bulkCommitEngineeringDocApply(data) {
  return defHttp.post({ url: Api.Prefix + `/engineeringDocApply/Bulk/Commit`, data });
}

// EngineeringDocApply/Bulk/delete
export function bulkDeleteEngineeringDocApply(data) {
  return defHttp.post({ url: Api.Prefix + `/engineeringDocApply/Bulk/delete`, data });
}

// 获取ED工程列表
// Information/EngineeringDocApply/History
export function getEngineeringDocApplyHistory(data) {
  return defHttp.get({ url: Api.Prefix + `/EngineeringDocApply/History`, data });
}

// PCC转办
// Information/PCC/Transfer
export function transferPcc(data) {
  return defHttp.post({ url: Api.Prefix + `/PCC/Transfer`, data });
}

// PCC不制作
// Information/PCC/NoNeedToMake
export function notMakePcc(data) {
  return defHttp.post({ url: Api.Prefix + `/PCC/NoNeedToMake`, data });
}

/**
 * @description PCC报价量试互相引用
 * @params data
 * */
export type DocTypes = 'PCC' | 'Quotation' | 'EngineeringInformation'; // PCC：PCC；Quotation：工程报价；EngineeringInformation：量试订单评审;
export function historyQuota(data: {
  docType?: DocTypes; // 选择来源
  menuDocType: DocTypes; // 页面位置
  insidePartNumber?: string;
}) {
  return defHttp.get({ url: Api.Prefix + `/pcc/linkpage`, data });
}

/**
 * @description 工程资料查看 - 批量启用
 * @param ids 主键ID数组
 */
export function bulkBackEnable(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + `/pcc/BulkBackEnable`, data: ids });
}

/**
 * @description 工程资料查看 - 批量禁用
 * @param ids 主键ID数组
 */
export function bulkBackDisable(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + `/pcc/BulkBackDisable`, data: ids });
}

/**
 * @description 工程资料查看 - 批量默认BOM
 * @param ids 主键ID数组
 */
export function bulkBackDefaultBOM(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + `/pcc/BulkBackDefault`, data: ids });
}

/**
 * @description 工程资料查看 - 批量料头处理(StubBar)
 * @param ids 主键ID数组
 */
export function bulkBackStubBar(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + `/pcc/BulkBackStubBar`, data: ids });
}

/**
 * 工程资料审核 - 转办
 * @param data
 * @returns
 */
export function pccCheckTransfer(data: any) {
  return defHttp.post({ url: Api.Prefix + `/PCC/ReviewTransfer`, data });
}

/**
 * 上传PCC文件
 * @param data
 * @returns
 */
export function uploadPCC(data: Array<{ id: string; filePath: string; fileName: string }>) {
  return defHttp.post({ url: Api.Prefix + `/pcc/UploadPCC`, data });
}

// 导出工程资料 Quotation/ExportExcel
export function exportQuotation(data: any) {
  return defHttp.get({ url: Api.Prefix + `/Quotation/ExportExcel`, data });
}

// 上传文件 /api/Information/fileinfo/uploadfiles
export function uploadFiles(data: any) {
  return defHttp.post({
    url: Api.Prefix + `/fileinfo/uploadfiles`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * PCC转化
 * @param id 数据id
 */
export function transPCC(id: string) {
  return defHttp.post({ url: `/api/Information/bomtosap/trans-pcc/${id}` });
}
// 批量启用默认料号
export function bulkEnable(data: Array<string>) {
  return defHttp.put({ url: Api.Prefix + `/pcc/BulkBackDefault`, data });
}

/**
 * PCC推送3.8 -
 * @param id 数据id
 */
export function pushPCC(id: string) {
  return defHttp.post({ url: `/api/Information/PCC/SyncPccDongTaiAsync/${id}` });
}
