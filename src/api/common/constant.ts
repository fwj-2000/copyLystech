import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 获取计量单位列表
export function getunitList(keyword) {
  return defHttp.get({
    url: Api.Prefix + '/unit/keywordlist',
    data: {
      keyword,
    },
  });
}
