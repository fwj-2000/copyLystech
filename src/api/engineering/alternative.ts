import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/AltMaterial',
}

/**
 * 替代料维护 - 列表
 * @param params
 */
export function getList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * 替代料维护 - 保存
 * @param data
 */
export function save(data: any) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * 批量删除
 * @param ids
 * @returns
 */
export function bulkDelete(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + `/bulk/delete`, data: ids });
}

/**
 * 提交
 * @param ids
 */
export function commit(ids: any) {
  return defHttp.post({ url: Api.Prefix + `/Commit`, data: ids });
}

/**
 * 撤回
 * @param ids
 * @returns
 */
export function withdraw(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + `/Withdraw`, data: ids });
}

/**
 * 驳回
 * @param data
 * @returns
 */
export function reject(data: { rejectRemark: string; ids: Array<string> }) {
  return defHttp.post({ url: Api.Prefix + `/Reject`, data });
}

/**
 * 终止
 * @param data
 * @returns
 */
export function stop(data: { ids: Array<string>; remark: string }) {
  return defHttp.post({ url: Api.Prefix + `/Stop`, data });
}

/**
 * 变更记录
 * @param id
 * @returns
 */
export function getUpdateHis(id: string) {
  return defHttp.get({ url: Api.Prefix + `/UpdateHis`, params: { id } });
}

/**
 * 导出
 * @param data
 * @returns
 */
export function exportExcel(data: any) {
  return defHttp.get({ url: Api.Prefix + `/ExportExcel`, data, responseType: 'blob' });
}

/**
 * @description 下载导入模板
 */
export function template() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 获取当前导入任务
 */
export function importTask(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportTask`, data });
}

/**
 * @description 获取当前导入任务数据
 */
export function importTaskData(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData`, data });
}

/**
 * @description 取消导入任务
 */
export function cancelImportTask(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel`, data });
}

/**
 * @description 导入任务 - 已阅
 */
export function importTaskRead(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead`, data });
}

/**
 * @description 保存导入的预览数据
 * @param batchCode
 */
export function saveImportData(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}` });
}
