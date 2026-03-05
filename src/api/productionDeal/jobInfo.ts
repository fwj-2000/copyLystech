import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/JobInfo',
}

//查询列表
export function getJobInfo(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getJobInfoById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//获取岗位列表
export function getJobInfoList(searchKey = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetJobInfoList/${searchKey}` });
}

//新增
export function addJobInfo(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateJobInfo(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteJobInfo(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteJobInfo(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportJobInfoExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importJobInfoData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importJobInfoPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}
