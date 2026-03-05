import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/prinProxy',
}

// 设置打印参数，获取打印资源地址
export function setPrintData(data) {
  return defHttp.get({ url: '/print/setPrintData', data });
}
