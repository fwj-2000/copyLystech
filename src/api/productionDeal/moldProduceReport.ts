import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/MoldProduceReport',
}

//查询列表
export function getMoldProduceReport(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 批量导出
export function moldProduceReportExport(data) {
  return defHttp.get({ url: Api.Prefix + '/export', data });
}

//查询详情
export function getDetailPage(data) {
  return defHttp.get({ url: Api.Prefix + '/detailpage', data });
}

// 导出详情
export function exportDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/exportdetail', data });
}
