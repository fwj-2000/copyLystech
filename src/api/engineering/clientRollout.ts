import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 项目阶段维护-分页
export function getProjectStage(data) {
  return defHttp.get({ url: Api.Prefix + `/ProjectStage`, data });
}

// 项目阶段维护-获取阶段变更记录
export function getStageChangeRecord(data) {
  return defHttp.get({ url: Api.Prefix + `/ProjectStage/StageChangeRecord`, data });
}

// 项目阶段维护-获取产品阶段
export function getProductStage(data) {
  return defHttp.get({ url: Api.Prefix + `/ProjectStage/GetProductStage`, data });
}

// 项目阶段维护-维护/转阶段操作
export function maintenanceHandle(data) {
  return defHttp.post({ url: Api.Prefix + `/ProjectStage/MaintenanceHandle`, data });
}

// 项目阶段维护-批量导出
export function projectStageExportData(data) {
  return defHttp.get({ url: Api.Prefix + `/ProjectStage/ExportData`, params: data });
}

// 项目阶段维护-批量维护/转阶段操作
export function batchMaintenanceHandle(data) {
  return defHttp.post({ url: Api.Prefix + `/ProjectStage/BatchMaintenanceHandle`, params: data });
}

// 出货数据-分页
export function getShipmentOnline(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline`, data });
}

// 出货数据-同步数据
export function syncData() {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/SyncData` });
}

// 出货数据-维护CQE
export function maintenanceCqe(data) {
  return defHttp.post({ url: Api.Prefix + `/ShipmentOnline/Maintenance`, data });
}

// 出货数据-批量导出
export function maintenanceCqeExportData(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/ExportData`, params: data });
}

// 出货数据-撤回
export function shipmentWithdraw(data) {
  return defHttp.post({ url: Api.Prefix + `/ShipmentOnline/Withdraw`, params: data });
}

// 出货数据-获取节点记录数据
export function shipmentGetNodeList(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/GetNodeList`, params: data });
}

// 出货数据-同步数据
export function shipmentSyncData(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/SyncData`, params: data });
}

// 出货数据-获取CQE用户配置
export function getCqeUserInfo(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/CqeUserInfo`, params: data });
}

// 出货数据-获取内部料号绑定的产品阶段列表
export function getProductStageList(data) {
  return defHttp.get({ url: Api.Prefix + `/ProjectStage/ProductStageList`, params: data });
}

// 出货数据-同步更新待推送的出货数据中项目阶段数据
export function syncProductStage() {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/SyncProductStage` });
}

// 客户端上线数据-录入数据
export function enterOpt(data) {
  return defHttp.post({ url: Api.Prefix + `/ShipmentOnline/enterOpt`, params: data });
}

// 客户端上线数据-转办
export function transfer(data) {
  return defHttp.post({ url: Api.Prefix + `/ShipmentOnline/Transfer`, params: data });
}

// 客户端上线报表-获取环比数据
export function getItemChainList(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/GetItemChainList`, params: data });
}

// 客户端上线报表-获取各项指标详情
export function dailyItemDetailStatistics(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/DailyItemDetailStatistics`, params: data });
}

// 客户端上线报表-统计报表列表查询
export function getItemDetailStatisticsList(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/ItemDetailStatisticsList`, params: data });
}

// 客户端线上报表-批量导出
export function shipmentreportExportData(data) {
  return defHttp.get({ url: Api.Prefix + `/ShipmentOnline/reportExportData`, params: data });
}
