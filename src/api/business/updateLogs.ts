import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api',
}

export function postUpdateLog(data) {
  return defHttp.post({ url: `${Api.Prefix}/system/sysupgradelog/create`, data });
}

export function getUpdateLogList(data) {
  return defHttp.get({ url: `${Api.Prefix}/system/sysupgradelog`, data });
}

export function getLatestOneUpdateLog(data) {
  return defHttp.get({ url: `${Api.Prefix}/system/sysupgradelog/getlatestone`, data });
}

export function putUpdateLog(data) {
  return defHttp.put({ url: `${Api.Prefix}/system/sysupgradelog/${data.Id}`, data });
}

export function publishUpdateLog(data) {
  return defHttp.put({ url: `/system/sysupgradelog/publish`, data });
}

export function getUpdateTimeTree(data) {
  return defHttp.get({ url: `/api/system/sysupgradelog/timeTree`, data });
}

export function getUpdateLogById(data) {
  return defHttp.get({ url: `/api/system/sysupgradelog/getone`, data });
}
