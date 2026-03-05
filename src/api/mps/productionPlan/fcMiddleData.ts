import { defHttp } from '/@/utils/http/axios';
import { STATUS_ENUM } from '/@/views/basicData/originCountry/config';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/mps/FcMiddleData',
}

export interface RequestParam {
  pageSize: number;
  currentPage: number;
  /**
   * 代码
   */
  code?: string;
  /**
   * 导出类型 (0：分页数据，其他：全部数据).
   */
  dataType?: string;
  /**
   * id.
   */
  id?: string;
  keyword?: string;
  menuId?: string;
  /**
   * 名称.
   */
  name?: string;
  /**
   * 组织ID.
   */
  orgId?: string;
  /**
   * 备注.
   */
  remark?: string;
  /**
   * 选择的导出 字段集合 按 , 号隔开.
   */
  selectKey?: string;
  /**
   * 简称.
   */
  shortName?: string;
  sidx?: string;
  sort?: string;
  /**
   * 状态.
   */
  status?: `${STATUS_ENUM}`;
}

/**
 * 单项数据对象类型
 */
export interface OrigincountryItem {
  /**
   * 代码.
   */
  code?: null | string;
  /**
   * id.
   */
  id?: null | string;
  /**
   * 名称.
   */
  name?: null | string;
  /**
   * 组织ID.
   */
  orgId?: null | string;
  /**
   * 备注.
   */
  remark?: null | string;
  /**
   * 简称.
   */
  shortName?: null | string;
  status?: `${STATUS_ENUM}`;
}

/**
 * @description 获取列表
 * @param params
 */
export function getFcMiddleDataList(params: RequestParam) {
  return defHttp.get<{ data: { list: Array<OrigincountryItem>; pagination: { total: number } } }>({ url: Api.Prefix, params });
}

/**
 * @description 下载导入模板
 */
export function downloadTemplate() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

/**
 * @description 导入预览
 * @param data
 */
export function importPreview(data: any) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

/**
 * @description 导入数据保存
 * @param batchCode 导入版本号
 */
export function saveImportData(batchCode: string, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}`, data });
}

/**
 * @description 重新推送数据
 */
export function againPushMds(data) {
  return defHttp.post({ url: Api.Prefix + `/againPushMds`, data });
}
