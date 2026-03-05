import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData',
}

// 厂区模具代码模具用途-分页列表.
// /api/BaseData/costcenter/factorymoldcodepurpose
export function getFactorymoldcodepurpose(data) {
  return defHttp.get({ url: Api.Prefix + '/costcenter/factorymoldcodepurpose', data });
}

// 厂区模具代码-分页列表.
// /api/BaseData/costcenter/factorymoldcode
export function getFactorymoldcode(data) {
  return defHttp.get({ url: Api.Prefix + '/costcenter/factorymoldcode', data });
}
// 保存厂区模具代码.
// /api/BaseData/costcenter/factorymoldcode
export function saveFactorymoldcode(data) {
  return defHttp.post({ url: Api.Prefix + '/costcenter/factorymoldcode', data });
}
// 成本中心-分页列表.
// /api/BaseData/costcenter/costcenter
export function getCostcenter(data) {
  return defHttp.get({ url: Api.Prefix + '/costcenter/costcenter', data });
}
// 成本中心维护-分页列表.
// /api/BaseData/costcenter/costcenterset
export function getCostcenterset(data) {
  return defHttp.get({ url: Api.Prefix + '/costcenter/costcenterset', data });
}

// 保存成本中心
// /api/BaseData/costcenter/costcenter
export function saveCostcenter(data) {
  return defHttp.post({ url: Api.Prefix + '/costcenter/costcenter', data });
}
// 模具用途列表
// /api/BaseData/costcenter/moldpurposelist
export function getMoldpurposelist(data) {
  return defHttp.get({ url: Api.Prefix + '/costcenter/moldpurposelist', data });
}

// 模具启用
// /api/BaseData/costcenter/MoldPurpose/Enable
export function enableMoldPurpose(data) {
  return defHttp.post({ url: Api.Prefix + '/costcenter/MoldPurpose/Enable', data });
}
// 模具停用
// /api/BaseData/costcenter/MoldPurpose/Disable
export function disableMoldPurpose(data) {
  return defHttp.post({ url: Api.Prefix + '/costcenter/MoldPurpose/Disable', data });
}
// 新增模具
// /api/BaseData/costcenter/moldpurpose
export function addMoldpurpose(data) {
  return defHttp.post({ url: Api.Prefix + '/costcenter/moldpurpose', data });
}
