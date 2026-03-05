import { defHttp } from '/@/utils/http/axios';
import { setObjToUrlParams } from '/@/utils';
import { ContentTypeEnum } from '/@/enums/httpEnum';

// ======================== 基础路径定义 ========================
const API_BASE = '/api/Information/DrawingsReviewReq';

// ======================== 基础CRUD接口 ========================

/**
 * @description 分页查询图纸评审需求
 * @param params 查询参数
 */
export function getDrawingsReviewReqPagingList(params: any) {
  return defHttp.get({ url: API_BASE, params });
}

/**
 * @description 新增/修改图纸评审需求
 * @param data 请求体数据
 * @param params URL参数
 */
export function createOrUpdateDrawingsReviewReq(data: any, params?: any) {
  return defHttp.post({
    url: setObjToUrlParams(API_BASE, params),
    data,
  });
}

/**
 * @description 获取图纸评审需求详情
 * @param params  查询参数
 */
export function getDrawingsReviewReqDetail(params) {
  return defHttp.get({ url: `${API_BASE}/getDetail`, params });
}

// ======================== 批量操作接口 ========================

/**
 * @description 批量删除图纸评审需求
 * @param ids 主键ID数组
 */
export function bulkDeleteDrawingsReviewReq(ids: string[]) {
  return defHttp.post({ url: `${API_BASE}/BulkDelete`, data: ids });
}

/**
 * @description 批量撤回图纸评审需求
 * @param ids 主键ID数组
 */
export function bulkWithdrawDrawingsReviewReq(ids: string[]) {
  return defHttp.put({ url: `${API_BASE}/BulkWithdraw`, data: ids });
}

/**
 * @description 批量终止图纸评审需求
 * @param ids 主键ID数组
 */
export function bulkTerminationDrawingsReviewReq(ids: string[]) {
  return defHttp.put({ url: `${API_BASE}/BulkTermination`, data: ids });
}

// ======================== 导入导出接口 ========================

/**
 * @description 导出图纸评审需求Excel
 * @param params 导出参数
 */
export function exportDrawingsReviewReqExcel(params: any) {
  return defHttp.get({ url: `${API_BASE}/ExportExcel`, params });
}

/**
 * @description 下载图纸评审需求导入模板
 */
export function downloadDrawingsReviewReqTemplate() {
  return defHttp.get({ url: `${API_BASE}/Download/ImportTemplate` });
}

/**
 * @description 导入图纸评审需求Excel
 * @param file Excel文件
 */
export function importDrawingsReviewReqData(data) {
  return defHttp.post({
    url: `${API_BASE}/Import`,
    data,
    headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
  });
}

/**
 * @description 保存导入的图纸评审需求数据
 * @param batchCode 批次号
 */
export function saveImportedDrawingsReviewReq(batchCode: string) {
  return defHttp.post({
    url: `${API_BASE}/SaveImport?batchCode=${batchCode}`,
    // params: { batchCode },
  });
}

// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: API_BASE + `/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: API_BASE + `/ImportTaskRead`,
  });
}

// ======================== 流程相关接口 ========================

/**
 * @description 暂存图纸评审需求草稿
 * @param data 请求体数据
 * @param params URL参数
 */
export function saveDrawingsReviewReqDraft(data: any, params?: any) {
  return defHttp.post({
    url: setObjToUrlParams(`${API_BASE}/SaveDraft`, params),
    data,
  });
}

/**
 * @description 获取图纸评审需求节点履历
 * @param id 主键ID
 */
export function getDrawingsReviewReqNodeHistory(params) {
  return defHttp.get({
    url: `${API_BASE}/GetNodeList`,
    params,
  });
}

// ======================== 辅助功能接口 ========================

/**
 * @description 获取当前导入任务
 */
export function getDrawingsReviewReqImportTask() {
  return defHttp.get({ url: `${API_BASE}/ImportTask` });
}

/**
 * @description 获取导入任务数据
 * @param params 分页参数
 */
export function getDrawingsReviewReqImportTaskData(params: any) {
  return defHttp.get({
    url: `${API_BASE}/ImportTaskData`,
    params,
  });
}
