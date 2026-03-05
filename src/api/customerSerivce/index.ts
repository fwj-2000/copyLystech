import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// 获取客户名称列表
export function getCustomerList(data) {
  return defHttp.get({
    url: Api.Prefix + '/customer/list',
    data,
  });
}

// 获取工厂列表
export function getFactoryList(data) {
  return defHttp.get({ url: Api.Prefix + '/Factory/list', data });
}

/**
 * 查询内部料号
 * @param data
 * @returns
 */
export function getinnermaterialnumberlist(data) {
  return defHttp.get({
    url: Api.Prefix + `/filingsapply/getinnermaterialnumberlist`,
    data,
  });
}

/**
 * 查询备案需求列表
 * @param data
 * @returns
 */
export function getFilingsList(data) {
  return defHttp.get({
    url: Api.Prefix + `/filingsapply/PendingPage`,
    data,
  });
}

/**
 * 查询备案需求列表
 * @param data
 * @returns
 */
export function getCreatedFilingsList(data) {
  return defHttp.get({
    url: Api.Prefix + `/filingsapply/EstablishedPage`,
    data,
  });
}

/**
 * 备案需求-状态处理-撤回/终止
 * @param data
 * @returns
 */
export function handleApplyStatus(data) {
  return defHttp.post({
    url: Api.Prefix + `/filingsapply/HandleApplyStatus`,
    data,
  });
}

/**
 * 新增备案需求
 * @param data
 * @returns
 */
export const createFilingsApply = ({ data }) => defHttp.put({ url: Api.Prefix + `/filingsapply/createapply`, data });

/***
 * 根据id查询详情
 * @param id
 * @returns
 */
export const getFilingsApplyDetail = (data: { id: String; qid?: String }) => defHttp.get({ url: Api.Prefix + `/filingsapply/getfilingsapplydetailbyid`, data });

// 备案需求-详情
export const getFilingsCustomerDetail = id => defHttp.get({ url: Api.Prefix + `/filingsapply/customer/${id}` });

// 终版备案表

/**
 * 终版备案表-列表查询
 * @param data
 * @returns
 */
export const getFinalFilingsList = data => defHttp.get({ url: Api.Prefix + `/FilingsFinal/Page`, data });

/**
 * 终版备案表-详情
 * @param data
 * @returns
 */
export const getFinalFilingsDetail = ({ innerMaterialNumber, version }) =>
  defHttp.get({ url: Api.Prefix + `/FilingsFinal/detail?innerMaterialNumber=${innerMaterialNumber}&version=${version}` });

/**
 * 终版备案表-详情提交
 * @param data
 * @returns
 */
export const filingDetailSubmit = data => defHttp.post({ url: Api.Prefix + `/FilingsFinal/detailSubmit`, data });

/**
 * 终版备案表-获取内部料件号的版本列表
 * @param id
 * @returns
 */
export const getFilingVersionList = id => defHttp.get({ url: Api.Prefix + `/FilingsFinal/GetVersionList?innerMaterialNumber=${id}` });

/**
 * 终版备案表-根据产品内部料号获取备案单相关数据
 * @param data
 * @returns
 */
export const getDataByInnerMaterialNumber = (type, data) => defHttp.post({ url: Api.Prefix + `/FilingsFinal/GetDataByInnerMaterialNumber?type=${type}`, data });

/**
 * 终版备案表-出口内地备案表-暂存/提交
 * @param type
 * @param data
 * @returns
 */
// 1-暂存操作，2-提交操作
export const createMainlandFilings = (type, data) => defHttp.post({ url: Api.Prefix + `/FilingsFinal/CreateMainlandFilings/${type}`, data });

/**
 * 终版备案表-出港备案表-暂存/提交
 * @param type
 * @param data
 * @returns
 */
export const createDepartureFilings = (type, data) => defHttp.post({ url: Api.Prefix + `/FilingsFinal/CreateDepartureFilings/${type}`, data });

/****  工程-关务-备案资料  ****/

/**
 * 工程-备案资料-待维护-查询
 * @param data
 * @returns
 */
export const getUnmaintenanceList = data => defHttp.get({ url: Api.Prefix + `/FilingApply/gc/unmaintenance`, data });

/**
 * 工程-备案资料-已维护-查询
 * @param data
 * @returns
 */
export const getMaintenanceList = data => defHttp.get({ url: Api.Prefix + `/FilingApply/gc/maintenance`, data });

// /api/Information/FilingApply/engine/maintenance/{type}

/**
 * 工程-备案资料-维护单操作
 * @param data
 * @returns
 */
export const updateMaintenanceList = ({ type, ...data }) => defHttp.post({ url: Api.Prefix + `/FilingApply/gc/maintenance/${type}`, data });

// /api/Information/FilingApply/engine/maintenance/{id}

/**
 * 工程-备案资料-详情
 * @param data
 * @returns
 */
export const getMaintenanceDetail = id => defHttp.get({ url: Api.Prefix + `/FilingApply/gc/maintenance/${id}` });

/**
 * 根据 Id 获取备案记录详情
 * @param id
 * @returns
 */
export const getfillingrecorddetail = id => defHttp.get({ url: Api.Prefix + `/filingsbill/getfillingrecorddetail/${id}` });

/**
 * 撤回备案单
 * @param data
 * @returns
 */
export const withdrawbill = data => defHttp.put({ url: Api.Prefix + `/filingsbill/withdrawbill`, data });

/**
 * 指定审核人
 * @param data
 * @returns {
 *  BillIds: Array[string],
 *  ReAuditorUserId: string,
 * }
 */
export const designatedreviewer = data => defHttp.put({ url: Api.Prefix + `/filingsbill/designatedreviewer`, data });
