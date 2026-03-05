import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 获取图纸评审查询列表
// /api/Information/drawingsreview/applypage
export function getDrawingsReviewApplypage(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreview/applypage`, data });
}

// 图纸处理
// /api/Information/drawingsreview/dfmpage
export function getDrawingsReviewDfmpage(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreview/dfmpage`, data });
}
// 批量保存评审意见
// api/Information/drawingsreview/Review/ResultBatch
export function saveReviewResultBatch(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/Review/ResultBatch`, data });
}

// 删除图纸评审
// /api/Information/drawingsreview/review/delete
export function deleteDrawingsReview(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/delete`, data });
}

// 上传图纸
export function engineeringDocApply(data) {
  return defHttp.post({
    url: Api.Prefix + `/engineeringdocapply`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

export function saveEngineeringdocapply(data) {
  return defHttp.post({ url: Api.Prefix + `/engineeringdocapply/Save`, data });
}

// 分页列表
export function getEngineeringdocapply(data) {
  return defHttp.get({ url: Api.Prefix + `/engineeringdocapply`, data });
}

// 撤回
export function withdraw(data) {
  return defHttp.post({ url: Api.Prefix + `/engineeringdocapply/withdraw`, data });
}

// 工程资料发起ECN
// Information/EngineeringDocApply/CanMakeECN
export function canMakeECN(data) {
  return defHttp.post({ url: Api.Prefix + `/EngineeringDocApply/CanMakeECN`, data });
}

/**
 * 重新上传
 * @param formData ids：Array<string>，主键id集；fileList，file，文件
 * @returns
 */
export function reUpload(formData: FormData) {
  return defHttp.post({
    url: Api.Prefix + `/EngineeringDocApply/ReUpload`,
    data: formData,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/** 工程资料维护 - 新增半成品料号工程图纸 */
export function createSemiFinishedProducts(data: any) {
  return defHttp.post({
    url: Api.Prefix + `/EngineeringDocApply/CreateSemiFinishedProducts`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/** 工程资料维护 - 重新上传半成品料号工程图纸 */
export function semiFinishedProductsReUpload(data: any) {
  return defHttp.post({
    url: Api.Prefix + `/EngineeringDocApply/SemiFinishedProductsReUpload`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * 重新提交
 * @param data id: 主键id；filePath：文件路径；fileName：文件名
 * @returns
 */
export function updateEngineeringDoc(data: Array<{ id: string; filePath: string; fileName: string }>) {
  return defHttp.post({ url: Api.Prefix + `/EngineeringDocApply/UpdateEngineeringDoc`, data });
}

/**
 * 重新上传获取详情
 * @param ids
 * @returns
 */
export function getDetailByReUpload(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + `/EngineeringDocApply/GetDetail`, data: ids });
}

/**
 * 获取操作记录
 * @param data
 * @returns
 */
export function getOperateRecord(data: { id: string; currentPage: number; pageSize: number }) {
  return defHttp.get({ url: Api.Prefix + `/EngineeringDocApply/GetOperateRecord`, data });
}

// 图纸批量评审
// /Information/drawingsreview/review/resultbatch
export function batchResult(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/resultbatch`, data });
}
// 图纸评审
// /Information/drawingsreview/review/result
export function commitResult(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/result`, data });
}
// 图纸评审驳回
// /Information/drawingsreview/review/reject
export function rejectResult(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/reject`, data });
}

// Information/drawingsreview/usehistory
export function getUseHistory(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreview/usehistory`, data });
}
