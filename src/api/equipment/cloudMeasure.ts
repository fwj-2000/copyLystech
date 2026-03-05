import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/CloudMeasure',
}

//上传模板
export function importTemplate(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportTemplate`, data });
}

//下载模板
export function exportTemplate(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportTemplate/`, data });
}

//上传数据
export function importData(code, data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData/${code}/`, data });
}

//导出报表
export function exportData(name, data) {
  return defHttp.post({ url: Api.Prefix + `/ExportData/${name}`, data });
}
//下载原始报表
export function downLoadData(id) {
  return defHttp.get({ url: Api.Prefix + `/DownloadData/${id}` });
}

//查询列表
export function getCloud(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//删除数据
export function deleteCloud(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}
