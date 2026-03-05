/**
 * 半成品料号 接口
 */
import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information/semifinishedproducts',
}

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * 获取详情
 * @param id
 * @returns
 */
export function getDetail(id: string) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

/**
 * 通过id获取详情列表
 * @param ids
 * @returns
 */
export function getDetailByIds(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail', data: ids });
}

/**
 * 新增
 * @param mainProcess 主要制程
 * @param list
 * @returns
 */
export function create(mainProcess: number | string, list: Array<any>) {
  return defHttp.post({ url: `${Api.Prefix}?mainProcess=${mainProcess}`, data: list });
}

/**
 * 修改
 * @param data
 * @returns
 */
export function modify(data: any) {
  return defHttp.put({ url: Api.Prefix, data });
}

/**
 * 升版
 * @param data
 * @returns
 */
export function upgradeVersion(data: any) {
  return defHttp.put({ url: `${Api.Prefix}/UpgradeVersion`, data });
}

/**
 * 批量启用
 * @param ids
 * @returns
 */
export function bulkbackenable(ids: Array<string>) {
  return defHttp.put({ url: `${Api.Prefix}/bulkbackenable`, data: ids });
}

/**
 * 批量禁用
 * @param ids
 * @returns
 */
export function bulkBackDisable(ids: Array<string>) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackDisable`, data: ids });
}

/**
 * 导出SAP
 * @param params
 * @returns
 */
export function exportExcel(params: any) {
  return defHttp.get({ url: `${Api.Prefix}/Export`, params });
}

/**
 * 绑定工厂 /information/semifinishedproducts/BindFactory
 * @returns
 */
export function bindFactory(data: { id: string; factories: string[] }) {
  return defHttp.put({ url: `${Api.Prefix}/BindFactory`, data });
}

/**
 * 解绑工厂
 * /information/semifinishedproducts/UnbindFactory
 */
export function unbindFactory(data: { id: string; factories: string[] }) {
  return defHttp.put({ url: `${Api.Prefix}/UnbindFactory`, data });
}

/**
 * 获取半成品料号下拉数据
 * */
export function getSemiFinishedProductsList(params: any) {
  return defHttp.get({ url: `${Api.Prefix}/GetSemiFinishedProductsList`, params });
}

/**
 * 批量获取半成品料号下拉数据
 * @param data
 * */
export function getBatchSemiFinishedProducts(data: { partNumbers: Array<string>; mainProcess?: number | string }) {
  return defHttp.put({ url: `${Api.Prefix}/QueryBySemiFinishedProducts`, data });
}

/**
 * 批量查询半成品(粘贴用)
 */
export function getBatchSemiFinishedProductsByCode(data: Array<string>) {
  return defHttp.put({ url: `${Api.Prefix}/QueryBySemiFinishe`, data });
}
