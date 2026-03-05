import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/dispatchcode/snrelationreport',
}

//查询列表
export function getSNRelationreport(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
