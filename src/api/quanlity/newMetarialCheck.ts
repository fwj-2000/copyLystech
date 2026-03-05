import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { setObjToUrlParams } from '/@/utils';

enum Api {
  Prefix = '/api/Information/materialdevelopiqccheck',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 修改 /Information/materialdevelopiqccheck/updateiqc
export function updateNewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/updateiqc', data });
}

// 暂存
export function storageNewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/temporarystorage', data });
}

// 获取详情
// export function getDetails(data, all: true | false = true) {
//   return defHttp.put({ url: Api.Prefix + `/getsendsamplesrecord?all=${all}`, data });
// }
export function getDetails(data, all: true | false = true) {
  return defHttp.put({ url: Api.Prefix + `/getsendsamplesrecord`, data });
}
// 审核
export function reviewMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

// 撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}

//导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importqualitydesensitizationexportexcel`, data });
}

// 下载报告
export function downloadReport(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}/download/downloadtestreport` });
}

// 上传附件 /Information/materialdevelopiqccheck/{id}/upload/uploadtestreport
export function upload(id, data) {
  return defHttp.post({ url: Api.Prefix + `/${id}/upload/uploadtestreport`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

export function getReports(id) {
  return defHttp.get({
    url: Api.Prefix + `/${id}/testreporthistory`,
  });
}

// 下载
export function fileDownload(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}/download/downloadtestreport` });
}

// 启用
export function enableFile(data) {
  return defHttp.put({
    url: setObjToUrlParams(Api.Prefix + `/testreportenable`, data),
  });
}
// 禁用
export function disableFile(data) {
  return defHttp.get({ url: setObjToUrlParams(Api.Prefix + `/testreportdisable`, data) });
}

// 查看检测历史记录
export function getcheckHistory(data) {
  return defHttp.get({ url: Api.Prefix + `/getmaterialtestinghistorys`, data });
}

// 转办
export function transferMetariaCheck(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/bulktransfer', data });
}
