import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/Maintenance',
}

//查询
export function getPage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过ID查询
export function getMaintenanceById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addMaintenance(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateMaintenance(data) {
  return defHttp.put({ url: Api.Prefix, data });
}

//删除
export function deleteMaintenance(data) {
  return defHttp.delete({ url: Api.Prefix, data });
}
