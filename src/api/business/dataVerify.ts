import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information',
}

/**
 * 数据校验列表 /CoreCommon/verifyexcel/page
 * @param data
 * @returns
 */
export function getVerifyList(data: any) {
  return defHttp.get({ url: `${Api.Prefix}/verifyexcel/page`, params: data });
}

/*
 * 批量导出 /CoreCommon/verifyexcel/exportDataToExcel
 */
export function exportDataToExcel(idList) {
  return defHttp.get({ url: `${Api.Prefix}/verifyexcel/exportDataToExcel?ids=${idList}` });
}

/**
 *  数据预览
 * /Information/verifyexcel/preview
 * */
export function getUploadPreview(data: any) {
  return defHttp.get({ url: `${Api.Prefix}/verifyexcel/preview`, params: data });
}

/**
 *  删除数据
 * */
export function bulkdelete(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/verifyexcel/bulkdelete`, data: data });
}

/**
 * 更新校验的数据
 * */
export function updateexceldetail(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/verifyexcel/updateexceldetail`, data: data });
}

/**
 * /CoreCommon/verifyexcel/import
 * 导入数据
 * */
export function importData(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/verifyexcel/import`, data: data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

// 项目item Information/VerifyExcelProjectItem
export function getProjectItem(data: any) {
  return defHttp.get({ url: `${Api.Prefix}/VerifyExcelProjectItem`, params: data });
}
// /Information/VerifyExcelProjectItem
// 项目item post
export function addProjectItem(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/VerifyExcelProjectItem`, data: data });
}
// /Information/VerifyExcelProjectItem
// 项目item delete
export function deleteProjectItem(data) {
  return defHttp.post({ url: `${Api.Prefix}/VerifyExcelProjectItem/bulkdelete`, data });
}
// /Information/VerifyExcelProjectItem
// 项目item put
export function updateProjectItem(data: any, id: string) {
  return defHttp.put({ url: `${Api.Prefix}/VerifyExcelProjectItem/${id || ''}`, data: data });
}
// 导入导出模块
export function exportProjectItem(data) {
  return defHttp.get({ url: `${Api.Prefix}/VerifyExcelProjectItem/Export`, params: data });
}
export function importProjectItem(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/VerifyExcelProjectItem/import`, data: data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}
// 预览
export function saveImportProjectItem(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + '/VerifyExcelProjectItem' + `/${batchCode}` });
}
// 模板下载
export function downloadProjectItem() {
  return defHttp.get({ url: `${Api.Prefix}/VerifyExcelProjectItem/templateDownload` });
}

// Downstream
export function getDownstream(data: any) {
  return defHttp.get({ url: `${Api.Prefix}/VerifyExcelDownstreamSite`, params: data });
}
export function adDownstream(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/VerifyExcelDownstreamSite`, data: data });
}
export function deleteDownstream(data) {
  return defHttp.post({ url: `${Api.Prefix}/VerifyExcelDownstreamSite/bulkdelete `, data });
}
export function updateDownstream(data: any, id: string) {
  return defHttp.put({ url: `${Api.Prefix}/VerifyExcelDownstreamSite/${id || ''}`, data: data });
}
// 导入导出模块
export function exportDownstream(data) {
  return defHttp.get({ url: `${Api.Prefix}/VerifyExcelDownstreamSite/Export`, params: data });
}
export function importDownstream(data: any) {
  return defHttp.post({ url: `${Api.Prefix}/VerifyExcelDownstreamSite/import`, data: data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}
// 预览
export function saveImportData(batchCode: string) {
  return defHttp.post({ url: Api.Prefix + '/VerifyExcelDownstreamSite' + `/${batchCode}` });
}
// 模板下载
export function downloadDownstream() {
  return defHttp.get({ url: `${Api.Prefix}/VerifyExcelDownstreamSite/templateDownload` });
}
