import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/AOIUpload',
  PrefixU = '/api/Equipment/UtilizationRate'
}

//AOI查询
export function getPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//AOI导出
export function exportDataAOI(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data })
}


//AOI稼动率查询
export function getAOIPage(data) {
  return defHttp.get({ url: Api.PrefixU + `/AOIPage`, data });
}

//斑鸠机稼动率查询
export function getBJJPage(data) {
  return defHttp.get({ url: Api.PrefixU + `/BJJPage`, data });
}

//补数机稼动率查询
export function getBSJPage(data) {
  return defHttp.get({ url: Api.PrefixU + `/BSJPage`, data });
}


//稼动率导出
export function exportData(data) {
  return defHttp.get({ url: Api.PrefixU + `/ExportData?type=${data.type}`, data });
}