import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/machinestate',
}

// 机台运行调试状态-分页
export function getMachinestatePage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 机台运行调试状态-汇总.
export function machinestateSummary(data) {
  return defHttp.get({ url: Api.Prefix + '/summary', data });
}

// 机台运行调试状态-导出Excel表格
export function machinestateExportdata(data) {
  return defHttp.get({ url: Api.Prefix + '/exportdata', data });
}
