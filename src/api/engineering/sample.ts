import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/sampleapply',
  SampleMaterialApplyPrefix = '/api/Information/sampleMaterialApply',
}

//查询列表
export function getList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//查询料号列表
export function getInsidePartNumberList(innerMaterialNumber, factoryId?: string) {
  return defHttp.get({
    url: Api.Prefix + '/applyPageList',
    data: {
      innerMaterialNumber,
      factoryId,
    },
  });
}
/**
 * 查询仓位列表
 * @param data 请求参数
 * @param data.shippingSpace 仓位
 * @param data.factoryId 工厂ID
 * @returns
 */
export function getSpaceList(data?: { shippingSpace?: string; factoryId?: string }) {
  return defHttp.get({
    url: Api.Prefix + '/getshippingspacelist',
    data,
  });
}

// 查询
export function getUnitList(data?: any) {
  return defHttp.get({
    url: Api.Prefix + '/getunitlist',
    data: {
      shippingSpace: data,
    },
  });
}
// 获取暂存列表
export function getStorageList() {
  return defHttp.get({ url: Api.Prefix + '/getsampleapplystorage' });
}

// 通过ID查询整单列表
export function getAllById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//通过ID查询详情
export function getDetailById(id) {
  return defHttp.get({ url: Api.Prefix + '/getinformationdetail' + `/${id}` });
}

//新增
export function add(data) {
  return defHttp.post({ url: Api.Prefix, data });
}
//暂存
export function addStorage(data) {
  return defHttp.post({ url: Api.Prefix + '/storage', data });
}

// 批量审核
export function batchAudit(data: string[]) {
  return defHttp.put({ url: Api.Prefix + '/bulk/review', data });
}
// 批量反审核
export function batchUnAudit(data: string[]) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}

//修改
export function update(data) {
  return defHttp.post({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function del(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + `/ExportExcel`, data });
}

// 模板导出
export function template() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//导出Excel
export function importSave(data, params) {
  console.log(params, '=======================');
  return defHttp.post({ url: Api.Prefix + `/${data}/${params.isoperation}` });
}

// 回复采购
export function replayStorage(id, data) {
  return defHttp.put({ url: Api.Prefix + `/replypurchasestorage?id=${id}`, data });
}

// 整单提交
export function replaySubmit(id) {
  return defHttp.put({ url: Api.Prefix + `/replypurchase/${id}` });
}

// 获取常量列表
export const getTypeList = (types: string[]) => {
  return defHttp.put({
    url: Api.Prefix + `/gettypelist`,
    data: types,
  });
};

// 修改
export function edited(id, data) {
  return defHttp.put({ url: Api.Prefix + `/${id}`, data });
}

// V2
// 通用
/**
 * @description 根据内部料号查询信息 /api/Information/sampleMaterialApply/getinnermaterialnumber
 * */
export function getInnerMaterialNumber(data) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/getinnermaterialnumber', data });
}
/**
 * @description 批量根据内部料号、材料内部料号、工厂查询信息 /api/Information/sampleMaterialApply/getinnermaterialnumber
 * */
export function getInnerMaterialNumbers(data: Array<{ innerMaterialNumber: string; insidePartNumber?: string; factoryId?: string }>) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/getInnerMaterialNumbers', data });
}

/**
 * @description 获取工厂数据 /api/Information/sampleMaterialApply/getfactorylist
 * */
export function getFactoryList(data?: any) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/getfactorylist', data });
}
/**
 * @description 批量删除  /api/Information/sampleMaterialApply/bulk/delete
 * */
export function batchDelete(ids: Array<string>) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/bulk/delete', data: ids });
}
/**
 * @description 终止 /api/Information/sampleMaterialApply/stop
 * */
export function stopPro(data: { idList: Array<string>; remark: string }) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/stop', data });
}
/**
 * @description 驳回 /api/Information/sampleMaterialApply/reject
 * */
export function rejectPro(data: { idList: Array<string>; remark: string }) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/reject', data });
}
/**
 * @description 撤回 /api/Information/sampleMaterialApply/withdraw
 * */
export function recallPro(ids) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/withdraw', data: ids });
}

/**
 * @description 通过id获取详情 /api/Information/sampleMaterialApply/{id}
 * @param id 数据id
 * @param isPurchaseUser 是否为采购组
 * @returns
 */
export function getSampleMaterialApplyDetailById(id: string | number, isPurchaseUser = false) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + `/${id}?isPurchaseUser=${isPurchaseUser}` });
}

// 工程
export function getApplyList(data) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/applyPageList', data });
}
/**
 * @description 模板下载 /api/Information/sampleMaterialApply/download/importtemplate
 * */
export function downloadImportTemplate() {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/download/importtemplate' });
}
/**
 * @description 导入预览 /api/Information/sampleMaterialApply/import
 * */
export function importPreviewBatch(data) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + `/import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}
/**
 * @description 导入保存 /api/Information/sampleMaterialApply/importsave
 * */
export function importSaveBatch(data) {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + `/${data}` });
}
/**
 * @description 获取当前导入任务  /api/Information/sampleMaterialApply/importTask
 * */
export function getImportTask() {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/importTask' });
}
/**
 * @description 取消导入任务  /api/Information/sampleMaterialApply/importTaskCancel
 * */
export function cancelImportTask() {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/importTaskCancel' });
}
/**
 * @description 获取当前导入任务数据 /api/Information/sampleMaterialApply/importTaskData
 * */
export function getImportTaskData() {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/importTaskData' });
}
/**
 * @description 已阅 /api/Information/sampleMaterialApply/importTaskRead
 * */
export function importTaskRead() {
  return defHttp.post({ url: Api.SampleMaterialApplyPrefix + '/importTaskRead' });
}

/**
 * @description 新增时的暂存或者提交 /api/Information/sampleMaterialApply/create
 * @param data 保存数据
 * @param isSubmit 是否提交
 */
export function createSampleMaterialApply(data: any, isSubmit = false) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/create?isSubmit=' + isSubmit, data });
}

/**
 * @description 修改保存 /api/Information/sampleMaterialApply/update
 */
export function updateSampleMaterialApply(data: any, isSubmit = false) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/update?isSubmit=' + isSubmit, data });
}

// 采购

/**
 * @description 新增暂存 /api/Information/sampleMaterialApply/storage
 */
export function storageSampleMaterialApply(data: any) {
  return defHttp.post({ url: Api.Prefix + '/storage', data });
}

/**
 * @description 详情 /api/Information/sampleMaterialApply/{id}
 */
export function getSampleMaterialApplyDetail(id: string) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

/**
 * @description 修改保存 /api/Information/sampleMaterialApply/update
 */
// export function updateSampleMaterialApply(data: any) {
//   return defHttp.put({ url: Api.Prefix + '/update', data });
// }

/**
 * @description 采购回复分页列表 /Information/sampleMaterialApply/handlePageList
 */
export function handlePageList(params: any) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/handlePageList', params });
}

/**
 * @description 获取回复记录 /api/Information/sampleMaterialApply/getinformationdetail/{id}
 */
export function getReplayInformationDetail(id: string) {
  return defHttp.get({ url: Api.Prefix + `/getinformationdetail/${id}` });
}

/**
 * @description 发送邮件 /Information/sampleMaterialApply/sendemail
 */
export function sendEmail(data: any, themeText: string) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/sendemail?themeText=' + themeText, data });
}

/**
 * @description 采购提交 /Information/materialdeveloppurchase/purchaseCommit
 */
export function purchaseCommit(data: any) {
  return defHttp.post({ url: Api.Prefix + '/purchaseCommit', data });
}

/**
 * @description 回复采购 /Information/sampleMaterialApply/replyPurchase
 */
export function replyPurchase(data: any, isSubmit = false) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/replyPurchase?isSubmit=' + isSubmit, data });
}

/**
 * @description 批量转办 /api/Information/sampleMaterialApply/BulkTransfer
 * @param data
 * @returns
 */
export function bulkTransfer(data: { idList: Array<string>; handlerId: string; remark: string }) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/BulkTransfer', data });
}

/**
 * @description 工程确认分页列表 /Information/sampleMaterialApply/confirmPageList
 */
export function confirmPageList(params: any) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/confirmPageList', params });
}

/**
 * @description 工程确认意见 /Information/materialdeveloppurchase/confirm
 */
export function confirmOpinion(data: Array<{ id: string; reason: string; opinion: string | number }>) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/confirm', data });
}

/**
 * @description 获取节点 /api/Information/sampleMaterialApply/getNodeList
 */
export function getNodeList(params: any) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/getNodeList', params });
}

/**
 * @description 获取选中数据 /api/Information/sampleMaterialApply/getNodelist
 * @param ids Array<any>
 * @param isPurchaseUser 是否是采购人员
 * @returns
 */
export function getApplyDatas(ids: Array<any>, isPurchaseUser = false) {
  return defHttp.put({ url: Api.SampleMaterialApplyPrefix + '/getApplyDatas?isPurchaseUser=' + isPurchaseUser, data: ids });
}

/**
 * @description 根据单号获取数据 /api/Information/sampleMaterialApply/getApplyDatas/{applyNumber}
 * @param applyNumber 单号
 */
export function getApplyDatasByApplyNumber(applyNumber: string) {
  return defHttp.get({ url: `${Api.SampleMaterialApplyPrefix}/getApplyDatas/${applyNumber}` });
}

/**
 * @description 选择性导出 Information/samplematerialapply/exportpurchasepage
 */
export function exportSelectExcel(params: any) {
  return defHttp.get({ url: Api.SampleMaterialApplyPrefix + '/exportpurchasepage', params });
}
