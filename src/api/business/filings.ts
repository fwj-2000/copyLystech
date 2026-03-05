import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
}

/**
 * 备案需求列表
 * @param data
 * @returns
 */
export function getFilingsApplyList(data) {
  return defHttp.get({ url: Api.Prefix + `/filingsapply`, data });
}

/**
 * 根据来源单号查询未处理的数据
 * @param data
 * @returns
 */
export function getUnCreatedList(data) {
  return defHttp.get({ url: Api.Prefix + `/filingsapply/GetUnCreatedList`, data });
}

/**
 * 查询内部料号
 * @param data
 * @returns
 */
export function getinnermaterialnumberlist(v) {
  return defHttp.get({
    url: Api.Prefix + `/filingsapply/getinnermaterialnumberlist`,
    data: {
      InnerMaterialNumber: v,
    },
  });
}
/**
 * 查询内部料号详情
 * @param data
 * @returns
 */
export function getinnermaterialnumberinfo(data) {
  return defHttp.get({ url: Api.Prefix + `/filingsapply/getinnermaterialnumberinfo`, data });
}
/**
 * 备案需求删除
 * @param id
 * @returns
 */
export function delFilingsApply(id) {
  return defHttp.delete({ url: Api.Prefix + `/filingsapply/${id}` });
}

/**
 * 备案需求批量删除
 * @param data
 * @returns
 */
export const batchDelFilingsApply = data => defHttp.post({ url: Api.Prefix + '/filingsapply/bulk/delete', data });

/**
 * 新增备案需求
 * @param data
 * @returns
 */
export const createFilingsApply = ({ data }) => defHttp.put({ url: Api.Prefix + `/filingsapply/createapply`, data });

/**
 * 新增备案需求-多语言
 * @param data
 * @returns
 */
export const createFilingsApplyLangs = ({ data }) => defHttp.post({ url: Api.Prefix + `/filingsapply/GcCreateMaintain`, data });

/***
 * 根据id查询详情
 * @param id
 * @returns
 */
export const getFilingsApplyDetail = (data: { id: String; qid?: String }) => defHttp.get({ url: Api.Prefix + `/filingsapply/getfilingsapplydetailbyid`, data });

/**
 * 批量根据id获取详情
 * @param data
 * @returns
 */
export const getFilingsGcRecordDetails = (data: { filingIds: Array<string>; quantityIds: Array<string> }) =>
  defHttp.post({ url: Api.Prefix + `/FilingsApply/GetFilingsGcRecordDetails`, data });

/**
 * 修改备案需求
 * @param params
 * @returns
 */
export const editFilingsApply = (id = '', data) => defHttp.put({ url: Api.Prefix + `/filingsapply/${id}`, data });

// 审核
// /api/Information/filingsapply/audit
export const auditFilling = (data: {
  id: string;
  IsNotice: '0' | '1';
  NoticePersonId: string;
  AuditType: '1' | '0'; // '审核' | ‘取消审核’
  AuditRmk: string;
}) => defHttp.put({ url: Api.Prefix + '/filingsapply/audit', data });

/**
 * 备案需求数据导出
 * @returns
 */
export const exportTableData = data => defHttp.get({ url: Api.Prefix + '/filingsapply/importfilingsapplyexportexcel', data });

// 备案需求维护资料列表
export const getReplay = data => defHttp.get({ url: Api.Prefix + '/filingsbill', data });
// 备案需求详情
// export const getReplayDetail = (id) => defHttp.get({ url: Api.Prefix + '/filingsbill/'+ id });
export const getReplayDetail = id => defHttp.get({ url: Api.Prefix + '/filingsbill/getfilingsbilldetail', data: { Id: id } });
// 删除
export const deleteReplay = id => defHttp.delete({ url: Api.Prefix + '/filingsbill/' + id });
// 批量删除
export const batchDeleteReplay = data => defHttp.post({ url: Api.Prefix + '/filingsbill/bulk/delete', data });
// 导出
export const exportReplay = data => defHttp.get({ url: Api.Prefix + '/filingsbill/importfilingsbillexportexcel', data });
// 客服-列表
export const getReplayList = data => defHttp.get({ url: Api.Prefix + '/filingsbill/getreplypage', data });
// 客服-导出
export const expostReplayCustom = data => defHttp.get({ url: Api.Prefix + '/filingsbill/filingsbillreplyexportexcel', data });
// 保存
export const saveReplay = (type, data) => defHttp.post({ url: Api.Prefix + `/filingsbill/createbill_v2/${type}`, data });

export const saveReplaying = id => defHttp.put({ url: Api.Prefix + '/filingsbill/Replying?id=' + id });
// 审核
export const auditReplay = (data: {
  id: string;
  AuditType: '1' | '0'; // '审核' | ‘取消审核’
  AuditRmk: string;
}) => defHttp.put({ url: Api.Prefix + '/filingsbill/audit', data });
// 结案
export const closeReplay = data => defHttp.put({ url: Api.Prefix + '/filingsbill/closecase', data });
// 客服保存
export const customReplay = data => defHttp.put({ url: Api.Prefix + '/filingsbill/reply', data });

// 上传
export const uploadFilings = (id, data) => {
  return defHttp.post({
    url: Api.Prefix + `/filingsapply/${id}/upload/weighpicture`,
    data,
    headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
  });
};

// 预览
export const prevewImg = (
  id,
  data: {
    fileId: string;
  },
) => {
  return defHttp.get({
    url: Api.Prefix + `/fileinfo/${id}/previewfileinfo`,
    data,
  });
};
//模糊内部料号
export const getFilinginnermaterialnumberlist = InnerMaterialNumber => {
  return defHttp.get({
    url: Api.Prefix + `/filingsbill/getapplylistbymaterialnumber`,
    data: {
      InnerMaterialNumber,
    },
  });
};

/**
 * 关务-备案资料-删除客户模版
 * @param id
 * @returns
 */
export const deleteCustomerTpl = id => defHttp.delete({ url: Api.Prefix + `/filingsbill/deleteconfig?id=${id}` });

// /api/Information/filingsbill/getmakefilingrecord

/**
 * 获取制作备案资料数据接口
 * @param id
 * @param data
 * @returns
 */
export const getmakefilingrecord = (id, data) => {
  console.log(id, data, 'id, data');
  return defHttp.post({
    url: Api.Prefix + `/filingsbill/getmakefilingrecord?customerConfigId=${id}`,
    data,
  });
};

// 获取当前导入任务 /Information/filingsapply/ImportTaskData
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/filingsapply/importtask`,
  });
}

// 获取当前导入任务数据
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/filingsapply/importtaskdata`,
    data,
  });
}
// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/filingsapply/ImportTaskCancel`,
  });
}
// 上报用户已阅
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/filingsapply/ImportTaskRead`,
  });
}

// 用户保存导入数据
export const saveImportData = (code, data) => defHttp.post({ url: Api.Prefix + `/filingsapply/saveimport?batchCode=${code}`, data });

/**
 * 导入excel
 * @param data
 * @returns
 */
export const importPreview = data => {
  return defHttp.post({ url: Api.Prefix + '/filingsapply/import', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
};

/**
 * 下载量试需求模板
 * @returns
 */
export const downloadTemplate = () => defHttp.get({ url: Api.Prefix + '/filingsapply/download/importtemplate' });
