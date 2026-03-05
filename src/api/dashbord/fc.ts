import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/fcdata/',
}
const commonOption: AxiosRequestConfig = {
  timeout: 1000 * 60 * 2,
};
// 获取客服名字信息
export function getCustomerNameBind(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}customernamebind`, data, ...commonOption, ...options });
}

// FC当周分析
export function getfcdataanalysislist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcdataanalysislist`, data, ...commonOption, ...options });
}
// FC当周分析明细
export function getfccurrentdetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fccurrentdetaillist`, data, ...commonOption, ...options });
}

// FC准确率
export function getfcdataaccuracylist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcdataaccuracylist`, data, ...commonOption, ...options });
}
// FC准确率-排行榜前五(月年)
export function getfcmonthandyeartopfive(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcmonthandyeartopfive`, data, ...commonOption, ...options });
}
// FC准确率-客服明细(图形)
export function getfcaccuracydetailcustomerservicegraphiclist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcaccuracydetailcustomerservicegraphiclist`, data, ...commonOption, ...options });
}
// FC准确率-客户明细(图形)
export function getfcaccuracydetailclientgraphiclist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcaccuracydetailclientgraphiclist`, data, ...commonOption, ...options });
}
// FC准确率-整体分布明细(图形)
export function getfcaccuracydetailallgraphiclist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcaccuracydetailallgraphiclist`, data, ...commonOption, ...options });
}
// FC准确率-整体分布&客服&客户明细
export function getfcaccuracydetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcaccuracydetaillist`, data, ...commonOption, ...options });
}

// FC滚动对比
export function getfcrollvslist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcrollvslist`, data, ...commonOption, ...options });
}
// FC滚动对比--变化率分布&数量分布
export function getfcrollvschangelist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcrollvschangelist`, data, ...commonOption, ...options });
}
// FC滚动对比--4周FC量滚动整体情况
export function getfcrollvsdetailfourlist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcrollvsdetailfourlist`, data, ...commonOption, ...options });
}
// FC滚动对比明细
export function getfcrollvsdetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcrollvsdetaillist`, data, ...commonOption, ...options });
}
// FC滚动对比--变化率分布/数量分布明细
export function getfcrollvschangedetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcrollvschangedetaillist`, data, ...commonOption, ...options });
}

// FC交易模式&币种
export function getfcvmiorjitandcurrencylist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcvmiorjitandcurrencylist`, data, ...commonOption, ...options });
}
// FC交易模式&币别&项目阶段&客户明细
export function getfccurrencyandcustomerdetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fccurrencyandcustomerdetaillist`, data, ...commonOption, ...options });
}

// FC预测需求记录/实际出货
export function getfcpredictionandcurrentlist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcpredictionandcurrentlist`, data, ...commonOption, ...options });
}
// FC预测需求记录/实际出货
export function getfcpredictionandcurrentdetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcpredictionandcurrentdetaillist`, data, ...commonOption, ...options });
}

// FC产品类别
export function getfcproductcategorylist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcproductcategorylist`, data, ...commonOption, ...options });
}
// 获取产品类别信息
export function getproductcategorybind(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}productcategorybind`, data, ...commonOption, ...options });
}
// FC产品类别&项目明细
export function getfcproductcategorydetaillist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcproductcategorydetaillist`, data, ...commonOption, ...options });
}

// FC项目
export function getfcprojectlist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcprojectlist`, data, ...commonOption, ...options });
}
// 获取项目信息
export function getprojectbind(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}projectbind`, data, ...commonOption, ...options });
}

// FC厂区余量分布
export function getfcfactorymarginlist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcfactorymarginlist`, data, ...commonOption, ...options });
}
// 厂区金额&数量明细
export function getfcpricequantitydetaillists(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcpricequantitydetaillists`, data, ...commonOption, ...options });
}
// 厂区金额&数量明细(图形)
export function getfcpricequantitygraphicdetaillists(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcpricequantitygraphicdetaillists`, data, ...commonOption, ...options });
}

// FC项目阶段
export function getfcprojectphaselist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fcprojectphaselist`, data, ...commonOption, ...options });
}
// FC客服和客户数
export function getfccustomerandcustomelist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fccustomerandcustomelist`, data, ...commonOption, ...options });
}

// FC终端客户料号
export function getfccustprodnolist(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fccustprodnolist`, data, ...commonOption, ...options });
}
// 获取终端客户料号信息
export function getcustprodnobind(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}custprodnobind`, data, ...commonOption, ...options });
}

// 提交FC原因分析
export function fcdatareasoninfosubmit(data) {
  return defHttp.post({ url: `/api/report/fcdatareasoninfo/fcdatareasoninfosubmit`, data });
}

// 获取FC批数据
export function getFcDataAudit(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `/api/Information/FcDataAudit`, data, ...commonOption, ...options });
}
// 获取节点记录
export function getNodeList(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `/api/Information/FcDataAudit/GetNodeList`, data, ...commonOption, ...options });
}
// 驳回 FC批数据审批
export function rejectFcDataAudit(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/Reject`, data });
}
// 提交 FC批数据审批
export function commitFcDataAudit(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/Commit`, data });
}
// 撤回 FC批数据审批
export function withdrawFcDataAudit(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/Withdraw`, data });
}
// 作废 FC批数据审批单
export function considerVoidFcDataAudit(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/ConsiderVoid`, data });
}
// 催办 FC批数据审批
export function reminderFcDataAudit(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/reminder`, data });
}

// 获取备料原则
export function getMaterialPrinciple(data) {
  return defHttp.get({ url: `/api/Information/fcdata/GetMaterialPrinciple`, data });
}

// 提交知会 Information/FcDataAudit/AutoInform
export function fcdataauditnotify(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/AutoInform`, data });
}

// fc变更流程操作
// 获取节点记录
export function getFCChangeNodeList(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `/api/Information/FcChangeAudit/GetNodeList`, data, ...commonOption, ...options });
}
// 驳回 FC批数据审批
export function rejectFCChangeAudit(data) {
  return defHttp.post({ url: `/api/Information/FcChangeAudit/Reject`, data });
}
// 提交 FC批数据审批
export function commitFCChangeAudit(data) {
  return defHttp.post({ url: `/api/Information/FcChangeAudit/Commit`, data });
}
// 撤回 FC批数据审批
export function withdrawFCChangeAudit(data) {
  return defHttp.post({ url: `/api/Information/FcChangeAudit/Withdraw`, data });
}
// 作废 FC批数据审批单
export function considerVoidFCChangeAudit(data) {
  return defHttp.post({ url: `/api/Information/FcChangeAudit/ConsiderVoid`, data });
}
// 催办 FC批数据审批
export function reminderFCChangeAudit(data) {
  return defHttp.post({ url: `/api/Information/FcChangeAudit/reminder`, data });
}

// 获取备料原则
export function getFCChangeMaterialPrinciple(data) {
  return defHttp.get({ url: `/api/Information/fcdata/GetMaterialPrinciple`, data });
}

// 提交知会
export function FCChangeAuditnotify(data) {
  return defHttp.post({ url: `/api/Information/FcChangeAudit/AutoInform`, data });
}

// FC数据补推MPS
export function pushFcDataToMPS(data) {
  return defHttp.post({ url: `/api/Information/FcDataAudit/sendDataToFCMiddleTable`, data });
}
