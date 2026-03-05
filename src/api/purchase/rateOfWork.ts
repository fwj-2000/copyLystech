import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/baseData',
}
// 分页列表
// /api/basedata/laborrate
export function getBaseDataLaborrate(data) {
  return defHttp.get({ url: Api.Prefix + `/laborrate`, data });
}
// 模糊查询
// /api/BaseData/supplier/list
export function getBaseDataSupplierList(data) {
  return defHttp.get({ url: Api.Prefix + `/supplier/list`, data });
}
// 模糊匹配获取工序数据
// /api/BaseData/process/alllist
export function getBaseDataProcessAllist(data) {
  return defHttp.get({ url: Api.Prefix + `/process/alllist`, data });
}
// 获取工序数据
// /api/basedata/laborrate/getworkingprocedurelist
export function getBaseDataLaborrateGetworkingprocedurelist(data) {
  return defHttp.get({ url: Api.Prefix + `/laborrate/getworkingprocedurelist`, data });
}
// 获取工厂列表
// /api/basedata/shippingspace/getfactorylist
export function getBaseDataShippingspaceGetfactorylist(data) {
  return defHttp.get({ url: Api.Prefix + `/shippingspace/getfactorylist`, data });
}
// 新增
// /api/basedata/laborrate
export function addBaseDataLaborrate(data) {
  return defHttp.post({ url: Api.Prefix + `/laborrate`, data });
}

// 删除
// /api/basedata/laborrate/{id}
export function delBaseDataLaborrate(id) {
  return defHttp.delete({ url: Api.Prefix + `/laborrate/${id}` });
}
// 批量删除
// /api/basedata/laborrate/bulk/delete
export function bulkdeleteBaseDataLaborrate(data) {
  return defHttp.post({ url: Api.Prefix + `/laborrate/bulk/delete`, data });
}
// 修改
// /api/basedata/laborrate/{id}
export function editBaseDataLaborrate(data) {
  return defHttp.put({ url: Api.Prefix + `/laborrate/${data.id}`, data });
}
// 模版下载
// /api/basedata/laborrate/download/importtemplate
export function downloadBaseDataLaborrateImportTemplate() {
  return defHttp.get({ url: Api.Prefix + `/laborrate/download/importtemplate` });
}
// 保存
// /api/basedata/laborrate/{batchcode}
export function saveBaseDataLaborrate(batchcode) {
  return defHttp.post({ url: Api.Prefix + `/laborrate/${batchcode}` });
}
// 导出excel
// /api/basedata/laborrate/importlaborrateexportexcel
export function importLaborrateExportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/laborrate/importlaborrateexportexcel`, data });
}

// 导入excel
// /api/basedata/laborrate/import
export function importLaborrate(data) {
  return defHttp.post({
    url: Api.Prefix + `/laborrate/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
