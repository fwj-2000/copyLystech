import { defHttp } from '/@/utils/http/axios';
enum Api {
  WAREHOUSE_PREFIX = '/api/report/warehouse/', // 报表通用
}
//汇总表
export function getWarehouseSum(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}summary`, data });
}

// 出勤指标
export function getChuQinDay(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}chuQinDay`, data });
}

//出勤明细
export function getChuQinDetail(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}chuQinList`, data });
}
//出勤明细 部门
export function chuqinselectparam(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}chuqinselectparam`, data });
}
//出勤明细导出
export function ExportChuQinDetail(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}chuQinListExport`, data });
}

//过保
export function getAboutToExpire(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}abouttoexpire`, data });
}
//过保导出
export function ExportAboutToExpire(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}abouttoexpireexport`, data });
}

//不良管理
export function getBadManage(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}badmanage`, data });
}
//不良管理导出
export function ExportBadManage(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}badmanageexport`, data });
}
//暂收-收货
export function getTemporarilyCollect(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}temporarilycollect`, data });
}
//暂收-收货导出
export function ExportTemporarilyCollect(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}temporarilycollectexport`, data });
}

//整支-收货
export function getHarvest(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}harvest`, data });
}
//整支-收货导出
export function ExportHarvest(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}harvestexport`, data });
}

//整支-收货
export function getShipment(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}shipment`, data });
}
//整支-收货导出
export function ExportShipment(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}shipmentexport`, data });
}
//工单明细
export function getWorkorderpage(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}workorderpage`, data });
}
//工单明细导出
export function ExportWorkOrder(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}workOrderExport`, data });
}
// 分仓考勤
export function getAttendancedetail(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}attendancedetail`, data });
}
export function getShipmentindex(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}shipmentindex`, data });
}
export function getReceiptindex(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}receiptindex`, data });
}
export function detailfactoryselectparam(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}detailfactoryselectparam`, data });
}
export function getLocalmaintpage(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}localmaintpage`, data });
}
export function delLocalmaintpage(data) {
  return defHttp.post({ url: `${Api.WAREHOUSE_PREFIX}localmaintdel`, data });
}

export function addorupdatelocalmaint(data) {
  return defHttp.post({ url: `${Api.WAREHOUSE_PREFIX}localmaintaddorupdate`, data });
}
// 原材料寄售明细
export function getConsignmentInventory(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}consignedrm`, data });
}
// 原材料寄售明细导出
export function ExportConsignmentInventory(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}consignedRMExport`, data });
}
// 标准天数维护
export function getStandardDayMainte(data) {
  return defHttp.get({ url: `${Api.WAREHOUSE_PREFIX}standMainteDayPage`, data });
}
export function delStandardDayMainte(data) {
  return defHttp.post({ url: `${Api.WAREHOUSE_PREFIX}standMainteDayDel`, data });
}
export function addorupdatestandMainteDay(data) {
  return defHttp.post({ url: `${Api.WAREHOUSE_PREFIX}standMainteDayAddOrUpdate`, data });
}
