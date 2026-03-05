import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/harhor',
}

//查询列表
export function getHarhor(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//通过ID查询
export function getHarhorById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addHarhor(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateHarhor(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteHarhor(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteHarhor(data) {
  return defHttp.post({ url: Api.Prefix + '/BlukDelete', data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入
export function importData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

//导出Excel
export function exportHarhorExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//查询口岸列表
export function getHarhorList(harhorName: any = ' ') {
  if (typeof harhorName === 'object') {
    harhorName = harhorName.harhorName;
  }
  return defHttp.get({ url: Api.Prefix + `/getHarhorList/${harhorName}` });
}

/**
 * 通过口岸名称或者id获取口岸信息
 * @param data harhorNames: 名称列表；harhorIds：id列表
 * @returns
 */
export function getHarhorsByNamesOrIds(data: { harhorNames?: Array<string>; harhorIds?: Array<string> }) {
  return defHttp.post({ url: Api.Prefix + `/SelectMultiple`, data });
}
