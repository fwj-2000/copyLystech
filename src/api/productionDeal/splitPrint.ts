import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/SplitPrint',
}

// 分切打印分页
export function getSplitPrintPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 分切打印-新增
export function AddSplitPrint(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
