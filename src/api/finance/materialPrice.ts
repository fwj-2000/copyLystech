import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { rejectPcc } from '/@/api/engineering/pcc';

enum Api {
  Prefix = '/api/Information',
}

/**
 * 材料价格库列表
 * @param data
 * @returns Promise
 */
// /api/Information/purchasequotation
export function getMaterialPriceList(data) {
  return defHttp.get({
    url: Api.Prefix + '/purchasequotation',
    data,
  });
}

// 撤回
// /api/Information/purchasequotation/Withdraw
export function withdrawPurchaseQuotation(data) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation/Withdraw',
    data,
  });
}

// 驳回
export function rejectPurchaseQuotation(data) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation/reject',
    data,
  });
}

/**
 * 材料内部编码模糊查询
 * @param data
 * @returns Promise
 */
export function getMaterialCodeList(data) {
  return defHttp.get({
    url: Api.Prefix + '/material/search',
    data,
  });
}

/**
 * 获取产品线列表
 * @param data
 * @returns Promise
 */
// api/Information/ProductLine/List
export function getProductLineList(data) {
  return defHttp.get({
    url: Api.Prefix + '/ProductLine/List',
    data,
  });
}

/**
 * 计量单位列表
 * @param data
 * @returns Promise
 */
// /api/Information/unit/keywordlist
export function getUnitListByKeyword(data) {
  return defHttp.get({
    url: Api.Prefix + '/unit/keywordlist',
    data,
  });
}

/**
 * 币别列表
 * @param data
 * @returns Promise
 */
// /api/Information/currency/list
export function getCurrencyList(data) {
  return defHttp.get({
    url: Api.Prefix + '/currency/list',
    data,
  });
}

/**
 * 获取当前汇率
 * @param data
 * @returns Promise
 */
// /api/Information/exchangerate/list
export function getExchangeRateList(data) {
  return defHttp.get({
    url: Api.Prefix + '/exchangerate/list',
    data,
  });
}

/**
 * 采购报价新增
 * @param data
 * @returns Promise
 */
// /api/Information/purchasequotation
export function addPurchaseQuotation(data) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation',
    data,
  });
}

/**
 * 修改采购报价
 * @param data
 * @returns Promise
 */
// /api/Information/purchasequotation/{id}
export function updatePurchaseQuotation(data) {
  return defHttp.put({
    url: Api.Prefix + '/purchasequotation/' + data.id,
    data,
  });
}

/**
 * 删除采购报价
 * @param data
 * @returns Promise
 */
// /api/Information/purchasequotation/{id}
export function deletePurchaseQuotation(id) {
  return defHttp.delete({
    url: Api.Prefix + '/purchasequotation/' + id,
  });
}

/**
 * 批量删除采购报价
 * @param data
 * @returns Promise
 */
// /api/Information/purchasequotation/bulk/delete
export function deletePurchaseQuotationList(data) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation/bulk/delete',
    data,
  });
}

/**
 * 批量导出采购报价
 * @param data
 * @returns Promise
 */
// /api/Information/purchasequotation/exportexcel
export function exportPurchaseQuotationList(data) {
  return defHttp.get({
    url: Api.Prefix + '/purchasequotation/exportexcel',
    data,
  });
}

// 模版下载
// /api/Information/purchasequotation/download/importtemplate
export function downloadTemplate() {
  return defHttp.get({
    url: Api.Prefix + '/purchasequotation/download/importtemplate',
  });
}
// 导入excel
// /api/Information/purchasequotation/import

export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/purchasequotation/import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}
// 保存excel
// /api/Information/purchasequotation/{batchcode}
export function savePurchaseQuotation(batchcode) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation/' + batchcode,
  });
}

// 获取原产国选项
// /api/Information/origincountry/list
export function getOriginCountryList(data) {
  return defHttp.get({
    url: Api.Prefix + '/origincountry/list',
    data,
  });
}

// 新增报材料价格
// /api/Information/purchasequotation
export function addMaterialPrice(data) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation',
    data,
  });
}
// 材料价格详情
// /api/Information/purchasequotation/{id}
export function getMaterialPriceDetail(data) {
  return defHttp.get({
    url: Api.Prefix + '/purchasequotation/' + data.id,
  });
}
// 修改报材料价格
// /api/Information/purchasequotation/{id}
export function updateMaterialPrice(data) {
  return defHttp.put({
    url: Api.Prefix + '/purchasequotation/' + data.id,
    data,
  });
}

// 批量删除报材料价格
// /api/Information/purchasequotation/bulk/delete
export function deleteMaterialPriceList(data) {
  return defHttp.post({
    url: Api.Prefix + '/purchasequotation/bulk/delete',
    data,
  });
}

// 价格库-获取当前导入任务
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/purchasequotation/ImportTask`,
  });
}

// 价格库-获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/purchasequotation/ImportTaskData`,
    data,
  });
}

// 价格库-取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/purchasequotation/ImportTaskCancel`,
  });
}

// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/purchasequotation/ImportTaskRead`,
  });
}

// 价格库查看-启用
export function enable(data) {
  return defHttp.post({
    url: Api.Prefix + `/purchasequotation/Enable`,
    data,
  });
}

// 价格库查看-禁用
export function disable(data) {
  return defHttp.post({
    url: Api.Prefix + `/purchasequotation/Disable`,
    data,
  });
}

// 价格库-提交
export function purchasequotationCommit(data) {
  return defHttp.post({
    url: Api.Prefix + `/purchasequotation/Commit`,
    data,
  });
}

// 价格库-文件上传
export function uploadInstallFile(data) {
  return defHttp.post({
    url: Api.Prefix + `/fileinfo/uploadfiles`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 价格库-按单号查询附件信息及价格信息
export function getPurchasequotationDetail(data) {
  return defHttp.get({
    url: Api.Prefix + `/purchasequotation/Detail`,
    data,
  });
}

// 价格库-文件下载
export function downloadfile(data) {
  return defHttp.get({
    url: Api.Prefix + '/fileinfo/downloadfile',
    data,
  });
}
