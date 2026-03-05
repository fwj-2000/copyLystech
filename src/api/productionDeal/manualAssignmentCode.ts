import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/',
}
// 分页列表,成品
export function getManualAssignmentCode(data) {
  return defHttp.get({ url: Api.Prefix + 'SNGen/DispatchCode/PageReprint', data });
}

// 新增,成品
export function addManualAssignmentCode(data) {
  return defHttp.post({ url: Api.Prefix + 'SNGen/DispatchCode/CreateReprint', data });
}
// 一键过站
export function tempReprintAuto(data?: any) {
  return defHttp.post({ url: Api.Prefix + 'Production/StackMaterial/TempReprintAuto?gxCode=' + data?.gxCode });
}
// 分页列表,模切
export function getManualAssignmentCodeMQ(data) {
  return defHttp.get({ url: Api.Prefix + 'SNGen/Dutting/Page', data });
}

// 新增,模切
export function addManualAssignmentCodeMQ(data) {
  return defHttp.post({ url: Api.Prefix + 'SNGen/Dutting/GetSN', data });
}
