import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/FcData',
}

//获取厂区列表
export function getFactoryAreaList(data) {
  return defHttp.get({ url: '/api/Production/ProcessRulesTemplate/GetFactoryList', data });
}

//查询列表
export function getFcData(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//详情
export function getFcDataDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addFcData(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateFcData(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteFcData(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteFcData(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportFcDataExcel(data) {
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

// 增加批导校验
export function importValidate(data) {
  return defHttp.post({
    url: Api.Prefix + `/ConfirmDbTaskData/${data.batchCode}`,
    data,
  });
}

//查询产品类别列表
export function getBasePage(data) {
  return defHttp.get({ url: Api.Prefix + '/BasePage', data });
}

//保存产品类别
export function saveBase(data) {
  return defHttp.post({ url: Api.Prefix + '/SaveBase', data });
}

//校验当前用户是否导入过当前周的数据
export function isImported(data) {
  return defHttp.get({ url: Api.Prefix + '/IsImported', data });
}

// 变更保存
export function changeSave(data) {
  return defHttp.post({ url: Api.Prefix + '/SaveFcChange', data });
}

// 终止
export function fcStop(data) {
  return defHttp.post({ url: Api.Prefix + '/Abort', data });
}

// 推送3.8
export function SendDataTo3_8(data) {
  return defHttp.post({ url: Api.Prefix + '/SendDataTo3_8', data });
}
