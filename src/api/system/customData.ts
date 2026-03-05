import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/system/CustomData',
}

// 获取收藏菜单列表
export function getMenuCustomDataList(data) {
  return defHttp.get({ url: Api.Prefix + '/Menu', data });
}
// 获取表格自定义数据字典
export function getTableCustomDataList() {
  return defHttp.get({ url: Api.Prefix + '/Table' });
}
// 新增收藏菜单
export function createMenuCustomData(id) {
  return defHttp.post({ url: Api.Prefix + '/Menu/' + id });
}
// 新增或修改表格自定义数据
export function createOrUpdateTableCustomData(id, data) {
  return defHttp.post({ url: Api.Prefix + '/Table/' + id, data });
}
// 删除收藏菜单
export function delMenuCustomData(id) {
  return defHttp.delete({ url: Api.Prefix + '/Menu/' + id });
}
