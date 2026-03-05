import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { getAppEnvConfig } from '/@/utils/env';
const { VITE_GLOB_API_URL } = getAppEnvConfig();
enum Api {
  Prefix = '/api/Production/OptimalSchedule',
}

//获取组别下拉
export function getGroupList(data) {
  return defHttp.get({ url: Api.Prefix + '/GetGroupList', data });
}

//分页列表
export function getPageList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 批量删除
export function bathDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//根据日期和班次获取派工数据
export function getWorkAllocationList(data) {
  return defHttp.post({ url: Api.Prefix + '/GetWorkAllocationList', data });
}

// 导入模板下载.
export function getTemplateDownload() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

// 上传excel文件
export function importExcel(data) {
  return defHttp.post({
    url: `${Api.Prefix}/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 导入保存.
export function saveBatchData(batchCode, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}`, data });
}

// 获取当前导入任务
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/ImportTask`,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/ImportTaskData`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/ImportTaskRead`,
  });
}

// 获取组别下拉.
export function getgrouplist(data) {
  return defHttp.get({
    url: Api.Prefix + `/getgrouplist`,
    data,
  });
}

// 根据日期和班次获取派工数据.
export function getworkallocationlist(data) {
  return defHttp.post({
    url: Api.Prefix + `/getworkallocationlist`,
    data,
  });
}

// 派工.-提交
export function workallocation(data) {
  return defHttp.post({
    url: Api.Prefix + `/workallocation`,
    data,
  });
}

// 获取主机手下拉--当天值班人员.
export function getdutypersonlist(data) {
  return defHttp.post({
    url: Api.Prefix + `/getdutypersonlist`,
    data,
  });
}

// 择优-导出
export function optimalscheduleExport(data) {
  return defHttp.get({
    url: Api.Prefix + `/export`,
    data,
  });
}

// 模糊搜索获取人员
export function getuserlistselector(data) {
  return defHttp.post({
    url: `/api/permission/Users/getuserlistselector`,
    data,
  });
}
