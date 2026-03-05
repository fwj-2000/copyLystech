import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/EngineeringInformation',
}

/**
 * 获取BOM结构
 * @param id 量试订单评审主键Id
 */
export function getBomStructure(id: string) {
  return defHttp.get({
    url: `${Api.Prefix}/${id}/BOM`,
  });
}

/**
 * 获取BOM详情
 * @param id BOM主键Id
 */
export function getBomDetail(id: string) {
  return defHttp.get({
    url: `${Api.Prefix}/${id}/BOMDetail`,
  });
}

/**
 * 新增成品BOM
 * @param params 请求参数
 */
export function saveFinishedParts(params: any) {
  return defHttp.post({
    url: `${Api.Prefix}/FinishedParts`,
    data: params,
  });
}

/**
 * 修改成品BOM
 * @param id 主键Id
 * @param params 请求参数
 */
export function updateFinishedParts(id: string, params: any) {
  return defHttp.put({
    url: `${Api.Prefix}/${id}/FinishedParts`,
    data: params,
  });
}

/**
 * 新增半成品BOM
 * @param params 请求参数
 */
export function saveHalfFinishedParts(params: any) {
  return defHttp.post({
    url: `${Api.Prefix}/HalfFinishedParts`,
    data: params,
  });
}

/**
 * 修改半成品BOM
 * @param id 量试订单评审主键Id
 * @param params 请求参数
 */
export function updateHalfFinishedParts(id: string, params: any) {
  return defHttp.put({
    url: `${Api.Prefix}/${id}/HalfFinishedParts`,
    data: params,
  });
}
