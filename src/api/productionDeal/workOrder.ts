import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/WorkOrder',
}

//查询列表
export function getWorkOrder(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//详情
export function getWorkOrderDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//获取内部料号下拉数据
export function getInnermaterialnumberlist(data) {
  return defHttp.get({ url: '/api/Production/processrulestemplate/getinnermaterialnumberlist', data });
}

//获取生产车间下拉数据
export function getWorkshoplist(data) {
  return defHttp.get({ url: '/api/Production/Workshop/GetList', data });
}

//新增
export function addWorkOrder(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateWorkOrder(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteWorkOrder(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteWorkOrder(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//同步SAP工单
export function syncWorkOrderFromSAP(data) {
  return defHttp.post({ url: Api.Prefix + '/SyncWorkOrderFromSAP', data });
}

//导出Excel
export function exportWorkOrderExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
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

//根据工单号获取工单信息
export function getWorkOrderDesc(data) {
  return defHttp.get({ url: Api.Prefix + '/getworkorderdetail', data });
}

//根据工单号获取工单信息
export function getWorkorderbymouldno(mouldNo) {
  return defHttp.get({ url: Api.Prefix + '/getworkorderbymouldno/?mouldNo=' + mouldNo });
}

//查询列表
export function getWorkOrderBom(data) {
  return defHttp.get({ url: Api.Prefix + '/bompage', data });
}

//同步Bom工单
export function syncWorkOrderFromBom(data) {
  return defHttp.post({ url: Api.Prefix + '/syncworkorderbomfromsap', data });
}
