import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/CustomsAffairsReview',
}

// 分页列表
export function getCsAffairsReviewList(data) {
  return defHttp.get({ url: Api.Prefix, params: data });
}

// 导出Excel
export function exportCsAffairsReview(data) {
  return defHttp.get({ url: Api.Prefix + '/Export', params: data });
}

// 获取详情
export function getCsAffairsReviewDetail(ids) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail', data: ids });
}

// 审核操作
export function reviewCsAffairs(data) {
  return defHttp.put({ url: Api.Prefix + '/Review', data });
}

/**
 * 转办
 * @param data
 */
export function bulkTransfer(data: any) {
  return defHttp.put({ url: Api.Prefix + '/BulkTransfer', data });
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
 * 驳回
 * @param data
 * @param data.ids 数据Id
 * @param data.rejectRemark 驳回原因
 * @returns
 */
export function bulkReject(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/Reject', data });
}

/**
 * 退回修改
 * @param data
 */
export function bulkReturnUpdate(data: { ids: Array<string>; engineering: 0 | 1; engineeringRemarks: string; produce: 0 | 1; produceRemarks: string }) {
  return defHttp.put({ url: Api.Prefix + '/BulkReturnUpdate', data });
}

/**
 * 获取审批历史记录
 * @param data id:交付中心关务主键Id；reviewType: 审批类型 `1`为`工程资料`,`2`为`生产资料`
 */
export function getReviewHistory(data: { id: string; reviewType: '1' | '2' }) {
  return defHttp.get({ url: Api.Prefix + '/GetReviewHistory', params: data });
}

/**
 * 导出工程备案资料
 * @param data
 * @returns
 */
export function engineeringExport(ids: Array<string>) {
  return defHttp.get({ url: Api.Prefix + '/EngineeringExport', params: { id: ids.join(',') } });
}

/**
 * 导出生产备案资料
 * @param ids
 * @returns
 */
export function produceExport(ids: Array<string>) {
  return defHttp.get({ url: Api.Prefix + '/ProduceExport', params: { id: ids.join(',') } });
}

/**
 * 催办
 * @param data
 * @param data.id 数据Id
 * @param data.pdPersonIds 工程负责人Id列表
 * @param data.produceCreateIds 生产负责人Id列表
 * @returns
 */
export function bulkUrge(data: Array<{ id: string; pdPersonIds?: Array<string>; produceCreateIds?: Array<string> }>) {
  return defHttp.post({ url: Api.Prefix + '/bulk/Expedite', data });
}
