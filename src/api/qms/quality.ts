import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/quality/sap',
}

//查询sap列表
export function getLotnolist(data) {
  return defHttp.get({ url: Api.Prefix + '/getlotnolist', data });
}

//查询sap列表
export function getIqcmasterdatalist(data) {
  return defHttp.get({ url: Api.Prefix + '/iqc_apply/getiqcmasterdatalist', data });
}

export function getLotNoListByIqcchkno(data) {
  return defHttp.put({ url: Api.Prefix + '/IQC_Apply/getlotnolistbyiqcchkno', data });
}

// 导出Excel
export function exportIQCExpExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/iqc_apply/iqcexpexcel`, data });
}

// 创建预检单
export function createPreInspectionForm(data) {
  return defHttp.get({ url: Api.Prefix + `/iqc_apply/savedata`, data });
}

// // 上传附件
// export function upload(id, data) {
//   return defHttp.post({ url: Api.Prefix + `/${id}/upload/uploadtechnologyinfo`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
// }

// export function getFiles(id) {
//   return defHttp.get({
//     url: Api.Prefix + `/${id}/technologyinfohistory`,
//   });
// }

// // 下载
// export function fileDownload(id) {
//   return defHttp.get({ url: Api.Prefix + `/${id}/download/downloadtechnologyinfo` });
// }

// // 删除
// export function delFileDownload(id) {
//   return defHttp.get({ url: Api.Prefix + `/delete/deletetestreport/${id}` });
// }
