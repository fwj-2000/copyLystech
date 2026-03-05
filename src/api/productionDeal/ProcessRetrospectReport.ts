import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/ProcessRetrospectReport',
}

//查询
export function page(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取明细
export const getItemlist = data => defHttp.get({ url: Api.Prefix + `/GetItemList`, data });

//导出Excel
export function exportSamplingLevelExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}
