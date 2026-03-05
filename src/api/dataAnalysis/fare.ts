import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/faremanage/',
}
// 获取全部组织层级
export function getAllOrganization(data = {}) {
  return defHttp.get({ url: `/api/report/organization/getall`, data });
}

// 手工导入数据模版下载
export function exportManualTemplate(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportManualTemplate`, data, ...options });
}
// 部门对照表导入模板
export function exportDeparImportTemplate(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportDeparImportTemplate`, data, ...options });
}
// 部门未维护数据
export function exportDeptNoMaintenance(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}deptNoMaintenance`, data, ...options });
}
// 部门对照表分页
export function departmentPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}departmentPage`, data, ...options });
}

// 手工导入数据
export function getmanualdatapage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}manualdatapage`, data, ...options });
}

// 费用维度列表
export function getfeeAttrDimension(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}feeAttrDimension`, data, ...options });
}

// 费用明细新版
export function getfeeattrdetailv2(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}feeattrdetailv2`, data, ...options });
}
// 费用目标  /report/faremanage/targetdetail
export function targetdetailPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}targetdetail`, data, ...options });
}
export function analysisAddOrUpdate(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.post({ url: `${Api.Prefix}analysisAddOrUpdate`, data, ...options });
}
// 费用目标明细  /report/faremanage/faretargetpage
export function faretargetpage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}faretargetpage`, data, ...options });
}
// 费用目标 模版下载 /report/faremanage/exportTarGetTemplate
export function exportTarGetTemplate(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportTarGetTemplate`, data });
}

// 底稿数据分页
export function getfeeDraftPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}feeDraftPage`, data, ...options });
}
// 底稿数据分页 导出
export function feeDraftPageExport(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}feeDraftPageExport`, data, ...options });
}

// 指标中心--费用排名页
export function getFaremanageAllocationrank(data) {
  return defHttp.get({ url: `${Api.Prefix}allocationranking`, data });
}

/**
 * 费用明细数据同步
 * @returns
 */
export function syncFareManageData() {
  return defHttp.post({ url: `${Api.Prefix}syncFareManageData` });
}
export function updateTarget(data) {
  return defHttp.put({ url: `${Api.Prefix}updateTarget`, data });
}
//对策导入
export function fareAnalyPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}fareAnalyPage`, data, ...options });
}
export function exportAnalysTemplate(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportAnalysTemplate`, data });
}
