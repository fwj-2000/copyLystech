import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/SerialPortScreenParm',
}

//查询列表
export function getSerialPortScreenParm(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getSerialPortScreenParmById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addSerialPortScreenParm(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateSerialPortScreenParm(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteSerialPortScreenParm(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteSerialPortScreenParm(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}
