import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/ProcessRoute',
}

//查询列表
export function getProcessRoute(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//通过ID查询
export function getProcessRouteById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addProcessRoute(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProcessRoute(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteProcessRoute(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//废弃工艺路线
export function obsoleteProcessRoute(data) {
  return defHttp.post({ url: Api.Prefix + '/Obsolete', data });
}

//批量删除
export function blukDeleteProcessRoute(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportProcessRouteExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

/**
 * 获取工序节点列表
 * @param keyword
 * @returns
 */
export const getProcessNodeList = keyword => defHttp.get({ url: `/api/BaseData/process/alllist?keyword=${keyword}` });

/**
 * 设置工艺路线
 * @param data
 * @returns
 */
export const saveRouteDetail = data => defHttp.put({ url: '/api/Production/processroute/saveroutedetail', data });

/**
 * 根据ID获取工艺路线详情
 * @param id
 * @returns
 */
export const getRouteDetail = id => defHttp.get({ url: `/api/Production/processroute/getroutedetail?id=${id}` });

/**
 * 复制工艺路线
 * @param id
 * @returns
 */
export const copyRoute = data => defHttp.post({ url: `/api/Production/processroute/copy`, data });

// 获取厂区.
export const ListByUserfactory = () => defHttp.get({ url: `/api/Information/Factory/ListByUserfactory` });
