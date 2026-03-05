import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/ProcessTask',
}

// 工序任务报表
export function getProcessTask(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

// 工序任务报表导出
export function processTaskExport(data) {
  return defHttp.post({ url: Api.Prefix + '/Export', data });
}
