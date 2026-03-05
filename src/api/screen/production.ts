import { defHttp } from '/@/utils/http/axios';

enum Api {
  PREFIX = '/api/', // 报表通用
}

// 获取所有机台最新的数据
export function getlatest() {
  return defHttp.get({ url: `${Api.PREFIX}Equipment/Skynet/aoiuploaddata/getlatest` });
}
