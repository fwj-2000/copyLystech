import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 获取工程制作资料详情 /api/Information/engineeringinformation
export function getEngineeringinformationDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/engineeringinformation/${id}` });
}
