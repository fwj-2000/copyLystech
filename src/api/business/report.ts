import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/',
}

/**
 * @description 报价业务接口 - 参数类型
 */
export interface QuotationParams {
  /**
   * 当前页数
   */
  currentPage: number;
  /**
   * 页页数
   */
  pageSize: number;
  /**
   * 申请单号
   */
  applyCode?: string;
  /**
   * 申请人
   */
  applyUserName?: string;
  /**
   * 导出类型 (0：分页数据，其他：全部数据).
   */
  dataType?: string;
  /**
   * 工厂
   */
  factory?: string;
  /**
   * 处理状态
   */
  handlerSataus?: string;
  /**
   * 处理人
   */
  handlerUserName?: string;
  /**
   * Id.
   */
  Id?: string;
  /**
   * 直接客户料号
   */
  immediateCustomerPartNumber?: string;
  /**
   * 产品内部料号
   */
  insidePartNumber?: string;
  /**
   * 关键词
   */
  keyword?: string;
  /**
   * 模板ID
   */
  menuId: string;
  /**
   * 生产类型
   */
  productionType?: string;
  /**
   * 报价用途
   */
  purpose?: string;
  /**
   * 选择的导出 字段集合 按 , 号隔开.
   */
  selectKey?: string;
  sidx?: string;
  /**
   * 排序
   */
  sort?: string;
  /**
   * 终端客户料号
   */
  terminalCustomerPartNumber?: string;
  /**
   * 紧急程度
   */
  urgencyLevel?: string;
}

/**
 * @description 报价业务报表 - 分页
 * @param params 请求参数
 */
export function getQuotationReport(params: QuotationParams) {
  return defHttp.get({ url: Api.Prefix + 'quotationreport', params });
}

/**
 * @description 报价业务报表 - 导出
 * @param params 请求参数
 */
export function exportQuotationReport(params: QuotationParams) {
  return defHttp.get({ url: Api.Prefix + 'quotationReport/importreportexcel', params });
}

/**
 * @description 量试业务报表 - 参数类型
 */
export interface QuantitativeParams {
  /**
   * 当前页大小
   */
  pageSize: number;
  /**
   * 当前页码
   */
  currentPage: number;
  /**
   * 导出类型 (0：分页数据，其他：全部数据)
   */
  dataType?: string;
  /**
   * 工厂
   */
  factory?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 直接客户料号
   */
  immediateCustomerPartNumber?: string;
  /**
   * 内部料号
   */
  insidePartNumber?: string;
  /**
   * 组织ID
   */
  orgId?: string;
  /**
   * 生产类型(1：自制，2：外购)
   */
  productionType?: string;
  /**
   * 量试需求单号
   */
  qrApplyCode?: string;
  /**
   * 申请日期
   */
  qrApplyDate?: string;
  /**
   * 申请部门ID
   */
  qrApplyDeptId?: string;
  /**
   * 申请人ID
   */
  qrApplyUserId?: string;
  /**
   * 申请人姓名
   */
  qrApplyUserName?: string;
  /**
   * 选择的导出 字段集合 按 , 号隔开
   */
  selectKey?: string;
  /**
   * 终端客户料号
   */
  terminalCustomerPartNumber?: string;
}

/**
 * @description 量试业务报表 - 分页
 * @param params 请求参数
 */
export function getQuantitativeReport(params: QuantitativeParams) {
  return defHttp.get({ url: Api.Prefix + 'quantitativeReport', params });
}

/**
 * @description 量试业务报表 - 导出
 * @param params 请求参数
 * @returns
 */
export function exportQuantitativeReport(params: QuantitativeParams) {
  return defHttp.get({ url: Api.Prefix + 'quantitativeReport/importreportexcel', params });
}

/**
 * @description 商务样品需求 - 分页
 * @param params 请求参数
 */
export function getBusinessSamplesReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'businesssamplesreport', params });
}

/**
 * @description 商务样品需求 - 导出
 * @param params 请求参数
 * @returns
 */
export function exportBusinessSamplesReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'businesssamplesreport/importreportexcel', params });
}

/**
 * @description 工程样品需求 - 分页
 * @param params 请求参数
 */
export function getEngineeringSamplesReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'engineeringsamplesreport', params });
}

/**
 * @description 工程样品需求 - 导出
 * @param params 请求参数
 * @returns
 */
export function exportEngineeringSamplesReport(params: any) {
  return defHttp.get({ url: Api.Prefix + 'engineeringsamplesreport/importreportexcel', params });
}
