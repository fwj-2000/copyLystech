import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/Information',
}

//查询列表
export function getEquipment(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取设备集合，下拉框用
export function getEquipmentList(data) {
  return defHttp.get({ url: Api.Prefix + `/EquipmentList`, data });
}

//点检时获取设备信息
export function getEquipmentByCode(code) {
  return defHttp.get({ url: Api.Prefix + `/GetEquipmentByCode/${code}` });
}

//获取线体列表
export function getLineInfoListBySearchKey(searchKey = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetLineInfoList/${searchKey}` });
}

//获取厂区列表
export function getFactoryAreaList(data) {
  return defHttp.get({ url: Api.Prefix + `/GetFactoryList`, data });
}

//通过Id查询
export function getEquipmentById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//获取供应商列表
export function getSupplierList(data) {
  return defHttp.get({ url: '/api/BaseData/supplier/list', data });
}

//新增
export function addEquipment(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateEquipment(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteEquipment(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteEquipment(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportEquipmentExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importEquipmentData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importEquipmentPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

//同步SAP
export function syncEquipmentFromSAP(data) {
  return defHttp.post({ url: Api.Prefix + '/SyncEquipmentFromSAP', data });
}
