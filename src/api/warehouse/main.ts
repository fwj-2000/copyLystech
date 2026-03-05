import { defHttp } from '/@/utils/http/axios';

// 仓管主数据
/**
 * @description 分页获取仓库基础数据列表
 * @param mainProcess 主要制程
 * @param factory 工厂
 * @param shippingSpaceCode 仓位
 * @param enableStatus 是否启用
 * @param status 审核状态
 * @param creatorUserId 创建人ID
 * @param lastModifyUserId 修改人ID
 */
export function getWarehouseBaseList(data) {
  return defHttp.get({
    url: `/api/basedata/warehousebase`,
    data,
  });
}

/**
 * @description 新增仓库基础数据
 * @param data.factory 工厂代码
 * @param data.shippingSpaceCode 仓位编码
 * @param data.warehouseKeeperIds 仓管员ID集合
 * @param mainProcess 主要制程
 */
export function addWarehouseBase(data, mainProcess?: string) {
  return defHttp.post({
    url: `/api/basedata/warehousebase?mainProcess=${mainProcess}`,
    data,
  });
}

/**
 * @description 导出仓库基础数据为Excel
 * @param selectKey 导出字段集合，按逗号分隔
 * @param mainProcess 主要制程
 * @param factory 工厂
 * @param shippingSpaceCode 仓位
 * @param enableStatus 是否启用
 * @param status 审核状态
 * @param creatorUserId 创建人ID
 * @param lastModifyUserId 修改人ID
 */
export function exportWarehouseBase(data) {
  return defHttp.get({
    url: `/api/basedata/warehousebase/export`,
    data,
  });
}

/**
 * @description 获取仓库基础数据详情
 * @param id 主键ID
 */
export function getWarehouseBaseDetail(id: string) {
  return defHttp.get({
    url: `/api/basedata/warehousebase/${id}`,
  });
}

/**
 * @description 修改仓库基础数据
 * @param id 主键ID
 * @param data.factory 工厂代码
 * @param data.shippingSpaceCode 仓位编码
 * @param data.warehouseKeeperIds 仓管员ID集合
 * @param data.sapFactory  SAP工厂代码
 */
export function updateWarehouseBase(
  id: string,
  data: {
    factory: string;
    shippingSpaceCode: string;
    warehouseKeeperIds: string[];
    sapFactory: string;
  },
) {
  return defHttp.put({
    url: `/api/basedata/warehousebase/${id}`,
    data: data,
  });
}

/**
 * @description 批量审核仓库基础数据
 * @param ids 主键ID数组
 */
export function bulkReviewWarehouseBase(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/warehousebase/bulkbackreview`,
    data: ids,
  });
}

/**
 * @description 批量启用仓库基础数据
 * @param ids 主键ID数组
 */
export function bulkEnableWarehouseBase(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/warehousebase/bulkbackenable`,
    data: ids,
  });
}

/**
 * @description 批量禁用仓库基础数据
 * @param ids 主键ID数组
 */
export function bulkDisableWarehouseBase(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/warehousebase/bulkbackdisable`,
    data: ids,
  });
}

/**
 * @description 批量删除仓库基础数据
 * @param ids 主键ID数组
 */
export function bulkDeleteWarehouseBase(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/warehousebase/bulkbackdelete`,
    data: ids,
  });
}

/**
 * @description 反审核 /basedata/warehousebase/BulkReverseReview
 * @param ids 主键ID数组
 * */
export function bulkReverseReviewWarehouseBase(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/warehousebase/BulkReverseReview`,
    data: ids,
  });
}
