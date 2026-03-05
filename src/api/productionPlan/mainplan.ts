import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

// 主计划 量试计划
enum Api {
  Prefix = '/api/Information',
}

// 获取需求计划列表
export function getMainQuantityListAPI(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplan`, data });
}
// 获取需求计划的详情
export function getMainQuantityDetailAPI(id) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplan/${id}` });
}
// 更新需求计划
export function updateMainQuantityAPI(id, data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplan/${id}`, data });
}
// 转办
export function getMainQuantitytransferuserAPI(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativeplan/bulk/bulktransfer`, data });
}
// 导出
export function exportExleAPI(data) {
  return defHttp.get({
    url: Api.Prefix + '/quantitativeplan/importquantitativeplanexportexcel',
    data,
  });
}
/**
 * 导出材料BOM
 */
export function exportMaterialBOM(params: any) {
  return defHttp.get({
    url: Api.Prefix + '/quantitativeplanmc/ImportMaterialtExcel',
    params,
  });
}
// 驳回
export function rejectApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativeplan/bulk/reject',
    data,
  });
}
// 撤回 /api/Information/quantitativeplanmc/bulkwithdraw
export function recallApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativeplan/bulkwithdraw',
    data,
  });
}
// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplan/getdetail`, data });
}
// 暂存数据
export function storageDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplan/temporarystorage`, data });
}
// 保存数据
export function saveDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplan/submitquantitativeplan`, data });
}

// 交期

// 获取需求计划列表
export function getMcListAPI(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc`, data });
}
// 获取需求计划的详情
export function getMcDetailAPI(id) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc/${id}` });
}
// 获取详情列表
export function getMcDetails(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplanmc/getdetail`, data });
}
// 更新需求计划
export function updateMcAPI(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplanmc/updatequantitativemc`, data });
}
// 转办
export function getMctransferuserAPI(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativeplanmc/bulk/bulktransfer`, data });
}
// 导出
export function exportMcExleAPI(data) {
  return defHttp.get({
    url: Api.Prefix + '/quantitativeplanmc/importquantitativemcexportexcel',
    data,
  });
}
// 驳回
export function rejectMcApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativeplanmc/bulk/reject',
    data,
  });
}
// 撤回
export function recallMcApi(data) {
  return defHttp.post({
    url: Api.Prefix + '/quantitativeplanmc/bulkwithdraw',
    data,
  });
}
// 暂存数据
export function storageMcDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativeplanmc/temporarystorage`, data });
}

// 确认交期
// 获取需求计划列表
export function getPMListAPI(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativedeliveryconfirm`, data });
}
// 获取需求计划的详情
export function getPMDetailAPI(id) {
  return defHttp.get({ url: Api.Prefix + `/quantitativedeliveryconfirm/${id}` });
}
// 更新需求计划
export function updatePMAPI(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativedeliveryconfirm/upconfirm`, data });
}
// 转办
export function getPMtransferuserAPI(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativedeliveryconfirm/bulk/bulktransfer`, data });
}
// 导出表格
export function exportPMExleAPI(data) {
  return defHttp.get({
    url: Api.Prefix + '/quantitativedeliveryconfirm/importquantitativedeliveryplanexportexcel',
    data,
  });
}
/**
 * 交期确认 - 获取数据详情 /Information/quantitativedeliveryconfirm/getdetail
 * @param data
 * @param data.ids 数据id集合，接口获取详情时，优先级最高，存在该参数，就不该考虑其他参数的传值情况
 * @param data.applyNo 当不存在`data.ids`时，该接口将使用`data.applyNo`和`data.innerMaterialNumber`获取对应的详情，只支持获取单条数据详情
 * @param data.innerMaterialNumber 当不存在`data.ids`时，该接口将使用`data.applyNo`和`data.innerMaterialNumber`获取对应的详情，只支持获取单条数据详情
 * @returns
 */
export function getPMDetails(data: { ids?: Array<string>; applyNo?: string; innerMaterialNumber?: string }) {
  return defHttp.put({ url: Api.Prefix + `/quantitativedeliveryconfirm/getdetail`, data });
}
// 提交 /Information/quantitativedeliveryconfirm/updatequantitative
export function updatePMDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/quantitativedeliveryconfirm/updatequantitative`, data });
}

// 一键校验
export function checkAllAPI() {
  return defHttp.post({ url: Api.Prefix + `/quantitativedeliveryconfirm/SyncisSatisfy` });
}

// 模板
export function template() {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc/download/importtemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativeplanmc/import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 获取当前导入任务
 */
export function importTask(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc/importtask`, data });
}

/**
 * @description 获取当前导入任务数据
 */
export function importTaskData(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc/importtaskdata`, data });
}

/**
 * @description 取消导入任务
 */
export function cancelImportTask(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativeplanmc/ImportTaskCancel`, data });
}

/**
 * @description 导入任务 - 已阅
 */
export function importTaskRead(data) {
  return defHttp.post({ url: Api.Prefix + `/quantitativeplanmc/ImportTaskRead`, data });
}

/**
 * @description 保存导入的预览数据
 * @param batchCode
 */
export function saveImportData(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + `/quantitativeplanmc/saveimport?batchCode=${batchCode}` });
}

/**
 * @description 获取任务bom节点
 *  Information/QuantitativePlanMC/ExportBom
 * */
export function exportBom(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc/exportbom`, data });
}

/**
 * @description 获取任务bom节点
 *  Information/QuantitativePlanMC/ExportBom
 * */
export function getBomDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeplanmc/getbomdetail`, data });
}
