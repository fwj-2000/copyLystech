import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/CoreCommon',
}
// 获取编码配置列表
export function getIdGeneratorRule(data) {
  return defHttp.get({ url: Api.Prefix + `/idgeneratorrule`, data });
}

export function postIdGeneratorRule(data) {
  return defHttp.post({ url: Api.Prefix + `/idgeneratorrule`, data });
}

export function putIdGeneratorRuleEnable(id) {
  return defHttp.put({ url: Api.Prefix + `/idgeneratorrule/enable/${id}` });
}
export function putIdGeneratorRuleDisable(id) {
  return defHttp.put({ url: Api.Prefix + `/idgeneratorrule/disable/${id}` });
}
// 修改
export function putIdGeneratorRule(data) {
  return defHttp.put({ url: Api.Prefix + `/idgeneratorrule/${data.Id}`, data });
}
// 批量删除
export function postIdsDelGeneratorRule(data) {
  return defHttp.post({ url: Api.Prefix + `/idgeneratorrule/bulk/delete`, data });
}

// 删除
export function deleteIdGeneratorRule(id) {
  return defHttp.delete({ url: Api.Prefix + `/idgeneratorrule/${id}` });
}

// 查询规则明细
export function getRuleDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/idgeneratorruleline/${id}` });
}

export function postSaveRuleDetail(data) {
  return defHttp.post({ url: Api.Prefix + `/idgeneratorruleline`, data });
}
// 删除
export function deleteRuleDetail(id) {
  return defHttp.delete({ url: Api.Prefix + `/idgeneratorruleline/${id}` });
}
