import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/production/TechnicalUpdateConfig',
}

//技改列表
export function getTechnicalUpdateConfig(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增技改
export function addTechnical(data) {
  return defHttp.post({
    url: Api.Prefix,
    data,
  });
}

// 修改技改
export function updateTechnical(data) {
  return defHttp.put({
    url: Api.Prefix,
    data,
  });
}

// 根据id查询数据
export function getTechnicalUpdateConfigById(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

// 删除单条
export function del(id) {
  return defHttp.delete({
    url: Api.Prefix + '/' + id,
  });
}

// 批量删除
export function bulkDelete(data) {
  return defHttp.post({
    url: Api.Prefix + '/BulkDelete',
    data,
  });
}

// 导出
export function Export(data) {
  return defHttp.get({
    url: Api.Prefix + '/Export',
    data,
  });
}
