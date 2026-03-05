import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/mps/InTransit',
}

//查询列表
export function getInTransit(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取当前导入任务
// /api/Information/partnumberapply/ImportTask
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

// 导入模版下载
export function getTemplateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览修改
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(batchCode: string, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}`, data });
}
