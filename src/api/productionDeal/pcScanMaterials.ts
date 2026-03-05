import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/PcScanMaterials',
}

//查询列表
export function getPcScanMaterials(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//根据单据号获取模切预打印信息
export function getDieCutPerPrintDetail(data) {
  return defHttp.get({ url: '/api/Production/DieCutPerPrint/GetDieCutPerPrintDetail', data });
}

//扫料
export function scanMaterials(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//校验材料编号是否能扫料.
export function checkmaterialcode(data) {
  return defHttp.post({ url: Api.Prefix + '/checkmaterialcode', data });
}

// 根据工单号获取材料信息.
export function getmateriallist(data) {
  return defHttp.get({ url: Api.Prefix + '/getmateriallist', data });
}

// 根据单据号获取需要扫料的信息.
export function getLabelDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/GetLabelDetail', data });
}

// 根据SN获取需要扫料的信息.
export function getLabelDetailBySn(data) {
  return defHttp.get({ url: Api.Prefix + '/GetLabelDetailBySn', data });
}

// 校验SN是否被使用.
export function checkSnCode(data) {
  return defHttp.get({ url: Api.Prefix + '/checkSnCode', data });
}

// 根据SN获取当前标签的信息 -- 当前工序.
export function getcurrentdetailbysn(data) {
  return defHttp.get({ url: '/api/Production/pcscanmaterials/getcurrentdetailbysn', data });
}

// 校验副SN能否绑定主SN.
export function checksubsncode(data) {
  return defHttp.post({ url: '/api/Production/pcscanmaterials/checksubsncode', data });
}
