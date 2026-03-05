import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/information/moldledger',
}

// 分页列表
export function getMoidBillList(params) {
  return defHttp.get({ url: Api.Prefix, params });
}

// 导出Excel
export function exportMoldLedger(params) {
  return defHttp.get({
    url: Api.Prefix + '/export',
    params,
  });
}

/**
 * @description 获取模具版本或模具序号
 * @param params 查询参数
 */
export function getMoldLedgerList(params) {
  return defHttp.get({ url: Api.Prefix + '/GetMoldLedgerList', params });
}

// 获取模具料号
export function getMoldNumberList(params) {
  return defHttp.get({ url: Api.Prefix + '/GetMoldPartNumberList', params });
}

// 获取领用记录
export function getMoldReceiveHistory(params) {
  return defHttp.get({ url: Api.Prefix + '/GetMoldReceiveList', params });
}

// 获取退回记录
export function getMoldRefundHistory(params) {
  return defHttp.get({ url: Api.Prefix + '/GetMoldRefundList', params });
}

// 获取详情
export function getMoldDetail(menuId, id) {
  return defHttp.put({
    url: `${Api.Prefix}/GetDetail/${menuId}`,
    data: [id],
  });
}

// 修改基础信息
export function updateMoldInfo(data) {
  return defHttp.put({ url: Api.Prefix + '/UpdateInfo', data });
}
// 转封存
export function moldToArchive(ids) {
  return defHttp.put({ url: Api.Prefix + '/Archive', data: ids });
}
// 转报废
export function moldToScrap(ids) {
  return defHttp.put({ url: Api.Prefix + '/AlreadyScrapped', data: ids });
}
// 转在库
export function moldToStock(data) {
  return defHttp.put({ url: Api.Prefix + '/ExistStock', data });
}
// 转收货 /Information/MoldLedger/AlreadytakeDelivery
export function moldToTakeDelivery(ids) {
  return defHttp.put({ url: Api.Prefix + '/AlreadytakeDelivery', data: ids });
}
// 获取导入模板
export function downloadTemplate() {
  return defHttp.get({ url: Api.Prefix + '/download/importtemplate' });
}
/**
 * @description 导入数据
 * @param data
 */
export function importPreview(data: any) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}
// 获取导入任务
export function getImportTasks() {
  return defHttp.get({ url: Api.Prefix + '/ImportTask' });
}
// 提交导入
export function importExcel(file) {
  return defHttp.post({ url: Api.Prefix + '/ImportExcel', data: file, headers: { 'Content-Type': 'multipart/form-data' } });
}
/**
 * @description 取消导入任务
 */
export function cancelImportTask(data: any) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel`, data });
}
/**
 * @description 导入任务已阅
 */
export function importTaskRead(data: any) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead`, data });
}
/**
 * @description 获取当前导入任务数据
 */
export function importTaskData(data: any) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData/`, data });
}

// 批导保存
export function batchSave(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + '/' + batchCode });
}

// 数据备份
export function backupData(params) {
  return defHttp.post({ url: Api.Prefix + '/DataBackups', params });
}

// 操作日志 /information/moldledger/GetOperateRecordList
export function getActionLogList(params) {
  return defHttp.get({ url: Api.Prefix + '/GetOperateRecordList', params });
}

// 更新仓库地址 UpdateShippingAddress
export function updateShippingAddress(params) {
  return defHttp.put({ url: Api.Prefix + '/UpdateShippingAddress', params });
}

// 获取维修记录
export function getMoldRepairHistory(params) {
  return defHttp.get({ url: Api.Prefix + '/GetMoldRepairList', params });
}
