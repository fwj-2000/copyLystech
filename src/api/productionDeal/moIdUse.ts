import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/information/moldreceiveapply',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getMoldApplyList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 新增
 * @param params 查询参数
 * @param data 请求体数据
 */
export function applyMoId(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * @description 导出Excel
 * @param params 查询参数
 */
export function exportExcel(params) {
  return defHttp.get({ url: `${Api.Prefix}/export`, params });
}

/**
 * @description 获取节点履历记录
 * @param params 查询参数
 */
export function getNodeList(params) {
  return defHttp.get({ url: `${Api.Prefix}/getnodelist`, params });
}

/**
 * @description 获取当前导入任务
 * @param params 查询参数
 */
export function getImportTask(params) {
  return defHttp.get({ url: `${Api.Prefix}/importtask`, params });
}

/**
 * @description 获取当前导入任务数据
 * @param params 查询参数
 */
export function getImportTaskData(params) {
  return defHttp.get({ url: `${Api.Prefix}/importtaskdata`, params });
}

/**
 * @description 获取打印详情
 * @param data 请求体数据
 */
export function getPrintDetail(data) {
  return defHttp.put({ url: `${Api.Prefix}/getprintdetail`, data });
}

/**
 * @description 详情
 * @param data 请求体数据
 */
export function getDetail(data) {
  return defHttp.put({ url: `${Api.Prefix}/getdetail`, data });
}

/**
 * @description 生成
 * @param params 查询参数
 * @param data 请求体数据
 */
export function generateMoid(params, data) {
  return defHttp.put({ url: `${Api.Prefix}/generateapply`, params, data });
}

/**
 * @description 生成暂存
 * @param params 查询参数
 * @param data 请求体数据
 */
export function generateTempStorage(data) {
  return defHttp.put({ url: `${Api.Prefix}/generatetemporarystorage`, data });
}

/**
 * @description 新增暂存
 * @param params 查询参数
 * @param data 请求体数据
 */
export function addTempStorage(data) {
  return defHttp.put({ url: `${Api.Prefix}/temporarystorage`, data });
}

/**
 * @description 取消当前导入任务
 */
export function cancelImportTask() {
  return defHttp.post({ url: `${Api.Prefix}/ImportTaskCancel` });
}

/**
 * @description 已阅
 */
export function readImportTask() {
  return defHttp.post({ url: `${Api.Prefix}/ImportTaskRead` });
}

/**
 * @description 导入excel
 * @param data 文件数据
 */
export function importExcel(data) {
  return defHttp.post({ url: `${Api.Prefix}/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 批导保存
 * @param batchCode 批次号
 * @param menuId 菜单Id
 */
export function saveBatchImport(batchCode) {
  return defHttp.post({ url: `${Api.Prefix}/${batchCode}` });
}

/**
 * @description 批量终止
 * @param data 主键Id集
 */
export function bulkBackTermination(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackTermination`, data });
}

/**
 * @description 批量撤回
 * @param data 主键Id集
 */
export function bulkBackReview(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackReview`, data });
}

/**
 * @description 批量删除
 * @param data 主键Id集
 */
export function bulkBackDelete(data) {
  return defHttp.put({ url: `${Api.Prefix}/BulkBackDeleteNo`, data });
}

/**
 * @description 模板下载
 */
export function downloadTemplate() {
  return defHttp.get({ url: `${Api.Prefix}/download/importtemplate` });
}

/**
 * @description 獲取工單列表
 * /information/moldreceiveapply/GetWoList
 */
export function getWorkOrderList(data) {
  return defHttp.get({ url: `${Api.Prefix}/GetWoList`, data });
}
