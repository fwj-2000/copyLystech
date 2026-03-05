import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/diecutquantity/getreport',
}

export function getreport(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
