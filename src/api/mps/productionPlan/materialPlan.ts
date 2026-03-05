import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/mps/materialdemandplan',
}

/// 物料需求计划-总表查询
export function materialTotalpage(data) {
  return defHttp.get({ url: Api.Prefix + '/totalpage', data });
}

// 物料需求计划-总表导出Excel.
export function materialTotalexport(data) {
  return defHttp.get({ url: Api.Prefix + '/totalexport', data });
}

// 物料需求计划-默认页/处理中/已处理 分页列表.
export function materialPartpage(data) {
  return defHttp.get({ url: Api.Prefix + '/partpage', data });
}

// 物料需求计划-默认页/处理中/已处理导出Excel.
export function materialPartexport(data) {
  return defHttp.get({ url: Api.Prefix + '/partexport', data });
}

// 物料需求计划-通过Ids查询总表.
export function materialTotalDetail(data) {
  return defHttp.post({ url: Api.Prefix + '/totaldetail', data });
}

// 物料需求计划-通过Ids查询待处理/处理中/已处理.
export function materialPartDetail(data) {
  return defHttp.post({ url: Api.Prefix + '/partdetail', data });
}

// 物料需求计划-修改.
export function materialPartUpdateplan(data) {
  return defHttp.post({ url: Api.Prefix + '/updateplan', data });
}

// 物料需求计划-下推PR单
export function materialPartPushprorder(data) {
  return defHttp.post({ url: Api.Prefix + '/pushprorder', data });
}

// 获取分配bom列表数
export function materialPartBomlist(data) {
  return defHttp.get({ url: Api.Prefix + '/BomList', data });
}

// 分配bom表
export function materialPartPushbom(data) {
  return defHttp.post({ url: Api.Prefix + '/AllocateBOM', data });
}

// 计算N周需求
export function materialPartCalcnweekdemand(data) {
  return defHttp.post({ url: Api.Prefix + '/NWeek', data });
}

// 分配材料列表
export function materialPartMateriallist(data) {
  return defHttp.get({ url: Api.Prefix + '/ReAllocateList', data });
}

// 分配材料
export function materialPartAllocatematerial(data) {
  return defHttp.post({ url: Api.Prefix + '/ReAllocate', data });
}
