import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/operationrate',
}

//获取设备总览数据.
export function getEquipmentoverview(data) {
  return defHttp.get({ url: Api.Prefix + '/getequipmentoverview', data });
}

// 获取7天平均稼动率.
export function getSevendayavgoperationrate(data) {
  return defHttp.get({ url: Api.Prefix + '/getsevendayavgoperationrate', data });
}

// 当前稼动率列表
export function getOperationratelist(data) {
  return defHttp.get({ url: Api.Prefix + '/operationratelist', data });
}

// 导出Excel.
export function exportOperationrateExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/export`, data });
}

// 当天稼动率
export function getDayvgoperationratelist(data) {
  return defHttp.get({ url: Api.Prefix + '/dayavgoperationratelist', data });
}

// 品牌下拉
export function getBrandlist(data) {
  return defHttp.get({ url: Api.Prefix + '/brandlist', data });
}

// 获取设备分类下拉数据.
export function getEquipmentcategorylist(data) {
  return defHttp.get({ url: Api.Prefix + '/equipmentcategorylist', data });
}
