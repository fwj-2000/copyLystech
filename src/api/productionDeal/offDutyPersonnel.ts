import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/takeleave',
}

//查询列表
export function getTakeleavePage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增、编辑
export function takeleaveEdit(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//批量删除
export function blukDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}
