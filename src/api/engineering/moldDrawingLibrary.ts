import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/MoldApply',
}

/**
 * 模具图纸 - 节点详情
 * @param data
 * @returns
 */
export function getNodeList(data: any) {
  return defHttp.get({
    url: Api.Prefix + `/GetMoldDrawingNodeList`,
    data,
  });
}

/**
 * 模具图纸维护 - 列表
 * @param data
 */
export function getMoldDrawingUploadPage(data: any) {
  return defHttp.get({
    url: Api.Prefix + `/MoldDrawingUploadPage`,
    data,
  });
}

/**
 * 模具图纸维护 - 详情
 * @param ids
 * @returns
 */
export function getMoldDrawingDetail(ids: Array<string>) {
  return defHttp.post({
    url: Api.Prefix + `/GetMoldDrawingDetail`,
    data: ids,
  });
}

/**
 * 模具图纸维护 - 检查是否可以创建
 * @param id 图纸数据ID
 * @returns
 */
export function checkCreateMoldDrawing(id: string) {
  return defHttp.get({
    url: Api.Prefix + `/CheckCreateMoldDrawing`,
    data: { id },
  });
}

/**
 * 模具图纸维护 - 提交/上传
 * @param data 提交的模具图纸数据
 * @param data.id 模具申请ID
 * @param data.moldDrawings 模具图纸数据
 * @param data.moldDrawings.fileName 文件名
 * @param data.moldDrawings.filePath 文件路径
 * @returns
 */
export function createMoldDrawing(data: { id: string; moldDrawings: Array<{ fileName: string; filePath: string }> }) {
  return defHttp.post({
    url: Api.Prefix + `/CreateMoldDrawing`,
    data,
  });
}

/**
 * 模具图纸维护 - 重新提交/上传
 * @param data
 * @returns
 */
export function resubmitMoldDrawing(data: { id: string; moldDrawings: Array<{ fileName: string; filePath: string }> }) {
  return defHttp.post({
    url: Api.Prefix + `/ResubmitMoldDrawing`,
    data,
  });
}

/**
 * 模具图纸维护 - 撤回
 * @param ids 模具图纸数据ID
 */
export function bulkMoldDrawingWithdraw(ids: Array<string>) {
  return defHttp.post({
    url: Api.Prefix + `/bulk/moldDrawingWithdraw`,
    data: ids,
  });
}

/**
 * 模具图纸维护 - 批量删除
 * @param ids 模具图纸数据ID
 * @returns
 */
export function bulkMoldDrawingDelete(ids: Array<string>) {
  return defHttp.post({
    url: Api.Prefix + `/bulk/moldDrawingDelete`,
    data: ids,
  });
}

/**
 * 模具图纸审核 - 列表
 * @param data
 * @param data.type 0：待审核 1：已审核
 * @returns
 */
export function getMoldDrawingAuditPage(data: { type: '0' | '1' } & Recordable<any>) {
  return defHttp.get({
    url: Api.Prefix + `/MoldDrawingAuditPage`,
    data,
  });
}

/**
 * 模具图纸审核 - 驳回
 * @param data
 * @param data.ids 模具图纸审核ID
 * @param data.rejectRemark 驳回原因
 * @returns
 */
export function bulkMoldDrawingAuditReject(data: { ids: Array<string>; rejectRemark: string }) {
  return defHttp.post({
    url: Api.Prefix + `/bulk/moldDrawingAuditReject`,
    data,
  });
}

/**
 * 模具图纸审核 - 同意
 * @param ids 模具图纸审核ID
 * @returns
 */
export function bulkMoldDrawingAuditAgree(ids: Array<string>) {
  return defHttp.post({
    url: Api.Prefix + `/bulk/moldDrawingAuditAgree`,
    data: ids,
  });
}

/**
 * 模具图纸库 - 列表
 * @param data
 * @returns
 */
export function getMoldDrawingPage(data: any) {
  return defHttp.get({
    url: Api.Prefix + `/MoldDrawingPage`,
    data,
  });
}

/**
 * 模具图纸库 - 变更文件状态
 * @param data
 * @param data.ids 模具图纸数据ID
 * @param data.status 状态 1：启用 2：禁用 3: 废弃
 * @param data.reason 变更原因
 * @returns
 */
export function changeMoldDrawingFileStatus(data: { ids: Array<string>; drawingStatus: '1' | '2' | '3'; reason: string }) {
  return defHttp.post({
    url: Api.Prefix + `/bulk/moldDrawingUpdateFileStatus`,
    data,
  });
}

/**
 * 模具图纸库 - 操作记录
 * @param data
 * @returns
 */
export function getDrawingOperateRecord(data: { id: string } & Recordable<any>) {
  return defHttp.get({
    url: Api.Prefix + `/GetDrawingOperateRecord`,
    data,
  });
}
