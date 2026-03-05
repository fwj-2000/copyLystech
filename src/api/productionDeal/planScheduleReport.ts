import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/PlanScheduleReport',
}

//查询
export function page(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//导出Excel
export function exportSamplingLevelExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}
