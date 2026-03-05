import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/CustomsAffairsMake',
  moldeRelative = '/api/Information/CustomsAffairsMoldeRelative',
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
 * 备案需求 - 导出Excel
 * @param params
 * @returns
 */
export function exportExcel(params: { identification: '1' | '2' | '3' } & Partial<Recordable>) {
  return defHttp.get({ url: Api.Prefix + '/Export', params });
}

/**
 * 获取待制作详情数据
 * @param data
 * @returns
 */
export function getUnMakeDetail(data: { ids: Array<string>; customerConfigId: string }) {
  return defHttp.put({ url: Api.Prefix + '/GetUnMakeDetail', data });
}

/**
 * 制作
 * @param data
 * @returns
 */
export function customsAffairsMake(data: any) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * 暂存
 * @param data
 * @returns
 */
export function temporaryStorag(data: any) {
  return defHttp.post({ url: Api.Prefix + '/TemporaryStorag', data });
}

/**
 * 制作修改
 * @param data
 * @returns
 */
export function updateMake(data: any) {
  return defHttp.post({ url: Api.Prefix + '/UpdateMake', data });
}

/**
 * 审核
 * @param data reviewStatus 0 不通过；1 通过
 */
export function review(data: { id: string; reviewStatus: 0 | 1; reviewRemarks: string }) {
  return defHttp.put({ url: Api.Prefix + '/Review', data });
}

/**
 * 撤回
 * @param ids
 * @returns
 */
export function bulkBackReview(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + '/BulkBackReview', data: ids });
}

/**
 * 制作转办
 */
export function bulkMakeTransfer(data: { ids: Array<string>; transferUserId: string; transferRemarks: string }) {
  return defHttp.post({ url: Api.Prefix + '/BulkMakeTransfer', data });
}

/**
 * 审核转办
 * @param data
 * @returns
 */
export function bulkReviewTransfer(data: { ids: Array<string>; transferUserId: string; transferRemarks: string }) {
  return defHttp.post({ url: Api.Prefix + '/BulkReviewTransfer', data });
}

/**
 * 导入模板下载
 * @param id 客户模版id
 * @returns
 */
export function template(id: string) {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate/${id}` });
}

/**
 * 导入
 * @param data FormData类型：file 导入文件；customerConfigId 客户模版id；makeReviewUserId 复核人id
 * @returns
 */
export function importPreview(data: FormData) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 获取当前导入任务
 */
export function importTask(data: any) {
  return defHttp.get({ url: Api.Prefix + `/ImportTask`, data });
}

/**
 * @description 获取当前导入任务数据
 */
export function importTaskData(data: any) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData`, data });
}

/**
 * @description 取消导入任务
 */
export function cancelImportTask(data: any) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel`, data });
}

/**
 * @description 导入任务 - 已阅
 */
export function importTaskRead(data: any) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead`, data });
}

/**
 * @description 保存导入的预览数据
 * @param batchCode
 */
export function saveImportData(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}` });
}

/**
 * 下载未制作数据
 * @param customerConfigId 客户模板Id
 * @returns
 */
export function downloadUnMake(data: { customerConfigId: string } & Recordable<any>) {
  return defHttp.get({ url: `${Api.Prefix}/Download/DownloadUnMake`, data: { ...data, id: data.customerConfigId } });
}

// 关务客户模板配置 开始
/**
 * 关务客户模板配置 - 分页列表
 * @param params keyword 关键字搜索
 * @returns
 */
export function getCustomsAffairsMoldeRelativeList(params: any) {
  return defHttp.get({ url: Api.moldeRelative, params });
}

/**
 * 关务客户模板配置 - 详情
 * @param id
 * @returns
 */
export function getCustomsAffairsMoldeRelativeListDetail(id: string) {
  return defHttp.get({ url: Api.moldeRelative + '/' + id });
}

/**
 * 关务客户模板配置 - 添加 关务客户模板
 * @param data
 * @returns
 */
export function addCustomsAffairsMoldeRelativeCustomsMolde(data: Array<{ moldeName: string; moldeCode: string; id?: string }>) {
  return defHttp.put({ url: Api.moldeRelative + '/AddCustomsMolde', data });
}

/**
 * 关务客户模板配置 - 修改 关务客户模板
 * @param data
 * @returns
 */
export function updateCustomsAffairsMoldeRelativeCustomsMolde(data: Array<{ id: string; immediateCustomerCodes: Array<string>; moldeJsonList: Array<any> }>) {
  return defHttp.put({ url: Api.moldeRelative + '/UpdateCustomsMolde', data });
}

/**
 * 关务客户模板配置 - 删除 关务客户模板
 * @param ids
 */
export function deleteCustomsAffairsMoldeRelativeCustomsMolde(ids: Array<string>) {
  return defHttp.delete({ url: Api.moldeRelative + '/DeleteCustomsMolde', params: { ids } });
}

/**
 * 关务客户模板配置 - 删除字段
 * @param data
 * @returns
 */
export function deleteCustomsAffairsMoldeRelativeMoldeField(data: Array<{ id: string; jsonId: string }>) {
  return defHttp.put({ url: Api.moldeRelative + '/DelectModelField', data });
}
// 关务客户模板配置 结束
