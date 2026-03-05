import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/CustomsAffairsFinalVersion',
}

/**
 * 获取列表
 * @param params
 * @returns
 */
export function getList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * 获取关务终版备案历史记录
 * @param params0 finalVersionType  1：内地 2：出港
 * @returns
 */
export function getFinalVersionHistory(params: { id: string; finalVersionType?: '1' | '2' }) {
  return defHttp.get({ url: Api.Prefix + '/GetFinalVersionHistory', params });
}

/**
 * 创建内地终版备案表 - 提交
 * @param data
 * @returns
 */
export function saveInland(data: any) {
  return defHttp.put({ url: Api.Prefix + '/CreateInland', data });
}

/**
 * 创建内地终版备案表 - 暂存
 * @param data
 * @returns
 */
export function temporaryStoragInland(data: any) {
  return defHttp.put({ url: Api.Prefix + '/InlandTemporaryStorag', data });
}

/**
 * 创建出港终版备案表 - 提交
 * @param data
 * @returns
 */
export function saveClearPort(data: any) {
  return defHttp.put({ url: Api.Prefix + '/CreateClearPort', data });
}

/**
 * 创建出港终版备案表 - 暂存
 * @param data
 * @returns
 */
export function temporaryStoragClearPort(data: any) {
  return defHttp.put({ url: Api.Prefix + '/ClearPortTemporaryStorag', data });
}

/**
 * 获取详情
 * @param finalVersionType 1出口内地备案表;2出港备案表
 * @param ids
 * @returns
 */
export function getDetail(finalVersionType: any, ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail?finalVersionType=' + finalVersionType, data: ids });
}

/**
 * 导出数据
 * @param data finalVersionType: 终版备案类型，1-内地，2-出港；
 * @returns
 */
export function exportExcel(data: { finalVersionType: '1' | '2' } & Partial<Recordable>) {
  return defHttp.get({ url: Api.Prefix + '/Export', data });
}

/**
 * 导入模板下载
 * @param finalVersionType: 终版备案类型，1-内地，2-出港；
 * @returns
 */
export function template(finalVersionType: '1' | '2') {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate/${finalVersionType}` });
}

/**
 * 导入
 * @param data file 导入文件；finalVersionType: 终版备案类型，1-内地，2-出港；
 * @returns
 */
export function importPreview(data: any) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 获取当前导入任务
 * @param finalVersionType: 终版备案类型，1-内地，2-出港；
 */
export function importTask(finalVersionType: '1' | '2') {
  return defHttp.get({ url: Api.Prefix + `/ImportTask/${finalVersionType}` });
}

/**
 * @description 获取当前导入任务数据
 */
export function importTaskData(data: { finalVersionType: '1' | '2'; currentPage: number; pageSize: number }) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData`, data });
}

/**
 * @description 取消导入任务
 * @param finalVersionType: 终版备案类型，1-内地，2-出港；
 */
export function cancelImportTask(finalVersionType: '1' | '2') {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel/${finalVersionType}` });
}

/**
 * @description 导入任务 - 已阅
 * @param finalVersionType: 终版备案类型，1-内地，2-出港；
 */
export function importTaskRead(finalVersionType: '1' | '2') {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead/${finalVersionType}` });
}

/**
 * @description 保存导入的预览数据
 * @param batchCode
 * @param finalVersionType: 终版备案类型，1-内地，2-出港；
 */
export function saveImportData(batchCode: string, finalVersionType: '1' | '2') {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}/${finalVersionType}` });
}
