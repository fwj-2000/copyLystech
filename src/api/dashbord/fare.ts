import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/faremanage/',
}

// 手工导入数据模版下载
export function exportManualTemplate(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportManualTemplate`, data, ...options });
}
// 部门对照表导入模板
export function exportDeparImportTemplate(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportDeparImportTemplate`, data, ...options });
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

// 底稿数据分页
export function getfeeDraftPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}feeDraftPage`, data, ...options });
}
