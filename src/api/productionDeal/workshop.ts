import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/Workshop',
}

//查询列表
export function getWorkshop(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取生产车间列表
export function getWorkshopList(keyword) {
  return defHttp.get({ url: Api.Prefix + `/AllList` }, keyword);
}

//通过Id查询
export function getWorkshopById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addWorkshop(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateWorkshop(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteWorkshop(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteWorkshop(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportWorkshopExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importWorkshopData(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

// 导入预览
export function importWorkshopPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}
