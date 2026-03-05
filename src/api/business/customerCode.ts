import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/customer',
}
// /api/Information/customer

//查询列表
export function getCustomerCode(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//通过ID查询
export function getCustomerCodeById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//删除
export function deleteCustomerCode(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function bulkDeleteCustomerCode(data) {
  return defHttp.post({ url: Api.Prefix + `/BulkDelete`, data });
}

//新增
export function addCustomerCode(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateCustomerCode(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//导出Excel
export function exportCustomerCodeExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 获取SAP客户代码集合
export function getCustomerCodeByCode(code = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetCustomerCodeByCode/${code}` });
}

//获取终端客户结合
export function getTerminalCustomer(code = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetTerminalCustomer/${code}` });
}

//同步SAP
export function InsertFromSAP() {
  return defHttp.post({ url: Api.Prefix + `/InsertFromSAP` });
}

export function importExcel(data) {
  return defHttp.post({
    url: Api.Prefix + `/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

export function saveBatchData(batchCode) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}` });
}

export function getTemplateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

export function getImportTask() {
  return defHttp.get({ url: Api.Prefix + `/ImportTask` });
}

export function getImportTaskData(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData`, data });
}

export function cancelImportTask() {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel` });
}

export function importTaskRead() {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead` });
}

/**
 * 获取直接客户标签图
 * @param data id: 客户信息主键Id; sceneType: 场景类型
 * @returns
 */
export function getCustomerLabelImageList(data: { id: string; sceneType: string; currentPage: number; pageSize: number }) {
  return defHttp.get({ url: Api.Prefix + `/GetCustomerLabelImageList`, data });
}

/**
 * 获取直接客户场景类型
 * @param id 客户信息主键Id
 * @returns
 */
export function getCustomerSceneTypeList(id: string) {
  return defHttp.get({ url: Api.Prefix + `/GetCustomerSceneTypeList/${id}` });
}

/**
 * 上传客户标签图片
 * @param id 客户信息主键Id
 * @param sceneType 场景类型
 * @returns
 */
export function uploadLabelImage(id: string, sceneType: string, data: Array<{ fileName: string; filePath: string }>) {
  return defHttp.post({ url: Api.Prefix + `/UploadLabelImage/${id}/${sceneType}`, data });
}

/**
 * 启用客户标签图片
 * @param id 客户标签图片主键Id
 * @param sceneType 场景类型
 * @returns
 */
export function enableLabelImage(id: string, sceneType: string) {
  return defHttp.post({ url: Api.Prefix + `/EnableLabelImage/${id}/${sceneType}` });
}

/**
 * 禁用客户标签图片
 * @param id 客户标签图片主键Id
 * @returns
 */
export function disableLabelImage(id: string) {
  return defHttp.post({ url: Api.Prefix + `/DisableLabelImage/${id}` });
}

/**
 * 删除客户标签图片
 * @param id 客户标签图片主键Id
 * @returns
 */
export function deleteLabelImage(id: string) {
  return defHttp.delete({ url: Api.Prefix + `/DeleteLabelImage/${id}` });
}
