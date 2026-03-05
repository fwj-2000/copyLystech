import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/producereport',
}

// 总览接口.
export function getOverviewData(data) {
  return defHttp.get({ url: Api.Prefix + '/overview', data });
}

//查询列表
export function getProducereport(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 批量导出
export function producereportExport(data) {
  return defHttp.get({ url: Api.Prefix + '/export', data });
}

// 开工分页列表.
export function getStartworkpage(data) {
  return defHttp.get({ url: Api.Prefix + '/startworkpage', data });
}

// 报工分页列表.
export function getReportworkpage(data) {
  return defHttp.get({ url: Api.Prefix + '/reportworkpage', data });
}

// 转出分页列表.
export function getCirculationpage(data) {
  return defHttp.get({ url: Api.Prefix + '/circulationpage', data });
}

// 接收物料分页列表.
export function getReceivepage(data) {
  return defHttp.get({ url: Api.Prefix + '/receivepage', data });
}
