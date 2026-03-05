import { defHttp } from '/@/utils/http/axios';

/**
 * @description 分页获取生产人员列表 
 
 */
export function getProductionPersonnelList(data) {
  return defHttp.get({
    url: `/api/basedata/productionpersonnel`,
    data,
  });
}

/**
 * @description 新增生产人员数据
 * @param mainProcess 主要制程
 * @param data.swipeUserId 制单员ID
 * @param data.receiveMoldUserIds 领料人ID集合
 * @param data.refundMoldUserIds 退料人ID集合
 */
export function addProductionPersonnel(data, mainProcess?: string) {
  return defHttp.post({
    url: `/api/basedata/productionpersonnel?mainProcess=${mainProcess}`,
    data,
  });
}

/**
 * @description 导出生产人员数据为Excel
 */
export function exportProductionPersonnel(data) {
  return defHttp.get({
    url: `/api/basedata/productionpersonnel/export`,
    data,
  });
}

/**
   * @description 获取生产人员详情
   * @param id 主键ID
   
   */
export function getProductionPersonnelDetail(id: string) {
  return defHttp.get({
    url: `/api/basedata/productionpersonnel/${id}`,
  });
}

/**
 * @description 修改生产人员数据
 * @param id 主键ID
 * @param swipeUserId 制单员ID
 * @param receiveMoldUserIds 领料人ID集合
 * @param refundMoldUserIds 退料人ID集合
 */
export function updateProductionPersonnel(id: string, data) {
  return defHttp.put({
    url: `/api/basedata/productionpersonnel/${id}`,
    data,
  });
}

/**
 * @description 批量审核生产人员数据
 * @param ids 主键ID数组
 */
export function bulkReviewProductionPersonnel(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/productionpersonnel/bulkbackreview`,
    data: ids,
  });
}

/**
 * @description 批量启用生产人员数据
 * @param ids 主键ID数组
 */
export function bulkEnableProductionPersonnel(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/productionpersonnel/bulkbackenable`,
    data: ids,
  });
}

/**
 * @description 批量禁用生产人员数据
 * @param ids 主键ID数组
 */
export function bulkDisableProductionPersonnel(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/productionpersonnel/bulkbackdisable`,
    data: ids,
  });
}

/**
 * @description 批量删除生产人员数据
 * @param ids 主键ID数组
 */
export function bulkDeleteProductionPersonnel(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/productionpersonnel/bulkbackdelete`,
    data: ids,
  });
}

/**
 * @description 获取领料人、退料人数据
 * @param swipeUserId 制单员 id
 */
export function getProductionPersonne(swipeUserId?: String) {
  return defHttp.get({
    url: `/api/basedata/productionpersonnel/GetProductionPersonne`,
    data: swipeUserId ? { swipeUserId } : null,
  });
}
/**
 * @description 反审核 /basedata/productionpersonnel/BulkReverseReview
 * @param ids 主键ID数组
 * */
export function bulkReverseReviewProductionBase(ids: string[]) {
  return defHttp.put({
    url: `/api/basedata/productionpersonnel/BulkReverseReview`,
    data: ids,
  });
}
