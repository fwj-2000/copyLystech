import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/mps/ProjectComparison',
}

//查询列表
export function getProjectComparison(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过Id查询
export function getProjectComparisonById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addProjectComparison(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProjectComparison(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteProjectComparison(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteProjectComparison(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
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
export function importSave(batchCode: string, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}`, data });
}
