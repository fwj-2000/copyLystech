/**
 * 模具维修与异常申请 接口
 */

import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/moldrepairapply',
  reviewPrefix = '/api/Information/moldrepairreview',
}

/**
 * 模具维修申请 分页列表接口 /api/Information/moldrepairapply
 * @param params identification: 标识, 21审核待处理，22审核已处理，31判定待处理，32判定已处理，41维修记录待处理，42维修记录已处理，5模具确认
 * @returns
 */
export function getMoldBusinessMaintenanceList(params: { identification?: '21' | '22' | '31' | '32' | '41' | '42' | '5' } & Partial<Record<string, any>>) {
  const query = { ...params };
  // 【入库日期(inboundDate)】【需求返厂日期(demandReturnDate)】【创建时间(creatorTime)】等使用日期范围筛选时，都拆分为两个字段，在字段后面加一个 from   和 to
  const rangeDateFields = ['inboundDate', 'demandReturnDate', 'creatorTime'];
  rangeDateFields.forEach(field => {
    if (query[field] && Array.isArray(query[field]) && query[field].length === 2) {
      query[field + 'From'] = query[field][0];
      query[field + 'To'] = query[field][1];
      delete query[field];
    }
  });
  return defHttp.get({ url: Api.Prefix, params: query });
}

/**
 * 模具维修申请 导出 /api/Information/moldrepairapply/export
 * @param params identification: 标识, 11维修待处理，12维修已处理，21异常待处理，22异常已处理，31判定待处理，32判定已处理，41维修记录待处理，42维修记录已处理，5模具确认
 * @returns
 */
export function exportExcel(params: { identification?: '21' | '22' | '31' | '32' | '41' | '42' | '5' } & Partial<Record<string, any>>) {
  return defHttp.get({ url: Api.Prefix + '/export', params });
}

/**
 * 模具维修申请 获取节点记录 /api/Information/moldrepairapply/getnodelist
 * @param params
 * @returns
 */
export function getnodelist(params: { id: string }) {
  return defHttp.get({ url: Api.Prefix + '/getnodelist', params });
}

/**
 * 模具维修申请 维修类型变更日志 /api/Information/moldrepairapply/changelog
 * @param params
 * @returns
 */
export function getChangeLog(params: { repairId: string; currentPage: number; pageSize: number }) {
  return defHttp.get({ url: Api.Prefix + '/changelog', params });
}

/**
 * 模具维修申请 模具料号列表 /api/Information/moldrepairapply/GetMoldNoList
 * @param params
 * @returns
 */
export function getMoldNoList(params: { moldPartNumber: string; pageSize: number }) {
  return defHttp.get({ url: Api.Prefix + '/GetMoldNoList', params });
}

/**
 * 模具维修申请 获取详情 /api/Information/moldrepairapply/getdetail
 * @param applyNo
 * @returns
 */
export function getDetail(applyNo) {
  return defHttp.get({ url: Api.Prefix + '/details?applyNo=' + applyNo });
}

/**
 * 模具维修申请 获取详情 /api/Information/moldrepairapply/getdetail
 * @param id
 * @returns
 */
export function getDetailById(id) {
  return defHttp.get({ url: Api.Prefix + '/detail?id=' + id });
}

/**
 * 模具维修申请 - 新增 维修/异常 申请 /api/Information/moldrepairapply
 * @param data demandType: 1维修，2异常， list[index][field]：具体表单内容键值对
 * @returns
 */
export function addMoldBusinessMaintenance(data: any) {
  return defHttp.put({ url: Api.Prefix, data });
}

/**
 * 模具维修申请 暂存 /api/Information/moldrepairapply/temporarystorage
 * @param data demandType: 1维修，2异常， list[index][field]：具体表单内容键值对
 * @returns
 */
export function temporaryStorage(data: any) {
  return defHttp.put({ url: Api.Prefix + '/temporarystorage', data });
}

/**
 * 模具维修申请 免费改付费 付费维修 /api/Information/moldrepairapply/payrepair
 * @param data fileList 文件列表；changeReason 变化原因；repairId 维修单ID
 * @returns
 */
export function payrepair(data: FormData) {
  return defHttp.put({ url: Api.Prefix + '/payrepair', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * 模具维修申请 终止维修 /api/Information/moldrepairapply/endrepair
 * @param data fileList 文件列表；changeReason 变化原因；repairId 维修单ID;dealType 模具处理方式；sealingDuration: 封存时长；otherTypeDescribe: 其他原因描述
 * @returns
 */
export function endrepair(data: FormData) {
  return defHttp.put({ url: Api.Prefix + '/endrepair', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * 模具维修申请 批量删除 /api/Information/moldrepairapply/delete
 * @param ids 批量删除的数据id
 * @returns
 */
export function batchDelete(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + '/delete', data: ids });
}

/**
 * 模具维修申请 批量撤回单据 /api/Information/moldrepairreview/bulkbackreview
 * @param idList
 * @returns
 */
export function bulkbackreview(idList: Array<string>) {
  return defHttp.put({ url: Api.reviewPrefix + '/bulkbackreview', data: idList });
}

/**
 * 模具维修申请 批量终止单据 /api/Information/moldrepairreview/bulktermination
 * @param data
 * @returns
 */
export function bulktermination(data: { ids: Array<string>; terminationRemarks: string }) {
  return defHttp.put({ url: Api.reviewPrefix + '/bulktermination', data });
}

/**
 * 模具维修申请 批量同意. 异常和维修：生产员提交审核、组长同意、主管 /api/Information/moldrepairreview/bulkbackreview
 * @param data
 * @returns
 */
export function bulkagree(data: { ids: Array<string>; isAddSignature: boolean; signatureComment: string }) {
  return defHttp.put({ url: Api.reviewPrefix + '/bulkagree', data });
}

/**
 * 模具维修申请 批量驳回 /api/Information/moldrepairreview/bulkreject
 * @param data
 * @returns
 */
export function bulkreject(data: { list: Array<{ id: string; rejectRemark: string }> }) {
  return defHttp.put({ url: Api.reviewPrefix + '/bulkreject', data });
}

/**
 * 模具维修申请 判定 /api/Information/moldrepairreview/judge
 * @param data
 * @returns
 */
export function judge(data: any) {
  return defHttp.post({ url: Api.reviewPrefix + '/judge', data });
}

/**
 * 模具维修申请 修改代维修供应商 /api/Information/moldrepairapply/repairagent
 * @param list
 * @returns
 */
export function repairagent(list: Array<{ id: string; repairSupplier: string }>) {
  return defHttp.put({ url: Api.Prefix + '/repairagent', data: { list } });
}

/**
 * 模具维修申请 确认接受 /api/Information/moldrepairapply/confirmreceive
 * @param ids
 * @returns
 */
export function confirmreceive(ids: Array<string>) {
  return defHttp.post({ url: Api.reviewPrefix + '/confirmreceive', data: ids });
}

/**
 * 模具维修申请 上传图纸 /api/Information/moldrepairapply/uploaddrawings
 * @param data
 * @returns
 */
export function uploaddrawings(data: any) {
  return defHttp.post({ url: Api.Prefix + `/uploaddrawings`, data });
}

/**
 * 邮件发送列表
 * @param ids
 * @returns
 */
export function emaildatalist(ids: Array<string>) {
  return defHttp.get({ url: Api.Prefix + '/emaildatalist', params: { ids: ids.join(',') } });
}

/**
 * 邮件发送
 * @param data
 * @returns
 */
export function emailsend(data: any) {
  return defHttp.put({ url: Api.Prefix + `/emailsend`, data });
}
