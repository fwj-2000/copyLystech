import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/materialwarehouse',
}

// 获取列表
export function getList(data) {
  return defHttp.get({
    url: Api.Prefix,
    data,
  });
}
// 获取详情
export function getDetail(id) {
  return defHttp.get({
    url: Api.Prefix + '/' + id,
  });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({
    url: Api.Prefix + '/getdetail',
    data,
  });
}

// 新增
export function create(data) {
  return defHttp.post({
    url: Api.Prefix,
    data,
  });
}
// update
export function update(data) {
  return defHttp.put({
    url: Api.Prefix + '/' + data.Id,
    data: [data],
  });
}

/**
 * 修改
 * @param data
 * @returns
 */
export function updateInfo(data: any) {
  return defHttp.put({
    url: Api.Prefix + '/UpdateInfo',
    data: [data],
  });
}

// del
export function del(id) {
  return defHttp.delete({
    url: Api.Prefix + '/' + id,
  });
}

// del
export function batchDel(data) {
  return defHttp.post({
    url: Api.Prefix + '/bulk/delete',
    data,
  });
}

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importmaterialexportexcel`, data });
}

// 启用
export function enable(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/enable`, data });
}
// 停用
export function disable(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/disable`, data });
}

// 模板
export function template(data) {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//导出Excel
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/saveimport?batchCode=${data}` });
}

// 导入预览
export function importPreviewOrigin(data) {
  return defHttp.post({ url: Api.Prefix + `/importOriginal`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

//导出Excel /Information/materialwarehouse/SaveOriginal
export function importSaveOrigin(data) {
  return defHttp.post({ url: Api.Prefix + `/saveOriginal?batchCode=${data}` });
}

// 获取内部料号
export function getInnerMaterialNumber(data) {
  return defHttp.get({
    url: Api.Prefix + '/getinnermaterialnumber',
    data,
  });
}

export function getNodeDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/getnodelist`, data });
}

// 撤回
export function recall(data) {
  return defHttp.put({ url: Api.Prefix + `/bulkbackreview`, data });
}

// 驳回
export function reject(data) {
  return defHttp.put({ url: Api.Prefix + `/bulk/reject`, data });
}

// 审核
export function review(data) {
  return defHttp.put({ url: Api.Prefix + `/reviewed`, data });
}

// 规格
// 获取当前导入任务
export function getImportTask(data) {
  return defHttp.get({
    url: Api.Prefix + `/importtask`,
    data,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/importtaskdata`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask(data) {
  return defHttp.post({
    url: Api.Prefix + `/importtaskcancel?isOriginal=${data?.isOriginal}`,
  });
}
// 上报用户已阅
export function importTaskRead(data) {
  console.log(data);
  return defHttp.post({
    url: Api.Prefix + `/ImportTaskRead?isOriginal=${data?.isOriginal}`,
  });
}

// 根据八码查询  /Information/materialwarehouse/searchbyshortcode
export function getMetarialCode(data) {
  return defHttp.get({
    url: Api.Prefix + `/searchbyshortcode`,
    data,
  });
}

// 查看技术资料 /Information/materialwarehouse/{id}/technologyinfohistory
export function getFiles(id) {
  return defHttp.get({
    url: Api.Prefix + `/${id}/technologyinfohistory`,
  });
}

// 下载技术资料 /Information/materialwarehouse/{id}/download/downloadtechnologyinfo
export function fileDownload(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}/download/downloadtechnologyinfo` });
}
