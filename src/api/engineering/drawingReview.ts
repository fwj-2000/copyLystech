/*
 * @Author: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @Date: 2024-07-15 08:41:30
 * @LastEditors: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @LastEditTime: 2024-09-11 11:36:45
 * @FilePath: \lydc.server.web\src\api\engineering\drawingReview.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
}

// 图纸需求未评审列表
// /api/Information/DrawingsReview/Unreviewed
export function getDrawingsReviewUnreviewedList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/Unreviewed`, params });
}

// 图纸评审已评审列表
// /api/Information/DrawingsReview
export function getDrawingsReviewList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview`, params });
}

// 图纸评审未评审导出
// /api/Information/DrawingsReview/ExportExcel/Unreviewed
export function exportDrawingsReviewUnreviewedList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/ExportExcel/HandlePage`, params });
}

export function exportExportExcelSearchPageList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/ExportExcel/SearchPage`, params });
}
export function exportExportExcelApplyPageList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/ExportExcel/ApplyPage`, params });
}
// 图纸评审已评审导出
// /api/Information/DrawingsReview/ExportExcel/Reviewed
export function exportDrawingsReviewList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/ExportExcel/Reviewed`, params });
}

// 图纸评审记录
// /api/Information/DrawingsReview/ReviewList
export function getDrawingsReviewRecord(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/ReviewList`, params });
}
// 图纸评审详情
// /api/Information/DrawingsReview/Detail
export function getDrawingsReviewDetail(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/Detail`, params });
}
// 评审内容
// /api/Information/DrawingsReview/{id}/Content
export function getDrawingsReviewContent(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/${params.id}/Content`, params });
}
// 新增评审内容
// /api/Information/DrawingsReview/Content
export function postDrawingsReviewContent(data) {
  return defHttp.post({ url: Api.Prefix + `/DrawingsReview/Content`, data });
}
// 修改评审内容
// /api/Information/DrawingsReview/Content/{id}
export function putDrawingsReviewContent(data) {
  return defHttp.put({ url: Api.Prefix + `/DrawingsReview/Content/${data.id}`, data });
}
// 删除评审内容
// /api/Information/DrawingsReview/Content/{id}
export function delDrawingsReviewContent(id) {
  return defHttp.delete({ url: Api.Prefix + `/DrawingsReview/Content/${id}` });
}
// 评审意见列表
// /api/Information/DrawingsReview/{id}/Record
export function getDrawingsReviewRecordList(params) {
  return defHttp.get({ url: Api.Prefix + `/DrawingsReview/${params.id}/Record`, params });
}
// 保存评审结论
// /api/Information/DrawingsReview/Review/Result
export function postDrawingsReviewResult(data) {
  return defHttp.post({ url: Api.Prefix + `/DrawingsReview/Review/Result`, data });
}
// 评审提交
// /api/Information/DrawingsReview/Review/Commit
export function postDrawingsReviewCommit(data) {
  return defHttp.post({ url: Api.Prefix + `/DrawingsReview/Review/Commit`, data });
}
// 客户回复
// /api/Information/DrawingsReview/CustomerReply
export function postDrawingsReviewCustomerReply(data) {
  return defHttp.post({ url: Api.Prefix + `/DrawingsReview/CustomerReply`, data });
}

// 生成PPT
// /api/Information/drawingsreview/createppt
export function drawingsreviewCreatePPT(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/createppt`, data });
}
// 转办
// api/Information/DrawingsReview/Transfer
export function postDrawingsReviewTransfer(data) {
  return defHttp.post({ url: Api.Prefix + `/DrawingsReview/Transfer`, data });
}
// 上传附件
// /api/Information/DrawingsReview/UploadAttach
export function postDrawingsReviewUploadAttach(data) {
  return defHttp.post({
    url: Api.Prefix + `/drawingsreview/upload/attachment`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
// 删除附件
export function postDrawingsReviewDeleteAttach(data) {
  return defHttp.post({
    url: Api.Prefix + `/Drawingsreview/Delete/Attachment`,
    data,
  });
}

// 获取附件历史
// /api/Information/FileInfo/History
export function getFileInfoHistory(params) {
  return defHttp.get({ url: Api.Prefix + `/FileInfo/History`, params });
}

// 工程评审
// /api/Information/drawingsreview/applypage
export function drawingsreviewApplyPage(params) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreview/applypage`, params });
}

// dfm评审 转办
export function postDrawingsReviewReviewTransfer(data) {
  return defHttp.post({ url: Api.Prefix + `/DrawingsReview/DFMTransfer`, data });
}

// 批量评审提交
// /Information/drawingsreview/review/batchcommit
export function putDrawingsReviewReviewBatch(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/batchcommit`, data });
}

// 批量保存评审结论
// /Information/drawingsreview/review/resultbatch
export function saveDrawingsReviewBatch(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/resultbatch`, data });
}
// /Information/drawingsreview/review/batchcommit
export function saveDrawingsCommitBatch(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreview/review/batchcommit`, data });
}
