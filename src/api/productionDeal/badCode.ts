import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/BadCode',
}

//查询列表
export function getBadeCode(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getBadCodeById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addBadCode(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateBadCode(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteBadCode(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteBadCode(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportBadCodeExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 根据检测项目获取不良代码
export function getlistbycheckproject(data) {
  return defHttp.get({ url: '/api/Production/badcode/getlistbycheckproject', data });
}

// 根据检测项目获取分组的不良代码.
export function getGroupbylist(data) {
  return defHttp.get({ url: `/api/Production/badcode/getgroupbylist`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}
