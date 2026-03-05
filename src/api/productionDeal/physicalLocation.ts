import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/LocationArea',
}

//查询列表
export function getLocationArea(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取生产车间列表
export function getWorkshopList(data) {
  return defHttp.get({ url: `/api/Production/Workshop` + `/AllList`, data });
}

//通过Id查询
export function getLocationAreaById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addLocationArea(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateLocationArea(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteLocationArea(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteLocationArea(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportLocationAreaExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importLocationAreaData(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

// 导入预览
export function importLocationAreaPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}
