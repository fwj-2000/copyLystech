import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/Factory',
}

// 获取工厂列表
export function getFactoryList() {
  return defHttp.get({ url: Api.Prefix + '/list' });
}

//查询列表
export function getFactory(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//通过ID查询
export function getFactoryById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addFactory(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateFactory(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteFactory(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteFactory(data) {
  return defHttp.post({ url: Api.Prefix + `/BulkDelete`, data });
}

//导出Excel
export function exportFactoryExcel(data) {
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

/**
 * 获取料号绑定的工厂可选列表
 * @param data.partNumber 料号
 * @param data.mainProcess 主进程
 * @param data.factory 工厂名称或者编码
 * @param data.factorys 工厂名称、工厂编码、工厂id 组成的数组
 * @param data.partNumberType 料号类型 `1`：成品 `2`：半成品，**不传默认为1**
 * @returns
 */
export function getPartNumberFactoryList(data: {
  partNumber?: string;
  mainProcess?: string | number;
  factory?: string;
  factorys?: Array<string>;
  partNumberType?: 1 | 2;
}) {
  return defHttp.post({ url: Api.Prefix + '/PartNumberFactoryList', data });
}

/**
 * 批量获取料号绑定的工厂的相关信息，
 * @param partNumberFactorys 数组，每个元素是一个数组，第一个元素是黏贴的料号，第二个元素是黏贴的工厂(包括工厂的Code，Name, `${Code}/${Name}`)
 * @returns
 */
export function getPartNumberFactoryBulkList(partNumberFactorys: Array<[string, string]>) {
  return defHttp.post({ url: Api.Prefix + '/PartNumberFactoryBulkList', data: { partNumberFactorys } });
}
