import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/mps/RemainingMaterial',
}

//查询列表
export function getRemainingMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//导出Excel
export function exportRemainingMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/Export`, data });
}
