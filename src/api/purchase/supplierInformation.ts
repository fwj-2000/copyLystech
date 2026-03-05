/*
 * @Author: wenzhenjin
 * @Date: 2024-11-09 15:09:04
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-20 14:10:31
 * @FilePath: \lydc.server.web\src\api\purchase\supplierInformation.ts
 */
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/BaseData',
}
// 分页列表
// /api/BaseData/supplier
export function getBaseDataSupplier(data) {
  return defHttp.get({ url: Api.Prefix + `/supplier`, data });
}
// 详情
export function getBaseDataSupplierDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/supplier/${data.id}`, data });
}
// 新增
// /api/BaseData/supplier
export function addBaseDataSupplier(data) {
  return defHttp.post({ url: Api.Prefix + `/supplier`, data });
}
// 修改
// /api/BaseData/supplier/{id}
export function editBaseDataSupplier(data) {
  return defHttp.put({ url: Api.Prefix + `/supplier/${data.id}`, data });
}
// 删除
// /api/BaseData/supplier/{id}
export function delBaseDataSupplier(id) {
  return defHttp.delete({ url: Api.Prefix + `/supplier/${id}` });
}
// 批量删除
// /api/BaseData/supplier/bulkdelete
export function bulkdeleteBaseDataSupplier(data) {
  return defHttp.post({ url: Api.Prefix + `/supplier/bulkdelete`, data });
}
// 模版下载
// /api/BaseData/supplier/download/importtemplate
export function downloadBaseDataSupplierImportTemplate() {
  return defHttp.get({ url: Api.Prefix + `/supplier/download/importtemplate` });
}
// 保存
///api/BaseData/supplier/{batchcode}
export function saveBaseDataSupplier(batchcode, data) {
  return defHttp.post({ url: Api.Prefix + `/supplier/${batchcode}`, data });
}

// 导出
// /api/BaseData/supplier/export
export function exportBaseDataSupplier(data) {
  return defHttp.get({ url: Api.Prefix + `/supplier/export`, data });
}
// 导入供应商
// /api/BaseData/supplier/import
export function importBaseDataSupplier(data) {
  return defHttp.post({
    url: Api.Prefix + `/supplier/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
// SAP工厂
// /BaseData/factorysap/getsaplistall
export function getSapFactoryList(data) {
  return defHttp.get({ url: Api.Prefix + `/factorysap/getsaplistall`, data });
}

// 工作中心
// /api/BaseData/WorkCenter
export function getWorkCenterList(data) {
  return defHttp.get({ url: Api.Prefix + `/WorkCenter`, data });
}

// 工作中心下拉
// /api/BaseData/WorkCenter/List
export function getWorkCenterListSelect(data) {
  return defHttp.get({ url: Api.Prefix + `/WorkCenter/List`, data });
}

// 保存工作中心
// /api/BaseData/WorkCenter
export function saveWorkCenter(data) {
  return defHttp.post({ url: Api.Prefix + `/WorkCenter`, data });
}

// 修改工作中心
// /api/BaseData/WorkCenter
export function editWorkCenter(data) {
  return defHttp.post({ url: Api.Prefix + `/WorkCenter/Update`, data });
}

// 批量删除工作中心
// /api/BaseData/WorkCenter/batchdelete
export function batchdeleteWorkCenter(data) {
  return defHttp.post({ url: Api.Prefix + `/WorkCenter/batchdelete`, data });
}

// 同步SAP工作中心
// /api/BaseData/WorkCenter/getWorkCenterfromsap
export function getWorkCenterfromsap(data) {
  return defHttp.post({ url: Api.Prefix + `/WorkCenter/getWorkCenterfromsap`, data });
}

// 导出工作中心
// /api/BaseData/WorkCenter/export
export function exportWorkCenter(data) {
  return defHttp.get({ url: Api.Prefix + `/WorkCenter/export`, data });
}

// 工作中心启用
// /api/BaseData/WorkCenter/Enable
export function EnableWorkCenter(data) {
  return defHttp.post({ url: Api.Prefix + `/WorkCenter/Enable`, data });
}

// 工作中心禁用
// /api/BaseData/WorkCenter/Disable
export function DisableWorkCenter(data) {
  return defHttp.post({ url: Api.Prefix + `/WorkCenter/Disable`, data });
}

// 获取当前导入任务
// /api/BaseData/supplier/ImportTask
export function getImportTask(data) {
  return defHttp.get({ url: Api.Prefix + `/supplier/ImportTask`, data });
}
// 获取当前导入任务数据
// /api/BaseData/supplier/ImportTaskData
export function getImportTaskData(data) {
  return defHttp.get({ url: Api.Prefix + `/supplier/ImportTaskData`, data });
}
// 取消当前批导任务
// /api/BaseData/supplier/ImportTaskCancel
export function cancelImportTask() {
  return defHttp.post({ url: Api.Prefix + `/supplier/ImportTaskCancel` });
}
// 上报用户已阅
// /api/BaseData/supplier/ImportTaskCancel
export function importTaskRead() {
  return defHttp.post({ url: Api.Prefix + `/supplier/ImportTaskRead` });
}
