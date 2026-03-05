import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/PackingInfo',
}

//查询列表
export function getPackingInfo(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getPackingInfoById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addPackingInfo(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// export function getMaterialCodeList(data) {
//   return defHttp.get({
//     url: Api.Prefix + '/material/search',
//     data,
//   });
// }

//修改
export function updatePackingInfo(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deletePackingInfo(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeletePackingInfo(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportPackingInfoExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}
