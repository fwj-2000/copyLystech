/*
 * @Author: zengjianyu zeng.jian.yu@lingyiitech.com
 * @Date: 2025-01-13 08:40:25
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-02-18 13:34:37
 * @FilePath: \lydc.server.web\src\api\business\salesForecast.ts
 * @Description: 销售预测 - 接口
 */
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';

enum Api {
  Prefix = '/api/Information/salesForecast/',
}

export interface FcParams {
  /**
   * 当前页码
   */
  currentPage?: string;
  /**
   * 当前页数
   */
  pageSize?: string;
  /**
   * 版本号
   */
  batchCode?: string;
  /**
   * 导出类型 (0：分页数据，其他：全部数据)
   */
  dataType?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 导入人
   */
  importUser?: string;
  /**
   * 主要制程（1、"模切",2、"冲压",3、"CNC",4、"模具"
   */
  mainProcess?: string;
  /**
   * 选择的导出 字段集合 按 , 号隔开
   */
  selectKey?: string;
  /**
   * 状态：根据不同的模块取值，最终赋值给指定的状态筛选字段
   */
  status?: string;
  /**
   * 指定状态所属模块
   */
  statusType?: `${MODULE_TYPE_ENUM}`;
}

/**
 * @description 销售预测 - 草稿 - 导入
 * @param data 文件内容
 * @param mainProcess 主要制程
 * @param batchCode 版本号
 */
export function importSalesForecast(data: any, mainProcess: string, batchCode?: string) {
  const params = new URLSearchParams('');
  mainProcess && params.append('mainProcess', mainProcess);
  batchCode && params.append('batchCode', batchCode || '');
  return defHttp.post({
    url: Api.Prefix + 'import' + '?' + params.toString(),
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * @销售预测 - 草稿 - 导入保存
 * @param data 保存数据
 * @param isSubmit 是否提交（true：提交，false：暂存），默认为 `false`
 */
export function temporarySaveSalesForecast(data: Array<any>, isSubmit = false) {
  return defHttp.post({ url: Api.Prefix + 'temporarySave?isSubmit=' + isSubmit, data });
}

/**
 * @description 销售预测 - 草稿 - 下载模板
 */
export function downloadSalesForecastDrawingTemplate() {
  return defHttp.get({ url: Api.Prefix + `download/importTemplate` });
}

/**
 * @description 销售预测 - 草稿 - 获取数据列表
 * @param params 请求参数
 */
export function getSalesForecastDrawingDatas(params: FcParams) {
  return defHttp.get({ url: Api.Prefix + 'getDrawingDatas', params });
}

// 辅助函数：将大驼峰转换为小驼峰
const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.charAt(1).toLowerCase() + str.slice(2);
/**
 * @description 销售预测 - 通用 - 获取数据列表
 * @param type 状态筛选字段
 * @param params 请求参数
 */
export function getSalesForecast(type: `${MODULE_TYPE_ENUM}`, params: FcParams) {
  const camelCaseType = toCamelCase(type);
  return defHttp.get({
    url: Api.Prefix,
    params: { ...params, statusType: type, [camelCaseType]: params[camelCaseType] || params.status || '' },
  });
}

/**
 * @description 销售预测 - 通用 - 撤回
 * @param data
 */
export function withdrawSalesForecast(data: Array<{ billid: string; remark?: string; actionRemark?: string }>) {
  return defHttp.post({ url: Api.Prefix + 'withdraw', data });
}

/**
 * @description 销售预测 - 通用 - 驳回
 */
export function rejectSalesForecast(data: { ids: string[]; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + 'reject', data });
}

/**
 * @description 销售预测 - 通用 - 临时保存数据
 */
export function temporaryStorageJson(batchCode: string, data: any[]) {
  return defHttp.post({ url: Api.Prefix + 'temporaryStorageJson?batchCode=' + batchCode, data });
}

/**
 * @description 销售预测 - 通用 - 批量删除
 * @param ids 删除的id
 */
export function bulkDelete(ids: string[]) {
  return defHttp.post({ url: Api.Prefix + 'bulkDelete', data: ids });
}

/**
 * @description 销售预测 - 通用 - 导出数据
 * @param type 状态筛选字段
 * @param params 请求参数
 */
export function exportSalesForecast(type: `${MODULE_TYPE_ENUM}`, params: FcParams) {
  const camelCaseType = toCamelCase(type);
  return defHttp.get({
    url: Api.Prefix + 'exportExcel',
    params: { ...params, statusType: type, [camelCaseType]: params[camelCaseType] || params.status || '' },
  });
}

/**
 * @description 销售预测 - 通用 - 删除
 */
export function delSalesForecast(id: string) {
  return defHttp.delete({ url: Api.Prefix + '?id=' + id });
}

/**
 * @description 销售预测 - 通用 - 根据版本号获取全部的数据列表
 * @param type 状态筛选字段
 */
export function getSalesForecastByBatchCode(
  type: `${MODULE_TYPE_ENUM}`,
  params: { batchCode: string; mainProcess: string | number; status?: string | number } & Partial<Record<`${MODULE_TYPE_ENUM}`, string | number>>,
) {
  const camelCaseType = toCamelCase(type);
  return defHttp.get({
    url: Api.Prefix + 'getBatchList',
    params: { ...params, statusType: type, [camelCaseType]: params[camelCaseType] || params.status || '' },
  });
}

/**
 * @description 销售预测 - 通用 -  批量根据id获取数据列表
 * @param ids id集合
 */
export function getSalesForecastByIds(ids: string[]) {
  return defHttp.post({ url: Api.Prefix + 'getArrayList', data: ids });
}

/**
 * 通过产品内部料号获取成员列表
 * @param data
 */
export function getMemberList(data: Array<{ code: string; factoryId?: string; configType: string }>) {
  return defHttp.put({ url: '/api/basedata/projectMembersGroup/getMemberList', data });
}

/**
 * @description 销售预测 - 已提交 - 转化Site比例数据
 * @param mainProcess 主要制程
 * @param data 需要转换的数据
 */
export function convertSiteData(mainProcess: string | number, data: Array<any>) {
  return defHttp.post({ url: Api.Prefix + 'convertSiteData?mainProcess=' + mainProcess, data });
}

/**
 * @description 销售预测 - 已提交 - 转化片卷料数据
 * @param mainProcess 主要制程
 * @param data 需要转换的数据
 */
export function convertShipPatternData(mainProcess: string | number, data: Array<any>) {
  return defHttp.post({ url: Api.Prefix + 'convertShipPatternData?mainProcess=' + mainProcess, data });
}

/**
 * @description 销售预测 - 已提交 - 保存转化数据
 * @param mainProcess 主要制程
 * @param data 需要保存的数据
 */
export function saveConvertSalesForecastData(mainProcess: string | number, data: Array<any>) {
  return defHttp.post({ url: Api.Prefix + 'convert?mainProcess=' + mainProcess, data });
}

/**
 * @description 销售预测 - 需求确认 - 保存（PM确认）
 * @param batchCode 版本号
 * @param data
 */
export function savePMConfirmPages(batchCode: string, data: Array<any>) {
  return defHttp.post({ url: Api.Prefix + 'pmConfirm?batchCode=' + batchCode, data });
}

/**
 * @description 销售预测 - 需求确认 - 保存（PM确认并且计算数据）
 * @param mainProcess 主要制程
 * @param data 数据列表
 * @returns
 */
export function savePmConfirmAndCalc(mainProcess: string | number, data: Array<any>) {
  return defHttp.put({ url: Api.Prefix + 'pmConfirm?mainProcess=' + mainProcess, data });
}

/**
 * @description 销售预测 - 待产需求 - 保存（CS确认）
 * @param batchCode
 * @param data
 */
export function saveCsConfirm(batchCode: string, data: any) {
  return defHttp.post({ url: Api.Prefix + 'csConfirm?batchCode=' + batchCode, data });
}

/**
 * @description 销售预测 - 待产需求 - 计算
 * @param mainProcess 主要制程
 * @param data
 */
export function computeSalesForecast(mainProcess: string, data: any) {
  return defHttp.post({ url: Api.Prefix + 'compute?mainProcess=' + mainProcess, data });
}

/**
 * @description 销售预测 - 需求审核 - 同意(评审结束)
 * @param batchCode
 * @param data
 */
export function review(batchCode: string, data: Array<string>) {
  return defHttp.post({ url: Api.Prefix + 'review?batchCode=' + batchCode, data });
}

/**
 * @description 销售预测 - 需求审核 - 转办
 */
export function transfer(data: { ids: string[]; transferRemark: string; reviewUserId: string }) {
  return defHttp.post({ url: Api.Prefix + 'transfer', data });
}

/**
 * @description 销售预测 - 获取单条数据详情
 * @param id 数据id
 */
export function getSalesForecastDetail(id: string) {
  return defHttp.get({ url: Api.Prefix + id });
}

/**
 * @description 销售预测 - 修改单条数据详情
 * @param id 数据id
 * @param data 修改后的详情数据
 */
export function updateSalesForecastDetail(id: string, data: object) {
  return defHttp.put({ url: Api.Prefix + id, data });
}

/**
 * @description 获取节点履历记录
 * @param id 单据id
 */
export function getNodeList(id: string) {
  return defHttp.get({ url: Api.Prefix + 'getNodeList', params: id });
}

/**
 * @description 根据账号列表获取用户列表
 * @param accountList 账号列表
 */
export function getUserListByAccountList(accountList: Array<string>) {
  return defHttp.post({ url: Api.Prefix + 'getuserlist', data: accountList });
}
