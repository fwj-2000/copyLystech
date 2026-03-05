import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/mps/syncscheduleconfig',
}

//查询列表
export function getSyncSchedule(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addSyncSchedule(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateSyncSchedule(id, data) {
  return defHttp.put({ url: Api.Prefix + `/${id}`, data });
}

//批量删除
export function blukDeleteSyncSchedule(data) {
  return defHttp.post({ url: Api.Prefix + '/bulkdelete', data });
}

//启用
export function enableSyncSchedule(data) {
  return defHttp.post({ url: Api.Prefix + '/enable', data });
}

//禁用
export function disableSyncSchedule(data) {
  return defHttp.post({ url: Api.Prefix + '/disable', data });
}
