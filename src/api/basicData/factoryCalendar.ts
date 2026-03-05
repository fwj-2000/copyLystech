import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData/FactoryCalendar',
}

// 获取工厂日历列表
export function getFactoryCalendarList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取机台号列表
export function getEquipmentList(searchKey = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetEquipmentList/${searchKey}` });
}

//通过Id查询
export function getFactoryCalendarById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addFactoryCalendar(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateFactoryCalendar(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteFactoryCalendar(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteFactoryCalendar(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportFactoryCalendarExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importFactoryCalendarPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importFactoryCalendarData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}
