import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/cuttingsn',
}

export function getCuttingsnList(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
