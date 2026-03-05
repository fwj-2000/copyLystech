import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/ProductionPlanBoard',
}

// 获取锁屏看板数据
export function getLockScreenList(data) {
  return defHttp.get({
    url: Api.Prefix + '/GetLockScreenList',
    data,
  });
}
