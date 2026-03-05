import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/basedata/stockhandlerecord',
}

//查询列表
export function getStockList(data) {
  return defHttp.get({ url: Api.Prefix }, data);
}

//处理记录
export function getRecordList(data) {
  return defHttp.get({ url: Api.Prefix + `/getstocklist`, data });
}

// 处理记录详情
export function getRecordDetail(id) {
  return defHttp.post({ url: Api.Prefix + `/${id}` });
}

// 处理
export function handleStock(data) {
  return defHttp.put({ url: Api.Prefix, data });
}
