import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/BaseData/Process',
  processcodePrefix = '/api/BaseData/processcode',
  processparaPrefix = '/api/BaseData/processpara',
}

//查询列表
export function getProcess(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addProcess(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProcess(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

// 获取是否需要手动个填写
// /BaseData/process/getneedcodefactory
export function getNeedCodeFactory(data) {
  return defHttp.get({ url: Api.Prefix + `/getneedcodefactory`, data });
}

//删除
export function deleteProcess(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteProcess(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportProcessExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/Export`, data });
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

// processcodePrefix-----------------------------

//查询列表
export function getProcessCode(data) {
  return defHttp.get({ url: Api.processcodePrefix, data });
}

//新增
export function addProcessCode(data) {
  return defHttp.post({ url: Api.processcodePrefix, data });
}

//修改
export function updateProcessCode(data) {
  return defHttp.put({ url: Api.processcodePrefix + `/${data.id}`, data });
}

//删除
export function deleteProcessCode(id) {
  return defHttp.delete({ url: Api.processcodePrefix + `/${id}` });
}

//批量删除
export function blukDeleteProcessCode(data) {
  return defHttp.post({ url: Api.processcodePrefix + '/bulkDelete', data });
}

//导出Excel
export function exportProcessCodeExcel(data) {
  return defHttp.get({ url: Api.processcodePrefix + `/export`, data });
}

// processParaPrefix-----------------------------

//查询列表
export function getProcessPara(data) {
  return defHttp.get({ url: Api.processparaPrefix, data });
}

//新增
export function addProcessPara(data) {
  return defHttp.post({ url: Api.processparaPrefix, data });
}

//修改
export function updateProcessPara(data) {
  return defHttp.put({ url: Api.processparaPrefix + `/${data.id}`, data });
}

//删除
export function deleteProcessPara(id) {
  return defHttp.delete({ url: Api.processparaPrefix + `/${id}` });
}

//批量删除
export function blukDeleteProcessPara(data) {
  return defHttp.post({ url: Api.processparaPrefix + '/bulkDelete', data });
}

//导出Excel
export function exportProcessParaExcel(data) {
  return defHttp.get({ url: Api.processparaPrefix + `/export`, data });
}

// 导入模板下载
export function paraTemplateDownload() {
  return defHttp.get({ url: Api.processparaPrefix + `/Download/ImportTemplate` });
}

// 导入预览
export function paraTmportPreview(data) {
  return defHttp.post({ url: Api.processparaPrefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

//保存导入的数据
export function paraTmportSave(data) {
  return defHttp.post({ url: Api.processparaPrefix + `/${data}` });
}
