import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import qs from 'qs';
import { setObjToUrlParams } from '/@/utils';

enum Api {
  Prefix = '/api/Information',
}

/**
 * 量试需求列表
 * @param data
 * @returns
 */
export function getQuantitationApplyList(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeapply`, data });
}
/**
 * 量试需求列表-按料号
 * @param data
 * @returns
 */
export function getQuantitationApplyListLine(data) {
  return defHttp.get({ url: Api.Prefix + `/quantitativeapply/newpage`, data });
}

/**
 * 审核
 * @param id
 * @returns
 */
export const reviewQuantitationApply = id => defHttp.put({ url: Api.Prefix + `/quantitativeapply/launchreview?id=${id}` });

/**
 * 批量审核
 * @param data
 * @returns
 */
export const batchReviewQuantitation = data => defHttp.put({ url: Api.Prefix + `/quantitativeapply/bulklaunchreview`, data });

/**
 * 量试需求删除
 * @param id
 * @returns
 */
export function delQuantitationApply(id) {
  return defHttp.delete({ url: Api.Prefix + `/quantitativeapply/${id}` });
}

/**
 * 量试需求批量删除
 * @param data
 * @returns
 */
export const batchDelQuantitationApply = data => defHttp.post({ url: Api.Prefix + '/quantitativeapply/bulk/delete', data });

/**
 * 量试需求批量删除--通过id
 * @param data
 * @returns
 */
export const batchDelQuantitationApplyByIds = data => defHttp.put({ url: Api.Prefix + '/quantitativeapply/newbulkdelete', data });

/**
 * 新增量试需求
 * @param data
 * @returns
 */
export const createQuantitationApply = (data, params) => defHttp.put({ url: setObjToUrlParams(Api.Prefix + `/quantitativeapply/createapply`, params), data });

/**
 * 获取相同产品内部料号未结案的数据
 * /Information/quantitativeapply/GetQuantitativeApply/{demandType}
 *
 */
export const getQuantitativeApply = data => defHttp.post({ url: Api.Prefix + `/quantitativeapply/GetQuantitativeApply/${data.demandType}`, data });

/**
 * 根据内部料号查询信息
 * @param data
 * @returns
 */
export const getQuantitationApplyDetailByMaterial = data =>
  defHttp.get({ url: Api.Prefix + `/quantitativeapply/getinnermaterialnumber?${qs.stringify(data)}` });

/**
 * 根据工厂代码、工厂名称查询信息 ：MQ01/平湖一厂
 * @param data
 * @returns
 */
export const getFactoryList = data => defHttp.get({ url: Api.Prefix + `/quantitativeapply/getfactorylist?${qs.stringify(data)}` });
export const getFactorysList = data => defHttp.get({ url: Api.Prefix + `/quantitativeapply/getfactorylist`, data });

/***
 * 根据id查询详情
 * @param id
 * @returns
 */
export const getQuantitationApplyDetail = id => defHttp.get({ url: Api.Prefix + `/quantitativeapply/${id}` });

/**
 * 修改量试需求
 * @param params
 * @returns
 */
export const editQuantitationApply = (data, params) =>
  defHttp.put({
    url: setObjToUrlParams(Api.Prefix + `/quantitativeapply/updateapply`, params),
    data,
  });

/**
 * 下载量试需求模板
 * @returns
 */
export const downloadTemplate = () => defHttp.get({ url: Api.Prefix + '/quantitativeapply/download/importtemplate' });

/**
 * 导入excel
 * @param data
 * @returns
 */
export const importQuantitationApply = data =>
  defHttp.post({ url: Api.Prefix + '/quantitativeapply/import', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });

/**
 * 保存导入相间
 * @param data
 * @returns
 */
export const saveImportData = (code, data) => defHttp.post({ url: Api.Prefix + `/quantitativeapply/saveimport?batchCode=${code}`, data });

/**
 * 量试需求数据导出
 * @returns
 */
export const exportTableData = data => defHttp.get({ url: Api.Prefix + '/quantitativeapply/importquantitativeapplyexportexcel', data });

/**
 * 获取量试评审列表
 * @param data
 * @returns
 */
export const getQuantationReviewList = data => defHttp.get({ url: Api.Prefix + '/quantitativereview', data });

// /api/Information/quantitativereview/{id}&{transferuserid}

/**
 * 评审转办
 * @param id
 * @param data
 * @returns
 */
export const transferReview = data => defHttp.post({ url: Api.Prefix + `/quantitativereview/bulk/bulktransfer`, data });

/**
 * 查询量式评审详情信息
 * @param id
 * @returns
 */
export const getQuantationReviewInfo = data => defHttp.put({ url: Api.Prefix + `/quantitativereview/getdetail`, data });

/**
 * EPM评审
 * @param data
 * @returns
 */
export const quantitativeReview = data => defHttp.put({ url: Api.Prefix + `/quantitativereview/${data.Id}`, data });

/**
 * 查询内部料号
 * @param id
 * @returns
 */
export const getInnermaterialnumber = (data: {
  innerMaterialNumber?: string;
  insideProjectCode?: string;
  immediateCustomerCode?: string;
  factoryId?: string;
  pageSize?: number;
}) => defHttp.get({ url: Api.Prefix + `/quantitativeapply/getinnermaterialnumber`, data });

/**
 * 查询内部料号-分页版 GetInnerMaterialNumberPage
 * @param id
 * @returns
 */
export const getInnermaterialnumberPage = (data: {
  innerMaterialNumber?: string;
  insideProjectCode?: string;
  immediateCustomerCode?: string;
  factoryId?: string;
  pageSize?: number;
}) => defHttp.get({ url: Api.Prefix + `/quantitativeapply/getinnermaterialnumberpage`, data });

// 获取项目信息
export const getprojectlist = data => defHttp.get({ url: Api.Prefix + `/quantitativeapply/getprojectlist`, data });

// 获取项目信息/api/Information/quantitativeapply/getnodelist
export const getNodelist = data => defHttp.get({ url: Api.Prefix + `/quantitativeapply/getnodelist`, data });

// 保存草稿
export const savedraft = (data, params) =>
  defHttp.put({
    url: setObjToUrlParams(Api.Prefix + `/quantitativeapply/savedraft`, params),
    data,
  });

// 撤回
export const bulkbackreview = ids => defHttp.put({ url: Api.Prefix + `/quantitativeapply/bulkbackreview`, data: ids });

// 终止
export const bulkbacktermination = data => defHttp.put({ url: Api.Prefix + `/quantitativeapply/bulkbacktermination`, data });

// 转换生产类型
export const bulkconvertproductiontype = data => defHttp.put({ url: Api.Prefix + `/quantitativereview/bulkconvertproductiontype`, data });

// 提交评审
export const updateapply = data => defHttp.put({ url: Api.Prefix + `/quantitativereview/updateapply`, data });

// 上传工程图纸
export function uploadDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/quantitativereview/${id}/Upload/engineeringdrawings`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
// 删除图纸
export function deleteDrawings(data) {
  return defHttp.delete({
    url: setObjToUrlParams(Api.Prefix + `/quantitativereview/delete/deleteengineeringdrawings`, data),
  });
}
// 启用图纸
export function enableDrawings(data) {
  return defHttp.put({
    url: setObjToUrlParams(Api.Prefix + `/quantitativereview/engineeringdrawingsenable`, data),
  });
}
// 禁用
export function disableDrawings(data) {
  return defHttp.put({
    url: setObjToUrlParams(Api.Prefix + `/quantitativereview/engineeringdrawingsdisable`, data),
  });
}
// 工程图纸下载
export function downloadDrawings(id) {
  return defHttp.get({
    url: Api.Prefix + `/quantitativereview/${id}/download/downloadengineeringdrawings`,
  });
}
// 脱敏图纸下载
export function downloadDesensitizedDrawings(id) {
  return defHttp.get({
    url: Api.Prefix + `/quantitativereview/${id}/download/desensitizeddrawings`,
  });
}
// 查看图纸
export const drawingshistory = ({ id }) => defHttp.get({ url: Api.Prefix + `/quantitativereview/${id}/drawingshistory` });

// 批量导出
export const exportEmpTableData = data => defHttp.get({ url: Api.Prefix + '/quantitativereview/importquantitativereviewexportexcel', data });

// epm驳回
export const epmReject = data => defHttp.post({ url: Api.Prefix + '/quantitativereview/bulk/reject', data });

// epm撤回
export const epmRecall = data => defHttp.put({ url: Api.Prefix + '/quantitativereview/bulkbackreview', data });

// 获取当前导入任务
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/quantitativeapply/importtask`,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/quantitativeapply/importtaskdata`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/quantitativeapply/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/quantitativeapply/ImportTaskRead`,
  });
}

// 暂存 /api/Information/quantitativereview/temporarystorage
export function storageReview(data) {
  return defHttp.put({ url: Api.Prefix + '/quantitativereview/temporarystorage', data });
}

// 预览工程图纸
export function previewDrawingshistory(data) {
  return defHttp.get({
    url: Api.Prefix + `/quantitativereview/${data.Id}/previewfileinfo`,
  });
}

/**
 * 同步终止
 */
export function synTermination() {
  return defHttp.post({ url: Api.Prefix + '/QuantitativeApply/SynTermination' });
}
