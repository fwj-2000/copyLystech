import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/mps/PsTableData',
}

//查询列表
export function getPsTableData(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}
