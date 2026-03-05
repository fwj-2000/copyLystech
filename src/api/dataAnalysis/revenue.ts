// import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/inventory/',
}
export function getIncomereport(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomereport`, data });
}
export function getIncomezsd032(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomezsd032`, data });
}

export function ExportIncomezsd032(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomezsd032Export`, data });
}
// 内销收入
export function getIncomeZmm010i(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomeZmm010i`, data });
}
// 内销收入导出
export function ExportIncomeZmm010i(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomeZmm010iExport`, data });
}
// vmi库存商品
export function getIncomVmiKc(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomVmiKc`, data });
}
// vmi库存商品导出
export function ExportIncomVmiKc(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomVmiKcExport`, data });
}
// vmi发出商品
export function getIncomeZfi021Na(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomeZfi021Na`, data });
}
// vmi发出商品导出
export function ExportIncomeZfi021Na(data: Record<string, any> = {}) {
  return defHttp.get({ url: `${Api.Prefix}incomeZfi021NaExport`, data });
}
