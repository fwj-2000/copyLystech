import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/heatdissi/',
  // Prefix = '/api/report/faremanage/',
}

//不良项分页
export function getBadPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}badPage`, data, ...options });
}
//基础资料分页
export function getBasePage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}basePage`, data, ...options });
}
//  模版下载 传base返回基础数据导入模板、传bad返回不良项导入模板
export function downloadTemplate(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}downloadTemplate`, data, ...options });
}
export function postSyncData() {
  return defHttp.post({ url: `${Api.Prefix}syncData` });
}
// 批量删除每日报表
export function delDailyReport(data) {
  return defHttp.delete({ url: `${Api.Prefix}deldailyreport`, data });
}
//  导出每日报表维护
export function exportDailyDetail(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}exportDailyDetail`, data, ...options });
}

//每日报表分页
export function getDailyDetailPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}dailyDetailPage`, data, ...options });
}
//每日报表分页 项目下拉
export function getProjectParam(data) {
  return defHttp.get({ url: `${Api.Prefix}projectParam`, data });
}
//项目良率和统计
export function getStatPage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.Prefix}statpage`, data, ...options });
}
// 新增或修改项目良率和统计
export function updateStataddorupdate(data) {
  return defHttp.post({ url: `${Api.Prefix}stataddorupdate`, data });
}

/**
 * @description 删除基础资料
 * @param ids 主键ID数组
 */
export function basedel(ids: string[]) {
  return defHttp.post({ url: `${Api.Prefix}basedel`, data: ids });
}
/**
 * @description 删除不良项
 * @param ids 主键ID数组
 */
export function baddelApi(ids: string[]) {
  return defHttp.post({ url: `${Api.Prefix}baddel`, data: ids });
}
/**
 * @description 根据ID获取一条基础资料数据 /report/heatdissi/base
 * @param id 主键ID
 */
export function getBaseDetail(id: string) {
  return defHttp.get({ url: `${Api.Prefix}base/${id}` });
}
/**
 * @description 根据ID获取一条不良资料数据
 * @param id 主键ID
 */
export function getBadDetail(id: string) {
  return defHttp.get({ url: `${Api.Prefix}bad/${id}` });
}
/**
 * @description 基础资料新增或修改
 * @param id 主键ID
 */
export function updateBaseAddOrUpdatee(
  // id: string,
  data: {},
) {
  return defHttp.post({
    url: `/api/report/heatdissi/baseAddOrUpdate`, //baseAddOrUpdate/${id}
    data: data,
  });
}
/**
 * @description 不良项新增或修改
 * @param id 主键ID
 */
export function updateBadAddOrUpdate(data: {}) {
  return defHttp.post({
    url: `/api/report/heatdissi/badAddOrUpdate`,
    data: data,
  });
}
import { ContentTypeEnum } from '/@/enums/httpEnum';

export function importBase(data) {
  return defHttp.post({
    url: '/api/report/heatdissi/importBase',
    data: data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
