import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/outsourcemanage',
}

// 查询列表
export function getOutsourcemanage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增
export function addOutsourcemanage(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 删除
export function deleteOutsourcemanage(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

// 批量发料
export function bulkSend(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/send', data });
}

// 批量确认收货
export function bulkReceive(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/receive', data });
}

// 批量删除
export function bulkDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

// 模糊匹配获取类型为外协的工序数据--返回所有数据
export function getProcesslist(data) {
  return defHttp.get({ url: Api.Prefix + '/processlist', data });
}

// 获取暂存数据
export function getDraftlist(data) {
  return defHttp.get({ url: Api.Prefix + '/getdraftlist', data });
}

// 模糊匹配获取类型为外协的工序数据--返回所有数据
export function getKeywordlist(data) {
  return defHttp.get({ url: '/api/Production/workorder/keywordlist', data });
}

// 根据SN获取需要委外的信息 -- 下一道工序.
export function getlabeldetailbysn(data) {
  return defHttp.get({ url: Api.Prefix + '/getlabeldetailbysn', data });
}

// SN确认收货.
export function sncodereceive(data) {
  return defHttp.post({ url: Api.Prefix + '/sncodereceive', data });
}

// 根据单据编号获取待收货的数据.
export function getunreceivelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getunreceivelist', data });
}
