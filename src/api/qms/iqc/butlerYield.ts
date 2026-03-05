import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/maccamerarate',
}
// 获取厂别数组
export function getfloor(data) {
  return defHttp.get({ url: Api.Prefix + '/getfloor', data });
}

// 分页
export function getpage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 查询机台号列表.
export function getmachine(data) {
  return defHttp.get({ url: Api.Prefix + '/getmachine', data });
}

// 批量导出
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + '/ExportData', data });
}
