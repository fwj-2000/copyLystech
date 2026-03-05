import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/materialdevelopapplyreport',
  baseData = '/api/Information/MaterialDevelop',
}

export interface Request {
  /**
   * 需求单号
   */
  applyNumber?: string;
  /**
   * 当前页数
   */
  currentPage: number;
  /**
   * 导出类型 (0：分页数据，其他：全部数据).
   */
  dataType?: string;
  /**
   * Id.
   */
  Id?: string;
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
   * 页页数
   */
  pageSize: number;
  /**
   * 选择的导出 字段集合 按 , 号隔开.
   */
  selectKey?: string;
  sidx?: string;
  /**
   * 排序
   */
  sort?: string;
}

/**
 * @description 新材料业务报表 - 分页
 * @param params 请求参数
 */
export function getReport(params: Request) {
  return defHttp.get({ url: Api.baseData, params });
}

/**
 * @description 新材料业务报表 - 导出
 * @param params 请求参数
 */
export function exportReport(params: Request) {
  return defHttp.get({ url: Api.Prefix + '/ImportMdaReportExcel', params });
}
