import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/',
}

/**
 * @description 样品材料申请报表 - 分页
 * @param params 请求参数
 */
export function getSampleMaterialApplyReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'sampleMaterialApplyReport', params });
}

/**
 * @description 样品材料申请报表 - 导出
 * @param params 请求参数
 */
export function exportSampleMaterialApplyReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'sampleMaterialApplyReport/exportExcel', params });
}

// 业务数据报表
export function getBisReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'BisReport', params });
}

// 样品材料报表统计
// /Information/SampleMaterialReport/Statistics
export function getStatistics(params: any) {
  return defHttp.get({ url: Api.Prefix + 'SampleMaterialReport/Statistics', params });
}

// 统计导出Excel
// /Information/SampleMaterialReport/StatisticsExportExcel
export function getStatisticsExportExcel(params: any) {
  return defHttp.get({ url: Api.Prefix + 'SampleMaterialReport/StatisticsExportExcel', params });
}

// 报表导出
// /Information/SampleMaterialReport/ExportExcel
export function getStatisticsReportExcel(params: any) {
  return defHttp.get({ url: Api.Prefix + 'SampleMaterialReport/ExportExcel', params });
}

// 报表列表
// /Information/SampleMaterialReport
export function getSampleMaterialReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'SampleMaterialReport', params });
}
