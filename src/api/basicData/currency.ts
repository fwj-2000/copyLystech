import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/Currency',
}

//查询列表
export function getCurrency(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过ID查询
export function getCurrencyById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addCurrency(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateCurrency(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteCurrency(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteCurrency(data) {
  return defHttp.post({ url: Api.Prefix + '/BlukDelete', data });
}

//导出Excel
export function exportCurrencyExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

export function getISOCodeList(code = ' ') {
  return defHttp.get({ url: Api.Prefix + `/getISOCodeList/${code.keyword}` });
}
