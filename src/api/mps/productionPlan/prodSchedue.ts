import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/mps/productschedule',
}

//查询列表
export function getProdSchedule(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//根据工厂查询线体列表
export function getlinelist(data) {
  return defHttp.get({ url: `/api/mps/syncscheduleconfig/getlinelist?factoryArea=${data}` });
}

// 获取排程数据
export function syncschedule(data) {
  return defHttp.post({ url: Api.Prefix + '/syncschedule', data });
}
