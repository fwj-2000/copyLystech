import { defHttp } from '/@/utils/http/axios';

/**
 * @description 分页列表
 */
export function getMaterialConfirmList(data) {
  return defHttp.get({ url: '/api/information/materialconfirm', data });
}

/**
 * @description 导出Excel
 */
export function exportMaterialConfirmExcel(data) {
  return defHttp.get({ url: '/api/information/materialconfirm/ImportExportExcel', data });
}

/**
 * @description 获取详情
 */
export function getMaterialConfirmDetails(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/getdetail', data });
}

/**
 * @description 获取选中需重新推荐信息
 */
export function getAlreadyRepeatedInfo(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/getalreadyrepeatedinfo', data });
}

/**
 * @description 修改提交
 */
export function commitMaterialConfirm(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/commit', data });
}

/**
 * @description 发送邮件
 */
export function sendEmail(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/sendEmail', data });
}

/**
 * @description 送样提交
 */
export function sendSamples(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/sendsamples', data });
}

/**
 * @description 批量撤回
 */
export function bulkBackReview(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/bulkbackreview', data });
}

/**
 * @description 批量终止
 */
export function bulkBackTermination(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/bulkbacktermination', data });
}

/**
 * @description 重新推荐提交
 */
export function resendRecommend(data) {
  return defHttp.put({ url: '/api/information/materialconfirm/resendrecommend', data });
}

/**
 * @description 获取节点列表
 */
export function getNodelist(data) {
  return defHttp.get({ url: '/api/Information/materialdeveloppurchase/getnodelist', data });
}

// 创建字典
export function materialCode(data) {
  return defHttp.post({
    url: 'api/system/DictionaryData',
    data,
  });
}

// const a = {
//   parentId: '0', // 固定值
//   fullName: ‘供应商简称’, // title
//   enCode: 'manufacturerId', //field||dataIndex
//   sortCode: 0,// 固定值
//   enabledMark: 1,// 固定值
//   id: '',// 固定值
//   dictionaryTypeId: '5',// 固定值
// };
