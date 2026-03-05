import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/LineInfo',
}

//查询列表
export function getLineInfo(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getLineInfoById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addLineInfo(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateLineInfo(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteLineInfo(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteLineInfo(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportLineInfoExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importLineInfoPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

// 导入
export function importLineInfoData(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

// 车间信息
export function getLocationAreaAllList(data) {
  return defHttp.get({ url: `/api/Production/LocationArea/AllList`, data });
}

// 机台信息
export function getEquipmentList(data) {
  return defHttp.get({ url: `/api/Production/equipmentledger/getequipmentcodelist`, data });
}

// 获取机台下拉数据
export function getLineEquipmentCodeList(data) {
  return defHttp.post({ url: `/api/Production/equipmentledger/getLineEquipmentCodeList`, data });
}

// 线体类型下拉查询
export function lineTypeList(data) {
  return defHttp.get({ url: `/api/Production/linetype/getlist`, data });
}
