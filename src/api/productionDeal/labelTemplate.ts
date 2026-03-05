import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/LabelTemplate',
}

//查询列表
export function getLabelTemplate(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取下拉框标签列表
export function getLabelTemplateList(data) {
  return defHttp.get({
    url: Api.Prefix + '/GetLabelTemplateList',
    data,
  });
}

//通过Id查询
export function getLabelTemplateById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addLabelTemplate(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateLabelTemplate(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteLabelTemplate(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteLabelTemplate(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportLabelTemplateExcel(data) {
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
