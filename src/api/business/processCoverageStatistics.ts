import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

export function ProcessCoverageReportList(data) {
  return defHttp.get({ url: Api.Prefix + `/ProcessCoverageReport`, data });
}

export function ProcCoverReportExportData(data) {
  return defHttp.get({ url: Api.Prefix + `/ProcessCoverageReport/Export`, data });
}
