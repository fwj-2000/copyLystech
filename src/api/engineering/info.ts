import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
}

/**
 * 获取工程资料列表
 * @param data
 * @return
 */
export function getEngineerInfoList(data) {
  return defHttp.get({ url: Api.Prefix + `/engineeringinformation`, data });
}

// 获取内部料好列表
export function getPartNumberApplySearch(data) {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/searchcamelcase`, data });
}

/**
 * 批量转办
 * @param data
 * @returns
 */
export const engineerBatchTransfer = data => defHttp.post({ url: Api.Prefix + `/engineeringinformation/bulk/bulktransfer`, data });

/**
 * 获取工程资料详情信息
 * @param id
 * @returns
 */
export const getEngineerInfo = id => defHttp.get({ url: Api.Prefix + `/engineeringinformation/${id}` });

/**
 * 工程资料制作提交/修改
 * @param data
 * @returns
 */
export const updateEngineerInfo = data => defHttp.put({ url: Api.Prefix + '/engineeringinformation/updateengineering', data });

/**
 * 生产资料上传
 * @param data
 * @returns
 */
export const uploadProductiondrawings = (id, data) =>
  defHttp.post({ url: Api.Prefix + `/engineeringinformation/${id}/upload/productiondrawings`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });

/**
 * 工程图纸上传
 * @param data
 * @returns
 */
export const uploadEngineeringdrawings = (id, data) =>
  defHttp.post({ url: Api.Prefix + `/engineeringinformation/${id}/upload/engineeringdrawings`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });

// /api/Information/engineeringinformation/GetEngineeringHistoryList

/**
 * 工程资料历史记录
 * @param data
 * @returns
 */
export const getEngineeringHistoryList = id => defHttp.get({ url: Api.Prefix + `/engineeringinformation/GetEngineeringHistoryList?InnerMaterialNumber=${id}` });

/**
 * 获取材料清单数据
 * @param id
 * @returns
 */
export const getEngineeringMaterialList = id =>
  defHttp.get({ url: Api.Prefix + `/engineeringinformation/getengineeringmateriallist?materialCode=${id}&pageSize=100` });

/**
 * 获取计量单位数据
 * @returns
 */
export const getunitlist = () => defHttp.get({ url: Api.Prefix + `/engineeringinformation/getunitlist` });

/**
 * 获取工序清单数据
 * @param id
 * @returns
 */
export const getengineeringprocesslist = id =>
  defHttp.get({ url: Api.Prefix + `/engineeringinformation/getengineeringprocesslist?process=${id}&pageSize=100` });

// 导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/engineeringinformation/importengineeringInformationexportexcel`, data });
}

// 获取bom
export function getBomList(data) {
  return defHttp.put({ url: Api.Prefix + `/engineeringinformation/getdetaillist`, data });
}

// 获取bom详情
export function getBomDetail(Id) {
  return defHttp.get({ url: Api.Prefix + `/engineeringinformation/${Id}` });
}

// 暂存数据 /Information/engineeringinformation/pauseinfo
// export function storageBomDetail(data) {
//   return defHttp.put({ url: Api.Prefix + `/engineeringinformation/temporarystorage`, data });
// }
export function storageBomDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/engineeringinformation/pauseinfo`, data });
}
// 保存数据 /Information/engineeringinformation/updateinfo
// export function saveBomDetail(data) {
//   return defHttp.put({ url: Api.Prefix + `/engineeringinformation/updateengineering`, data });
// }
export function saveBomDetail(data) {
  return defHttp.put({ url: Api.Prefix + `/engineeringinformation/updateinfo`, data });
}

// 删除材料
export function delMaterial(id) {
  return defHttp.delete({ url: Api.Prefix + `/engineeringinformation/materialsdelete?id=${id}` });
}
// 删除包材
export function delPackMaterial(id) {
  return defHttp.delete({ url: Api.Prefix + `/engineeringinformation/packagingmaterialdelete?id=${id}` });
}
// 删除工序
export function delProcess(id) {
  return defHttp.delete({ url: Api.Prefix + `/engineeringinformation/processdelete?id=${id}` });
}
// 删除步距组号
export function delStep(id) {
  return defHttp.delete({ url: Api.Prefix + `/engineeringinformation/stepdistancedelete?id=${id}` });
}

// 驳回
export function reject(data) {
  return defHttp.post({ url: Api.Prefix + `/engineeringinformation/bulk/reject`, data });
}
// 撤回
export function bulkwithdraw(data) {
  return defHttp.post({ url: Api.Prefix + `/engineeringinformation/bulkwithdraw`, data });
}

// 引用历史数据
export function getDataHistory(data) {
  return defHttp.get({ url: Api.Prefix + `/engineeringinformation/GetEngineeringHistoryList`, data });
}

// 一次性功能：更新旧数据
export function handleOldData() {
  return defHttp.post({
    url: '/api/Information/EngineeringInformation/SyncisRate',
  });
}

/**
 * @description 与pcc等数据转换 /Information/engineeringinformation/converthistorydata
 * @returns
 */
export const getRecordTransfer = id => defHttp.post({ url: Api.Prefix + `/engineeringinformation/converthistorydata?id=${id}` });

// 添加为模板
// 调用模板
// 修改模板

export function createCode(data) {
  return defHttp.post({ url: 'api/system/DictionaryData', data });
}
