import { defHttp } from '/@/utils/http/axios';
// import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/CustomsAffairsProduce',
}

/**
 * 获取列表
 * @param params
 * @returns
 */
export function getList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * 导出Excel
 * @param params
 * @returns
 */
export function exportExcel(params: any) {
  return defHttp.get({ url: Api.Prefix + '/Export', params });
}

/**
 * 获取详情
 * @param id
 * @returns
 */
export function getDetail(ids: Array<string>) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail', data: ids });
}

/**
 * 保存
 * @param list
 * @returns
 */
export function save(list: Array<any>) {
  return defHttp.post({ url: Api.Prefix, data: list });
}

/**
 * 暂存
 * @param list
 * @returns
 */
export function temporaryStorage(list: Array<any>) {
  return defHttp.post({ url: Api.Prefix + '/TemporaryStorage', data: list });
}

/**
 * 更新维护类型
 * @param data
 * @param data.ids 记录Id列表
 * @param data.maintainedType 维护类型 1-无需维护，2-启动维护
 * @returns
 */
export function updateMaintainedType(data: { ids: Array<string>; maintainedType: 1 | 2 }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/UpdateMaintainedType', data });
}
