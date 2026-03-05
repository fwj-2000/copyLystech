import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/BaseData/FactoryAreaControl',
}

/**
 * @description 获取列表
 * @param params
 */
export function getFactoryAreaControlList(params: { currentPage?: number; pageSize?: number; factory?: string }) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 获取详情
 * @param id
 * @returns
 */
export function getFactoryAreaControlDetail(id: string) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

/**
 * @description 新增/修改
 * @param0 factory 工厂Code
 * @param1 isCustomsAffairsEAP 是否关务工程资料与生产资料合并
 * @param2 isSendMoldApplyPr 是否推送模具申请pr单
 * @param3 isSendMoldApplyPo 是否推送模具申请po单
 * @param4 moldApplyPriceControl 模具申请-推送主数据-价格控制参数
 * @param5 designEngineeringWorkNoPrefix 设计工程-工单号-前缀
 */
export function saveFactoryAreaControl(data: {
  id?: string;
  factory: string;
  isCustomsAffairsEAP?: boolean;
  isSendMoldApplyPr?: boolean;
  isSendMoldApplyPo?: boolean;
  moldApplyPriceControl?: string;
  designEngineeringWorkNoPrefix?: string;
}) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * @description 批量删除
 * @param ids
 */
export function bulkDeleteFactoryAreaControl(ids: string[]) {
  return defHttp.put({ url: Api.Prefix + `/BulkBackDelete`, data: ids });
}
