import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/stamp',
}
// 产品分页列表查询
// /api/product/product
// /stamp/product/productcodelist
export function getProductList(data) {
  console.trace(222222222);
  return defHttp.get({ url: Api.Prefix + '/product/productcodelist', data });
}

// 产品明细
// /stamp/product/qcitemlist
export function getProductDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/product/qcitemlist', data });
}

// 产品详情保存
// /api/product/product
export function saveProductDetail(data) {
  return defHttp.post({ url: Api.Prefix + '/product', data });
}

// 更新产品及质检项
// /product/product/{id}
export function updateProductDetail(data) {
  return defHttp.put({ url: Api.Prefix + '/product/' + data.id, data });
}

// 删除产品
// /product/product/{id}
export function deleteProductDetail(id) {
  return defHttp.delete({ url: Api.Prefix + '/product/' + id });
}

// 导入产品
// /stamp/product/importpreview
export function importPreview(data) {
  return defHttp.post({
    url: Api.Prefix + `/product/importpreview`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// /stamp/product/importtask
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/product/importtask`,
  });
}

// /stamp/product/importtaskdata
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/product/importtaskdata`,
    data,
  });
}

// /stamp/product/download/importtemplate
export function downloadImportTemplate() {
  return defHttp.get({
    url: Api.Prefix + `/product/download/importtemplate`,
  });
}

// /stamp/product/importtaskcancel
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/product/importtaskcancel`,
  });
}

// /stamp/product/importtaskread
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/product/importtaskread`,
  });
}

// 保存导入数据
// /stamp/product/saveimport
export function importTaskSave(data) {
  return defHttp.post({
    url: Api.Prefix + `/product/saveimport?batchCode=${data}`,
  });
}

// 质检操作分页列表
// /stamp/qcoperation/operaanalysis
export function getQcOperationList(data) {
  return defHttp.post({
    url: Api.Prefix + `/qcoperation/operaanalysis`,
    data,
  });
}

// 下载模板
// /stamp/qcoperation/importdata
export function downloadInspectImportTemplate(data) {
  return defHttp.get({
    url: Api.Prefix + `/qcoperation/download/importtemplate`,
    data,
  });
}

// 导入数据
// /stamp/qcoperation/importdata
export function importInspectData(data) {
  return defHttp.post({
    url: Api.Prefix + `/qcoperation/importdata`,
    data,
  });
}

// 质检数据分页列表查询
// /stamp/qcoperation/operarecord
export function getInspectDataList(data) {
  return defHttp.post({
    url: Api.Prefix + `/qcoperation/operarecord`,
    data,
  });
}

// 设置备注
// /stamp/qcoperation/remark
export function setRemark(data) {
  return defHttp.post({
    url: Api.Prefix + `/qcoperation/remark`,
    data,
  });
}

// 获取分析、记录数据
// /stamp/qcoperation/operadataanalysis
export function getInspectDataAnalysis(data) {
  console.trace(111111111);
  return defHttp.post({
    url: Api.Prefix + `/qcoperation/operadataanalysis`,
    data,
  });
}

// 启用数据
// /stamp/qcoperation/editfaienabledtorecal
export function changeStatus(data) {
  return defHttp.post({
    url: Api.Prefix + `/qcoperation/editfaienabledtorecal`,
    data,
  });
}

// 全量料号数据
// productversionlist
export function getAllProduct(data) {
  return defHttp.get({
    url: Api.Prefix + `/product/productversionlist`,
    data,
  });
}
