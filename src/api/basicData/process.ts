import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData/process',
}

// 获取所有工序
export function getProcessList(data) {
  return defHttp.get({ url: Api.Prefix + '/alllist', data });
}
