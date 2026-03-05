import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/OtherLabelPrint',
  ProductionPrefix = '/api/Production/PackLabelPrint',
  PrePrintTemplate = '/api/CoreCommon/PrintTemplate',
  ProductionSinglePrefix = '/api/Production/PackLabelPrintSingle',
}
// 分页列表
export function getOtherLabelPrint(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 打印
export function otherLabelPrint(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

export function getPrintTemplateDetail(data) {
  return defHttp.get({ url: Api.PrePrintTemplate + '/' + data });
}

// 包装打印-导出
export function ExportData(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/ExportData', data });
}

// 批量删除
export function batchDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
