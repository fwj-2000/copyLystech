// src/api/information/moldTemporaryDelivery.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/TemporaryDelivery',
}

/**
 * @description 分页列表
 * @param params 查询参数
 */
export function getTemporaryDeliveryList(params) {
  return defHttp.get({
    url: Api.Prefix,
    params,
  });
}

/**
 * @description 新增/修改
 * @param data 表单数据
 */
export function saveOrUpdateTemporaryDelivery(data) {
  return defHttp.post({
    url: Api.Prefix,
    data,
  });
}

/**
 * @description 导出Excel
 * @param params 导出参数
 */
export function exportTemporaryDelivery(params) {
  return defHttp.get({
    url: Api.Prefix + '/Export',
    params,
  });
}

/**
 * @description 详情
 * @param id 主键ID
 */
export function getTemporaryDeliveryDetail(data) {
  return defHttp.put({
    url: Api.Prefix + '/GetDetail',
    data,
  });
}

/**
 * @description 修改备注
 * @param data 备注数据
 */
export function updateTemporaryDeliveryRemarks(data) {
  return defHttp.put({
    url: Api.Prefix + '/UpdateRemarks',
    data,
  });
}
