import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/feeType',
}

//查询列表
export function getFeeTypeList(data) {
  return defHttp.get({ url: Api.Prefix + '/FeeTypeList', data });
}

// 费用类型导入模板下载
export function getTemplateDownload(data) {
  return defHttp.get({ url: Api.Prefix + '/TemplateDownload', data });
}

//下拉绑定工厂代码
export function GetFactoryBind(data) {
  return defHttp.get({ url: Api.Prefix + '/GetFactoryBind', data });
}

//下拉绑定业务范围
export function GetBusinessRangeBind(data) {
  return defHttp.get({ url: Api.Prefix + '/GetBusinessRangeBind', data });
}

//下拉绑定作业类型短文本
export function GetHomeTypeShortTextBind(data) {
  return defHttp.get({ url: Api.Prefix + '/GetHomeTypeShortTextBind', data });
}

//下拉绑定费用分类
export function GetFeeTypeBind(data) {
  return defHttp.get({ url: Api.Prefix + '/GetFeeTypeBind', data });
}
