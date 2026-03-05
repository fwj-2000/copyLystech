import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/CustomsAffairsApply',
  InfoPrefix = '/api/Information/CustomsAffairsInfo',
}

// 备案需求 开始
/**
 * 备案需求 - 获取列表
 * @param params
 * @returns
 */
export function getList(params: { identification: '1' | '2' } & Partial<Recordable>) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * 备案需求 - 导出Excel
 * @param params
 * @returns
 */
export function exportExcel(params: { identification: '1' | '2' } & Partial<Recordable>) {
  return defHttp.get({ url: Api.Prefix + '/Export', params });
}

/**
 * 备案需求 - 获取详情
 * @param id
 * @returns
 */
export function getDetail(id: string) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

/**
 * 备案需求 - 获取节点履历记录
 * @param params
 * @returns
 */
export function getNodeList(params: any) {
  return defHttp.get({ url: Api.Prefix + '/GetNodeList', params });
}

/**
 * 备案需求 - 批量获取详情
 * @param ids
 * @returns
 */
export function getDetailByIds(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail', data: ids });
}

/**
 * 备案需求 - 创建备案需求
 * @param data
 * @returns
 */
export function createApply(data: any) {
  return defHttp.put({ url: Api.Prefix + '/CreateApply', data });
}

/**
 * 备案需求 - 新增
 * @param data
 * @returns
 */
export function save(data: any) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * 备案需求 - 暂存备案需求
 * @param data
 * @returns
 */
export function temporaryStorage(data: any) {
  return defHttp.post({ url: Api.Prefix + '/TemporaryStorage', data });
}

/**
 * @description 备案需求 - 下载导入模板
 */
export function template() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

/**
 * @description 备案需求 - 导入数据
 * @param data
 */
export function importPreview(data: any) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 备案需求 - 获取当前导入任务
 */
export function importTask(data: any) {
  return defHttp.get({ url: Api.Prefix + `/ImportTask`, data });
}

/**
 * @description 备案需求 - 获取当前导入任务数据
 */
export function importTaskData(data: any) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData`, data });
}

/**
 * @description 备案需求 - 取消导入任务
 */
export function cancelImportTask(data: any) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel`, data });
}

/**
 * @description 备案需求 - 导入任务已阅
 */
export function importTaskRead(data: any) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead`, data });
}

/**
 * @description 备案需求 - 保存导入的预览数据
 * @param batchCode
 * @param menuId
 */
export function saveImportData(batchCode: string, menuId: string) {
  return defHttp.post({ url: `${Api.Prefix}/${batchCode}/${menuId}` });
}

/**
 * 备案需求 - 批量撤回
 * @param ids
 * @returns
 */
export function bulkBackReview(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + '/BulkBackReview', data: ids });
}

/**
 * 备案需求 - 批量终止
 * @param params
 * @returns
 */
export function bulkBackTermination(params: { ids: Array<string>; terminationRemarks: string }) {
  return defHttp.put({ url: Api.Prefix + '/BulkBackTermination', data: params });
}

/**
 * 备案需求 - 批量删除
 * @param ids
 * @returns
 */
export function bulkDelete(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data: ids });
}

// 备案需求 结束

// 备案资料 开始
/**
 * 备案资料 - 获取分页列表
 * @param params
 * @returns
 */
export function getCustomsAffairsInfoList(params: any) {
  return defHttp.get({ url: Api.InfoPrefix, params });
}

/**
 * 备案资料 - 获取详情
 * @param id
 * @returns
 */
export function getCustomsAffairsInfoDetail(id: number) {
  return defHttp.get({ url: Api.InfoPrefix + '/' + id });
}

/**
 * 备案资料 - 下载
 * @param params
 * @returns
 */
export function exportCustomsAffairsInfo(params: any) {
  return defHttp.get({ url: Api.InfoPrefix + '/Export', params });
}

// 备案资料 结束
