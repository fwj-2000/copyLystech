import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/MaterialDevelApplyTechnology',
}

// 查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//导出
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportMaterialDevelApplyExportExcel`, data });
}

//详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + 'GetDetail', data });
}

//提交
export function reviewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//驳回
export function rejectMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulk/reject', data });
}

//批量撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}
