import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/mps/MaterialPTH',
}

/**
 * @description 获取列表
 * @param params
 */
export function getMaterialPTHList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 下载导入模板
 */
export function downloadTemplate() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

/**
 * @description 导入预览
 * @param data
 */
export function importPreview(data: any) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

/**
 * @description 导入数据保存
 * @param batchCode 导入版本号
 */
export function importSave(batchCode: string, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}`, data });
}

//新增
export function addMaterialPTH(data) {
  return defHttp.post({ url: Api.Prefix + '/Add', data });
}

//修改
export function updateMaterialPTH(data) {
  return defHttp.post({ url: Api.Prefix + '/Update', data });
}

//批量删除
export function blukDeleteMaterialPTH(data) {
  return defHttp.post({ url: Api.Prefix + '/Delete', data });
}

//获取详情
export function getMaterialPTHById(id) {
  return defHttp.get({ url: Api.Prefix + '/GetLastInfo' + `/${id}` });
}
