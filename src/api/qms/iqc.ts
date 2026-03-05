import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/iqcapply',
}

// 获取工厂下拉数据
export function getFactoryList() {
  return defHttp.get({
    url: Api.Prefix + '/GetFactoryList',
  });
}

// 获取当前登录用户
export function getCurrentUser() {
  return defHttp.get({
    url: Api.Prefix + '/GetCurrentUser',
  });
}

// 获取SAP采购收货单
export function getPurchaseReceiptOrder(data) {
  return defHttp.get({
    url: Api.Prefix + '/getpurchasereceiptorder',
    data,
  });
}

// 获取模具采购收货单
export function getMoldledgerOrder(data) {
  return defHttp.get({
    url: Api.Prefix + '/getmoldledgerorder',
    data,
  });
}

// 检验申请单分页列表
export function getIqcapplyList(data) {
  return defHttp.get({
    url: Api.Prefix,
    data,
  });
}

// 新增检验申请单
export function addIqcapply(data) {
  return defHttp.post({
    url: Api.Prefix,
    data,
  });
}

// 获取检测申请单
export function getApplyOrder(data) {
  return defHttp.get({
    url: Api.Prefix + '/getapplyorder',
    data,
  });
}

// 修改检测申请单
export function updateIqcapply(data) {
  return defHttp.put({
    url: `${Api.Prefix}/${data.id}`,
    data,
  });
}

// 取消检单
export function bulkCancelIqcapply(data) {
  return defHttp.post({
    url: Api.Prefix + '/bulkcancel',
    data,
  });
}

// 获取检测申请单数据录入信息
export function getApplyOrderDataEntry(data) {
  return defHttp.get({
    url: Api.Prefix + '/getapplyorderdataentry',
    data,
  });
}

// 获取尺寸报告中的数据
export function getMeasReportData(data) {
  return defHttp.get({
    url: Api.Prefix + '/getmeasreportdata',
    data,
  });
}

// 提交审核
export function submitaudit(data) {
  return defHttp.put({
    url: Api.Prefix + '/submitaudit',
    data,
  });
}

// 获取检测清单信息.
export function getapplyordertestitem(data) {
  return defHttp.get({
    url: Api.Prefix + '/getapplyordertestitem',
    data,
  });
}
// 获取检测清单信息-包装.
export function getApplyordertestitem(data) {
  return defHttp.get({
    url: Api.Prefix + '/getapplyorderpackage',
    data,
  });
}

// 保存检测清单信息.
export function saveTestitem(data) {
  return defHttp.post({
    url: Api.Prefix + '/savetestitem',
    data,
  });
}

// 保存检测清单信息.
export function savePackage(data) {
  return defHttp.post({
    url: Api.Prefix + '/savepackage',
    data,
  });
}

// 反审列表分页查询.
export function getantiauditdata(data) {
  return defHttp.get({
    url: Api.Prefix + '/getantiauditdata',
    data,
  });
}

export function exportExcel(data) {
  return defHttp.get({
    url: Api.Prefix + '/export',
    data,
  });
}

// 决策列表分页查询.
export function getdecisionorderdata(data) {
  return defHttp.get({
    url: Api.Prefix + '/getdecisionorderdata',
    data,
  });
}

// 批量SAP决策.
export function batchdecisionorder(data) {
  return defHttp.put({
    url: Api.Prefix + '/batchdecisionorder',
    data,
  });
}

// SAP决策.
// export function decisionorder(data) {
//   return defHttp.put({
//     url: Api.Prefix + '/decisionorder/',
//     data,
//   });
// }

//审核列表
export function getauditorderdata(data) {
  return defHttp.get({
    url: Api.Prefix + '/getauditorderdata',
    data,
  });
}

// 根据检测单号获取IQC审核数据.
export function getauditorderdetail(data) {
  return defHttp.get({
    url: Api.Prefix + '/getauditorderdetail',
    data,
  });
}

//审核
export function auditorder(data) {
  return defHttp.put({
    url: Api.Prefix + '/batchauditorder',
    data,
  });
}

//取消审核
export function antiaudit(data) {
  return defHttp.put({
    url: Api.Prefix + '/antiaudit',
    data,
  });
}

// 获取检测报告.
export function gettestreportdata(data) {
  return defHttp.get({
    url: Api.Prefix + '/gettestreportdata',
    data,
  });
}
