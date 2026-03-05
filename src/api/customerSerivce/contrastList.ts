import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/FcProjectComparison',
}

//获取厂区列表
export function getFactoryAreaList(data) {
  return defHttp.get({ url: '/api/Production/ProcessRulesTemplate/GetFactoryList', data });
}

//查询列表
export function getFcProjectComparison(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//详情
export function getFcProjectComparisonDetail(id) {
  return defHttp.get({ url: Api.Prefix + '/GetInfo' + `/${id}` });
}

//新增
export function addFcProjectComparison(data) {
  return defHttp.post({ url: Api.Prefix + '/Add', data });
}

//修改
export function updateFcProjectComparison(data) {
  return defHttp.post({ url: Api.Prefix + '/Update', data });
}

//删除
export function deleteFcProjectComparison(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteFcProjectComparison(data) {
  return defHttp.post({ url: Api.Prefix + '/Delete', data });
}

//导出Excel
export function exportExcel(data) {
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
