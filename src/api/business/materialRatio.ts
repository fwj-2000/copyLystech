/*
 * @Author: zengjianyu zeng.jian.yu@lingyiitech.com
 * @Date: 2025-01-17 08:51:31
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-02-18 11:36:23
 * @FilePath: \lydc.server.web\src\api\business\materialRatio.ts
 * @Description: 片卷料比例 - 接口
 */
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { MAIN_PROCESS_ENUM } from '/@/views/business/salesForecast/config';

enum Api {
  Prefix = '/api/Information/salesShipPattern/',
}

/**
 * @description 片卷料比例 - 下载模板
 */
export function downloadTemplate() {
  return defHttp.get({ url: Api.Prefix + `download/importTemplate` });
}

/**
 * @description 片卷料比例 - 导入
 * @param data 文件参数
 * @param mainProcess 主要制程
 */
export function importSalesShipPattern(data: { file: File }, mainProcess: string | number) {
  return defHttp.post({
    url: Api.Prefix + 'import?mainProcess=' + mainProcess,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * @description 片卷料比例，终端客户料号 - 下拉框数据
 * @param code 终端客户料号 - 搜索关键词
 * @param mainProcess 主要制程，不传值默认为模切（`1`）
 * @returns
 */
export function getSalesShipPatternDropdownlist(code: string, mainProcess?: string) {
  return defHttp.get({ url: Api.Prefix + 'getdropdownlist', params: { code, type: 3, mainProcess: mainProcess || MAIN_PROCESS_ENUM.模切 } });
}

export interface GetProjectListByConditionParams {
  /**
   * 主要制程
   */
  mainProcess: string;
  pageSize: string;
  currentPage: string;
  /**
   * 直接客户代码
   */
  immediateCustomerCode?: string;
  /**
   * 终端客户代码
   */
  terminalCustomerCode?: string;
  /**
   * 终端客户料号
   */
  terminalCustomerPartNumber?: string;
  /**
   * 终端项目代码
   */
  terminalCustomerProjectCode?: string;
}
/**
 * 片卷料比例，终端客户料号 - 批量添加筛选
 * @param params 查询参数
 */
export function getSalesShipPatternProjectListByCondition(params: GetProjectListByConditionParams) {
  return defHttp.get({ url: Api.Prefix + 'getProjectListByCondition', params });
}

/**
 * @description 片卷料比例 - 列表查询
 * @param params 查询参数
 */
export function getSalesShipPattern(params: any) {
  return defHttp.get({ url: Api.Prefix + 'page', params });
}

/**
 * @description 片卷料比例 - 导出数据
 * @param params 下载文件参数
 */
export function exportSalesShipPattern(params: any) {
  return defHttp.get({ url: Api.Prefix + 'exportExcel', params });
}

/**
 * @description 片卷料比例 - 获取数据详情
 * @param terminalCustomerPartNumber 终端客户料号
 * @param mainProcess 主要制程
 */
export function getSalesShipPatternDetail(terminalCustomerPartNumber: string, mainProcess: string) {
  return defHttp.get({ url: Api.Prefix + 'createPage', params: { terminalCustomerPartNumber, mainProcess } });
}

/**
 * @description 片卷料比例 - 新增或者修改详情
 * @param mainProcess 主要制程
 * @param data
 */
export function saveSalesShipPatternDetail(mainProcess: string, data: any) {
  return defHttp.post({ url: Api.Prefix + 'create?mainProcess=' + mainProcess, data });
}

/**
 * @description 片卷料比例 - 获取修改记录
 * @param terminalCustomerPartNumber 终端客户料号
 * @param yearMonth 时间，如：`2024-12`
 */
export function getSalesShipPatternModifyLogs(params: { terminalCustomerPartNumber: string; yearMonth: string }) {
  return defHttp.get({ url: Api.Prefix + 'getLogs', params });
}

/**
 * @description 片卷料比例 - 批量删除
 * @param ids 将被删除的id集合
 */
export function bulkDeleteSalesShipPattern(ids: string[]) {
  return defHttp.post({ url: Api.Prefix + 'bulkDelete', data: ids });
}

/**
 * @description 片卷料比例 - 获取已维护数据详情
 * @param terminalCustomerPartNumber 终端客户料号
 * @param mainProcess 主要制程
 */
export function getBatchSalesShipPatternDetail(terminalCustomerPartNumber: string, mainProcess: string) {
  return defHttp.get({ url: Api.Prefix + 'getBatchList', params: { terminalCustomerPartNumber, mainProcess } });
}
