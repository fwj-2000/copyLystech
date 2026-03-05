/*
 * @Author: zengjianyu zeng.jian.yu@lingyiitech.com
 * @Date: 2025-01-16 08:40:29
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-02-18 11:39:46
 * @FilePath: \lydc.server.web\src\api\business\siteRatio.ts
 * @Description: site比例 - 接口
 */
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { MAIN_PROCESS_ENUM } from '/@/views/business/salesForecast/config';

enum Api {
  Prefix = '/api/Information/salesSite/',
}

/**
 * @description site比例 - 下载模板
 */
export function downloadTemplate() {
  return defHttp.get({ url: Api.Prefix + `download/importTemplate` });
}

/**
 * @description site比例 - 导入
 * @param data 文件参数
 * @param mainProcess 主要制程
 */
export function importSalesSite(data: { file: File }, mainProcess: string | number) {
  return defHttp.post({
    url: Api.Prefix + 'import?mainProcess=' + mainProcess,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * @description site比例，终端项目代码 - 下拉列表
 * @param code 终端项目代码 - 搜索关键词
 * @param mainProcess 主要制程，默认传模切(`1`)
 */
export function getSalesSiteDropdownlist(code: string, mainProcess?: string) {
  return defHttp.get({ url: Api.Prefix + 'getdropdownlist', params: { code, mainProcess: mainProcess || MAIN_PROCESS_ENUM.模切, type: 1 } });
}

export interface GetProjectListByConditionParams {
  currentPage: string;
  pageSize: string;
  /**
   * 主要制程
   */
  mainProcess: string;
  immediateCustomerCode?: string;
  insideProjectCode?: string;
  terminalCustomerCode?: string;
  /**
   * 终端项目代码
   */
  terminalCustomerProjectCode?: string;
}
/**
 * @description site，终端客户料号 - 批量添加筛选
 * @param params 查询参数
 */
export function getSalesSiteProjectListByCondition(params: GetProjectListByConditionParams) {
  return defHttp.get({ url: Api.Prefix + 'getProjectListByCondition', params });
}

/**
 * @description site比例 - 列表查询
 * @param params 查询参数
 */
export function getSalesSite(params: any) {
  return defHttp.get({ url: Api.Prefix + 'page', params });
}

/**
 * @description site比例 - 导出数据
 * @param params 下载文件参数
 */
export function exportSalesSite(params: any) {
  return defHttp.get({ url: Api.Prefix + 'exportExcel', params });
}

/**
 * @description site比例 - 根据终端项目代码获取创建数据详情
 * @param terminalCustomerProjectCode 终端项目代码
 * @param mainProcess 主要制程
 */
export function getSalesSiteCreateDetail(params: { terminalCustomerProjectCode: string; mainProcess: string }) {
  return defHttp.get({ url: Api.Prefix + 'createPage', params });
}

/**
 * @description site比例 - 获取已维护数据详情
 * @param terminalCustomerProjectCode 终端项目代码
 * @param mainProcess 主要制程
 */
export function getSalesSiteDetail(terminalCustomerProjectCode: string, mainProcess: string) {
  return defHttp.get({ url: Api.Prefix + 'getBatchList', params: { terminalCustomerProjectCode, mainProcess } });
}

/**
 * @description site比例 - 新增或者修改详情
 * @param data
 */
export function saveSalesSiteDetail(data: any) {
  return defHttp.post({ url: Api.Prefix + 'create', data });
}

/**
 * @description site比例 - 获取修改记录
 * @param terminalCustomerProjectCode 终端项目代码
 * @param yearMonth 时间，如：`2024-12`
 */
export function getSalesSiteModifyLogs(params: { terminalCustomerProjectCode: string; yearMonth: string }) {
  return defHttp.get({ url: Api.Prefix + 'getLogs', params });
}

/**
 * @description site比例 - 批量删除
 * @param ids 将被删除的id集合
 */
export function bulkDeleteSalesSite(ids: string[]) {
  return defHttp.post({ url: Api.Prefix + 'bulkDelete', data: ids });
}
