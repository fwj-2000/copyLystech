import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/businessscope',
  Equipmentledgerfix = '/api/Production/equipmentledger',
}

// 业务范围维护分页
export function getBusinessscopePage(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取BU下拉数据.
export function getbulist(data) {
  return defHttp.get({ url: Api.Prefix + '/getbulist', data });
}

// 获取维护在业务范围的BU下拉数据
export function getBizScopeBulist(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/getbulist', data });
}

// 获取已存在的业务范围下拉数据.
export function getbusinessscopelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getbusinessscopelist', data });
}

// 根据SAP业务范围下拉数据--排除已存在的业务范围（业务范围维护新增弹窗列表）.
export function getsapbusinessscopelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getsapbusinessscopelist', data });
}

// 业务范围维护-新增
export function businessscopeAdd(data) {
  return defHttp.post({ url: Api.Prefix + '/add', data });
}

// 根据BU获取厂区下拉数据.
export function getfactorylist(data) {
  return defHttp.get({ url: Api.Prefix + '/getfactorylist', data });
}

// 业务范围维护-编辑
export function businessscopeSave(data) {
  return defHttp.post({ url: Api.Prefix + '/save', data });
}

// 业务范围维护-批量删除
export function businessscopeBulkDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

// 业务范围维护-批量导出
export function businessscopeExport(data) {
  return defHttp.get({ url: Api.Prefix + '/export', data });
}

// SAP台账-获取业务范围下拉数据.
export function getLedgerbusinessscopelist(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/getbusinessscopelist', data });
}

// SAP台账 - 获取设备编码下拉数据 -- 默认返回50条.
export function getequipmentcodelist(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/getequipmentcodelist', data });
}

// SAP台账-分页
export function getEquipmentledgerPage(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix, data });
}

// SAP台账-根据业务范围同步SAP设备台账.
export function syncsapequipmentledger(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/syncsapequipmentledger', data });
}

// SAP台账-导出Excel.
export function equipmentledgerExport(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/export', data });
}

// SAP台账-获取所有业务范围下拉数据.
export function getallbusinessscopelist(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/getallbusinessscopelist', data });
}

// 设备盘点明细-分页列表
export function inventorypage(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/inventorypage', data });
}

// 设备盘点明细-SBU小厂下拉列表
export function getfactoryarealist(data) {
  return defHttp.get({ url: Api.Equipmentledgerfix + '/getfactoryarealist', data });
}

// 设备盘点明细-新增
export function setEquipmentledger(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix, data });
}

// 设备盘点明细-提交申请
export function equipmentledgerCommitapply(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/commitapply', data });
}

// 设备盘点明细-批量删除.
export function equipmentledgerDelete(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/bulk/delete', data });
}

// 设备盘点明细-同步3.8
export function syncEquipmentLedger() {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/SyncEquipmentLedger' });
}

// 校验是否能修改数据.
export function iscanupdata(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/iscanupdata', data });
}

// 导入excel.
export function equipmentledgerImport(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/import', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

// 导入保存.
export function equipmentledgerImportSave(batchcode, data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/' + batchcode,
    data,
  });
}

// 导入模板下载.
export function importtemplate(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/download/importtemplate',
    data,
  });
}

// 获取当前导入任务.
export function importtask(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/importtask',
    data,
  });
}

// 获取当前导入任务数据.
export function importtaskdata(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/importtaskdata',
    data,
  });
}

// 取消当前导入任务.
export function importtaskcancel(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/importtaskcancel',
    data,
  });
}

// 已阅（对当前批导任务的结果进行已阅，保存成功或者异常终止的情况需要用户已阅结果，并主动已阅）.
export function importtaskread(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/importtaskread',
    data,
  });
}

// 设备盘点明细-导出Excel
export function exportinventory(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/exportinventory',
    data,
  });
}

// 设备盘点明细审批-分页列表.
export function getBatchpage(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/batchpage',
    data,
  });
}

// 设备盘点明细审批-审核同意.
export function auditagree(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/bulk/auditagree',
    data,
  });
}

// 设备盘点明细审批-审核驳回.
export function auditreject(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/bulk/auditreject',
    data,
  });
}

// 设备盘点明细审批-审核撤回.
export function auditwithdraw(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/bulk/auditwithdraw',
    data,
  });
}

// 设备盘点明细审批-催办.
export function flowreminder(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/bulk/flowreminder',
    data,
  });
}

// 设备盘点明细审批-废弃.
export function abandon(data) {
  return defHttp.post({
    url: Api.Equipmentledgerfix + '/bulk/abandon',
    data,
  });
}

// 台账对标盘点明细-分页列表
export function comparepage(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/comparepage',
    data,
  });
}

// 台账对标盘点明细-导出Excel.
export function exportcompare(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/exportcompare',
    data,
  });
}

// 汇总分析-分页列表.
export function countlist(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/countlist',
    data,
  });
}

// 汇总分析- 导出Excel.
export function exportcount(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/exportcount',
    data,
  });
}

// 汇总分析- 汇总分析明细.
export function countdetailpage(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/countdetailpage',
    data,
  });
}

// 汇总分析- 汇总分析明细导出Excel.
export function exportcountdetail(data) {
  return defHttp.get({
    url: Api.Equipmentledgerfix + '/exportcountdetail',
    data,
  });
}

// 设备盘点明细-提交前校验
export function checkCompareResult(data) {
  return defHttp.post({ url: Api.Equipmentledgerfix + '/checkCompareResult', data });
}
