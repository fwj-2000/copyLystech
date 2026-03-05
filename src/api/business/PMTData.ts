import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api',
}

/**
 * 获取报表数据
 * @param params
 * @returns
 */
export function getReportData(params: any) {
  return defHttp.get({ url: Api.Prefix + '/report/Pmt/summary', params });
}

type DETAIL_PARAMS = { type: string } & Record<string, any>;

/** 工程开发 - 查询报表明细  */
export function getReportDetailList(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/Pmt/details`, data });
}

/** 需求管理 - 查询报表明细 */
export function getRequiredetailList(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/Pmt/requiredetail`, data });
}

/** 关务 - 备案明细 */
export function getAffairsdetail(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/pmt/affairsdetail`, data });
}

/** 出货 - 明细 */
export function getCelldetail(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/pmt/celldetail`, data });
}

/** 客户使用 - 明细 */
export function getOnlineusedetail(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/pmt/onlineusedetail`, data });
}

/** 报价管理 - 明细 */
export function getQuotationdetail(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/pmt/quotationdetail`, data });
}

/** 生产制造 - 明细 */
export function getProducedetail(data: DETAIL_PARAMS) {
  return defHttp.get({ url: Api.Prefix + `/report/pmt/producedetail`, data });
}
