import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/documentcontrol',
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

// 获取节点详情
export function getNodelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getnodelist', data });
}

// 新增
export function create(data) {
  return defHttp.post({
    url: Api.Prefix,
    data,
  });
}
// update
export function updateDc(data) {
  return defHttp.put({
    url: Api.Prefix + `/updateregister?id=${data.Id}&materialCode=${data.MaterialCode}`,
    data,
  });
}
// 暂存
export function storageDc(data) {
  return defHttp.put({
    url: Api.Prefix + `/temporarystorage?id=${data.Id}&materialCode=${data.MaterialCode}`,
    data,
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
  return defHttp.get({ url: Api.Prefix + `/importdocumentcontrolexportexcel`, data });
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
export function template() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

/**
 * @description 获取当前导入任务
 */
export function importTask(data) {
  return defHttp.get({ url: Api.Prefix + `/importtask`, data });
}

/**
 * @description 获取当前导入任务数据
 */
export function importTaskData(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportTaskData`, data });
}

/**
 * @description 取消导入任务
 */
export function cancelImportTask(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskCancel`, data });
}

/**
 * @description 导入任务 - 已阅
 */
export function importTaskRead(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportTaskRead`, data });
}

/**
 * @description 保存导入的预览数据
 * @param batchCode
 */
export function saveImportData(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + `/saveimport?batchCode=${batchCode}` });
}

//导出Excel
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
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

/**
 * @description 材料信息库 - 批量修改可选信息
 */
export function updateStrategy(data: Array<any>) {
  return defHttp.put({ url: Api.Prefix + `/UpdateStrategy`, data });
}

/**
 * @description 材料信息库 - 批量修改基础资料
 */
export function updateInfo(data: Array<any>) {
  return defHttp.put({ url: Api.Prefix + `/UpdateInfo`, data });
}

/**
 * @description 材料信息库 - 批量删除
 * @param ids id集合
 */
export function bulkDelete(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + `/bulk/delete`, data: ids });
}

/**
 * @description 材料信息库 - 获取材料八码列表
 * @param params
 */
export function getShortMaterialCodeList(params: { isFilterPm?: number; shortMaterialCode?: string }) {
  return defHttp.get({ url: Api.Prefix + `/GetShortMaterialCodeList`, params });
}

/**
 * @description 材料信息库 - 转办
 * @param params
 */
export function getTransferuserAPI(params: { ids: Array<string>; transferRemarks: string; transferUserId: string }) {
  return defHttp.post({ url: Api.Prefix + `/bulk/transfer`, params });
}

/**
 * 同步数据到3.8
 * @param ids
 * @returns
 */
export function sync38MaterialInfo(ids: Array<string>) {
  return defHttp.post({ url: Api.Prefix + '/bulk/sync38MaterialInfo', data: ids });
}

//获取材料八码
export function getMaterialCode(data) {
  return defHttp.get({ url: Api.Prefix + `/GetShortMaterialCodeList`, data });
}
