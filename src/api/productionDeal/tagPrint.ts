import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/BulletinBoard',
}


export function getTitle(data) {
  return defHttp.get({ url: Api.Prefix, data });
}


export function getMacData(data) {
  return defHttp.get({ url: Api.Prefix+`/GetMacData/`, data })
}