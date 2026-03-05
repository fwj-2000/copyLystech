import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
}

// /api/Information/quotationrequirements
export function getQuotationRequirements(data) {
  return defHttp.get({ url: Api.Prefix + `/quotationrequirements`, data });
}

// /api/Information/quotationrequirements/download/importtemplate
export function getQuotaTemplateDownload(data) {
  return defHttp.get({ url: Api.Prefix + `/quotationrequirements/download/importtemplate`, data });
}

// 保存数据
// /api/Information/quotationrequirements/{batchcode}
export function postQuotationRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements/${data}` });
}

// 单个新增数据
// /api/Information/quotationrequirements
export function postQuotationRequirement(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements`, data });
}

// 详情接口
// /api/Information/quotationrequirements/{id}
export function getQuotationRequirementDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/quotationrequirements/${id}` });
}

// 修改数据
// /api/Information/quotationrequirements/{id}
export function putQuotationRequirement(data) {
  return defHttp.put({ url: Api.Prefix + `/quotationrequirements/${data.Id}`, data });
}

// 批量修改数据
// /api/Information/quotationrequirements/update
export function putQuotationRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements/update`, data });
}

// 撤回数据
// /Information/quotationrequirements/withdraw
export function withdrawQuotationRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements/withdraw`, data });
}

// 提交数据
// /api/Information/quotationrequirements/commit
export function commitQuotationRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements/commit`, data });
}

// 单个申请模糊查询终端客户代码||终端项目代码
// /api/Information/project/search
export function getProjectSearch(data) {
  return defHttp.get({ url: Api.Prefix + `/project/search`, data });
}

// 单个申请模糊查询内部料号
// /api/Information/partnumberapply/search
export function getPartNumberSearch(data) {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/search`, data });
}
// 批量删除
// /api/Information/quotationrequirements/bulk/delete
export function deleteQuotationRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements/bulk/delete`, data });
}

// 导出excel
// /api/Information/quotationrequirements/exportexcel
export function exportQuotationRequirementsExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/quotationrequirements/exportexcel`, data });
}

// 图纸下载
// /api/Information/fileinfo/{id}/download
export function downloadPic(data) {
  return defHttp.get({ url: Api.Prefix + `/fileinfo/${data.id}/download`, data });
}

// 图纸预览
// /api/Information/fileinfo/{id}/previewfileinfo
export function previewPic(data) {
  return defHttp.get({ url: Api.Prefix + `/fileinfo/${data.id}/previewfileinfo`, data });
}

// 批量审核
// /api/Information/quotationrequirements/review
export function reviewQuotationRequirements(data) {
  return defHttp.put({ url: Api.Prefix + `/quotationrequirements/review`, data });
}

// 批量反审核
// /api/Information/quotationrequirements/reversereview
export function reverseReviewQuotationRequirements(data) {
  return defHttp.put({ url: Api.Prefix + `/quotationrequirements/reversereview`, data });
}

// 导入报价需求
// /api/Information/quotationrequirements/import
export function importQuotationRequirements(data) {
  return defHttp.post({
    url: Api.Prefix + `/quotationrequirements/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 终止
// /Information/quotationrequirements/stop
export function stopQuotationRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/quotationrequirements/stop`, data });
}

// export function importExcel(data) {
//   return defHttp.post({
//     url: `${Api.Prefix}/partnumberapply/import`,
//     data,
//     headers: {
//       'Content-Type': ContentTypeEnum.FORM_DATA,
//     },
//   });
// }

// 查询报价需求applyCode list
// Information/QuotationRequirements/List
export function getQuotationRequirementsList(data) {
  return defHttp.get({ url: Api.Prefix + `/QuotationRequirements/List`, data });
}

// 获取当前导入任务
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/QuotationRequirements/ImportTask`,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/QuotationRequirements/ImportTaskData`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/QuotationRequirements/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/QuotationRequirements/ImportTaskRead`,
  });
}

// PCC创建工程资料
// Information/Quotation/CreateFromPCC
export function createFromPcc(data) {
  return defHttp.post({
    url: Api.Prefix + `/Quotation/CreateFromPCC`,
    data,
  });
}

// 粘贴料号带出其他数据
// /api/Information/partnumberapply/SelectMultiple
export function selectMultiple(data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/SelectMultiple`,
    data,
  });
}

// 撤回
// /api/Information/quotationrequirements/withdraw
export function withdrawQuota(data) {
  return defHttp.post({
    url: Api.Prefix + `/quotationrequirements/withdraw`,
    data,
  });
}
