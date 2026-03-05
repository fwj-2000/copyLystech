import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/hrbis/employeetraining',
}

// 获取新员工列表
export function getEmployeeList(data) {
  return defHttp.get({ url: Api.Prefix + `/list`, data });
}
export function getEmployeeListV2(data) {
  return defHttp.get({ url: Api.Prefix + `/v2/list`, data });
}
//通过Id查询
export function getEmployeeInfoById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}
// 删除新员工信息
export function delEmployee(id) {
  return defHttp.delete({ url: Api.Prefix + '/' + id });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入模板下载 V2
export function templateDownloadV2() {
  return defHttp.get({ url: Api.Prefix + `/v2/Download/ImportTemplate` });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/v2/importdata`, data });
}

// 保存导入数据 V2
export function saveImportData(code, data) {
  return defHttp.post({ url: Api.Prefix + `/v2/SaveImport?batchCode=${code}`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入预览 V2
export function importPreviewV2(data) {
  return defHttp.post({ url: Api.Prefix + `/v2/importPreview`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

// 获取当前导入任务
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/v2/importtask`,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/v2/importtaskdata`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/v2/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/v2/ImportTaskRead`,
  });
}

//新增
export function addEmployeeInfo(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
//修改
export function updateEmployeeInfo(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

export function updateEmployeeInfoV2(data) {
  return defHttp.put({ url: Api.Prefix + `/v2/${data.id}`, data });
}

// 批量删除
export function blukDeleteEmployeeInfo(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}
// 获取数据去打印
export function getPrintData(id) {
  return defHttp.get({ url: Api.Prefix + `/PrintData/${id}` });
}

export function getPrintDataV2(id) {
  return defHttp.get({ url: Api.Prefix + `/v2/PrintData/${id}` });
}

export function launchTrainFlow(data) {
  return defHttp.post({ url: Api.Prefix + '/launchTrainFlow', data });
}

// 获取员工数据
// api/hrbis/employeetraining/v2/getemployeefillinfo?cacheKey=xxxxxxx
export function getEmployeeFillInfo(data) {
  return defHttp.get({ url: Api.Prefix + `/v2/getemployeefillinfo`, data });
}

// 提交签名
// api/hrbis/employeetraining/v2/submitemployeeinfo/{cachekey}
export function postEmployeeFillInfo(cacheKey, data) {
  return defHttp.post({ url: Api.Prefix + `/v2/submitemployeeinfo/${cacheKey}`, data });
}

// 根据缓存键获取对应导师待签审的员工培训信息
export function getPendingAuditEmployee(data) {
  return defHttp.get({ url: Api.Prefix + `/v2/getPendingAuditEmployee`, data });
}

// 导师提交签审结果
export function postSubmitMentorAudit(cacheKey, data) {
  return defHttp.post({ url: Api.Prefix + `/v2/SubmitMentorAudit/${cacheKey}`, data });
}

// 发起退回或重签此节点
export function postInitiateRollbackOrReSign(data) {
  return defHttp.post({ url: Api.Prefix + `/v2/InitiateRollbackOrReSign`, data });
}

// 批量导师审核
export function mentorBatchAudit(data) {
  return defHttp.post({ url: Api.Prefix + `/v2/MentorBatchAudit`, data });
}

// HR终审
export function postHrAudit(data) {
  return defHttp.post({ url: Api.Prefix + `/v2/HrAudit`, data });
}

/***
 * 根据id查询详情
 * @param id
 * @returns
 */
export const getTrainAndAuditDetails = (data: { id: String }) => defHttp.get({ url: Api.Prefix + `/v2/GetTrainAndAuditDetails`, data });

/**
 * 获取最新模板配置
 * @param version
 * @returns
 */
export const getNewTemplateConfig = data => defHttp.get({ url: Api.Prefix + `/v2/GetTemplateConfig`, data });

export const saveTemplateConfig = data => defHttp.post({ url: Api.Prefix + `/v2/SaveTemplateConfig`, data });

// 批量催办
export const bulkInitiateExpedite = data => defHttp.post({ url: Api.Prefix + '/v2/InitiateExpedite', data });
