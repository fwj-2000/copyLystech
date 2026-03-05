import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/mrbapply',
}

// 查询 MRB 申请分页列表
export function getMrbapply(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 查询 MRB审批列表
export function getAuditPage(data) {
  return defHttp.get({ url: Api.Prefix + '/auditPage', data });
}

// 新增 MRB 申请
export function addMrbapply(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 获取审批单模板列表
export function getFlowTemplateList() {
  return defHttp.get({ url: Api.Prefix + '/getflowtemplist' });
}

// 获取 MRB 申请详情
export function getMrbapplyDetail(id: string) {
  return defHttp.get({ url: `${Api.Prefix}/detail/${id}` });
}

// 导出 MRB 申请 Excel
export function exportMrbapply(data) {
  return defHttp.get({ url: Api.Prefix + '/export', data });
}

// 导出审批单详情 Excel
export function exportMrbapplyDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/exportdetail', data });
}

// 提交 MRB 申请
export function commitMrbapply(id: string) {
  return defHttp.post({ url: `${Api.Prefix}/commitapply/${id}` });
}

// 批量撤回 MRB 申请
export function bulkWithdraw(data: string[]) {
  return defHttp.post({ url: Api.Prefix + '/bulk/withdraw', data });
}

// 审核 MRB 申请
export function auditMrbapply(data) {
  return defHttp.post({ url: Api.Prefix + '/audit', data });
}

// 提交执行情况说明
export function submitExecutionNote(data) {
  return defHttp.post({ url: Api.Prefix + '/executionnote', data });
}

// 审核执行情况
export function auditExecution(data) {
  return defHttp.post({ url: Api.Prefix + '/executionaudit', data });
}

// 综合查询 MRB 申请
export function integratedQuery(data) {
  return defHttp.get({ url: Api.Prefix + '/integratedquery', data });
}

// 导出综合查询 Excel
export function exportIntegratedQuery(data) {
  return defHttp.get({ url: Api.Prefix + '/exportintegrated', data });
}

// 获取评审意见
export function getReviewComments(data) {
  return defHttp.get({ url: Api.Prefix + '/reviewcomments', data });
}

// 导出评审意见 Excel
export function exportReviewComments(data) {
  return defHttp.get({ url: Api.Prefix + '/exportreviewcomments', data });
}

// 获取耗时统计
export function getTakeTime(data) {
  return defHttp.get({ url: Api.Prefix + '/taketime', data });
}

// 导出耗时统计 Excel
export function exportTakeTime(data) {
  return defHttp.get({ url: Api.Prefix + '/exporttaketime', data });
}

// 获取重复问题
export function getSameProblem(data) {
  return defHttp.get({ url: Api.Prefix + '/sameproblem', data });
}

// 导出重复问题 Excel
export function exportSameProblem(data) {
  return defHttp.get({ url: Api.Prefix + '/exportsameproblem', data });
}

// 批量删除
export function mrbBulkDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
