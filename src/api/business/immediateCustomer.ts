import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/partnumberapply/ImmediateCustomer/',
  PrefixBatch = '/api/Information/PartNumberApply/Batch/',
}

/**
 * @description 直接客户料号信息 - 获取列表数据
 * @param params
 */
export function getList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 下载导入模板
 */
export function template() {
  return defHttp.get({ url: Api.Prefix + `download/importtemplate` });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 导入数据
 * @param data
 */
export function importPreview(data: any) {
  return defHttp.post({ url: Api.Prefix + `import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 获取当前导入任务
 */
export function importTask(data: any) {
  return defHttp.get({ url: Api.Prefix + `ImportTask`, data });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 获取当前导入任务数据
 */
export function importTaskData(data: any) {
  return defHttp.get({ url: Api.Prefix + `ImportTaskData`, data });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 取消导入任务
 */
export function cancelImportTask(data: any) {
  return defHttp.post({ url: Api.Prefix + `ImportTaskCancel`, data });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 导入任务已阅
 */
export function importTaskRead(data: any) {
  return defHttp.post({ url: Api.Prefix + `ImportTaskRead`, data });
}

/**
 * @description 直接客户料号信息 - 批量导入 - 保存导入的预览数据
 * @param batchCode
 */
export function saveImportData(batchCode: string) {
  return defHttp.post({ url: `${Api.Prefix}${batchCode}` });
}

/**
 * @description 直接客户料号信息 - 批量导出
 */
export function exportExcel(params: any) {
  return defHttp.get({ url: Api.Prefix + `exportexcel`, params });
}

/**
 * @description 直接客户料号信息 - 更改数据
 * @param data
 */
export function updateData(data: any) {
  return defHttp.put({ url: `${Api.Prefix}${data.Id}`, data });
}

/**
 * @description 直接客户料号信息 - 批量获取料号信息
 */
export function batchGetDetail(data: { isComplete: boolean; InsidePartNumbers: Array<string> }) {
  return defHttp.post({ url: `${Api.Prefix}SelectMultiple`, data });
}

/**
 * @description 批量修改直接客户料号
 * @param data
 */
export function updateImmediateCustomer(data: Array<any>) {
  return defHttp.put({ url: `${Api.PrefixBatch}UpImmediateCustomer`, data });
}
