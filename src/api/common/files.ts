import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 获取料号的图纸列表PartNumberApply/DrawingsHistory?InsidePartNumber=料号&DrawingsType=
export function getDrawingsHistory(params) {
  return defHttp.get({
    url: Api.Prefix + '/PartNumberApply/DrawingsHistory',
    params: {
      ...params,
      DrawingsType: params.DrawingsType || 'DesensitizedDrawings',
    },
  });
}
// 获取料号的图纸列表PartNumberApply/DrawingsHistory?InsidePartNumber=料号&DrawingsType=
export function getFileInfoHistory(params) {
  return defHttp.get({
    url: Api.Prefix + '/FileInfo/History',
    params: {
      ...params,
      DrawingsType: params.DrawingsType || 'DesensitizedDrawings',
    },
  });
}
