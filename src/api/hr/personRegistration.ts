import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/CrossBgSupport',
}
//查询
export function getCrossBgSupport(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取所有下拉内容
export function getDropDownList() {
  return defHttp.get({ url: Api.Prefix + '/enumOptions' });
}
// 导出
export function getExportList(data) {
  return defHttp.get({ url: Api.Prefix + '/Export', data });
}

//新增
export function addCrossBgSupport(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
//删除
export function deleteCrossBgSupport(data) {
  return defHttp.post({ url: Api.Prefix + '/bulkDelete', data });
}
//登记提醒
export function sendMessage(data) {
  return defHttp.post({ url: Api.Prefix + '/SendMessage', data });
}

//修改
export function updateCrossBgSupport(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//审批
export function approvalData(data) {
  return defHttp.post({ url: Api.Prefix + '/approveOrReject', data });
}
// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/templateDownload` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/save/${data}` });
}
// 获取当前导入任务.
export function importtask(data) {
  return defHttp.get({
    url: Api.Prefix + '/importtask',
    data,
  });
}

// 获取当前导入任务数据.
export function importtaskdata(data) {
  return defHttp.get({
    url: Api.Prefix + '/importtaskdata',
    data,
  });
}

// 取消当前导入任务.
export function importtaskcancel(data) {
  return defHttp.post({
    url: Api.Prefix + '/importtaskcancel',
    data,
  });
}
