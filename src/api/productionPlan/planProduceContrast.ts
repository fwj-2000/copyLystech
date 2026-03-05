import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/production/PlanProduceContrast',
}

//获取厂区列表
export function getFactoryAreaList(data) {
  return defHttp.get({ url: '/api/Production/ProcessRulesTemplate/GetFactoryList', data });
}

//分页列表
export function getPageList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//导入模板上传
export function uploadImportTemplate() {
  return defHttp.get({ url: Api.Prefix + `/Upload/ImportTemplate` });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

//删除
export function deleteData(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function deleteDataList(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//详情
export function getFcDataDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addData(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateData(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//导出Excel
export function exportFcDataExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/Export`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

//保存导入的数据
export function importSave(batchcode, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchcode}`, data });
}

// 获取当前导入任务
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/ImportTask`,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/ImportTaskData`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/ImportTaskRead`,
  });
}
