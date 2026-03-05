import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/sampleapplypurchase',
  ImportData = '/api/Information/SampleMaterialPurchase',
}

//查询列表
export function getList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
//查询料号列表
export function getInsidePartNumberList(data) {
  return defHttp.get({
    url: Api.Prefix + '/getinnermaterialnumber',
    data: {
      innerMaterialNumber: data,
    },
  });
}
//查询仓位
export function getSpaceList(data) {
  return defHttp.get({
    url: Api.Prefix + '/getshippingspacelist',
    data: {
      shippingSpace: data,
    },
  });
}

// 查询
export function getUnitList(data) {
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

//暂存
export function replayStorage(id, data) {
  return defHttp.put({ url: Api.Prefix + `/replyengineeringstorage?id=${id}`, data });
}

// 提交回复
export function replaySubmit(id) {
  // /api/Information/sampleapplypurchase/replyengineering/{id}
  return defHttp.put({ url: Api.Prefix + `/replyengineering/${id}` });
}

// 获取常量列表
export const getTypeList = (types: string[]) => {
  return defHttp.put({
    url: Api.Prefix + `/gettypelist`,
    data: types,
  });
};

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importsampleapplyexportexcel`, data });
}

/**
 * @description 导入 /api/Information/sampleMaterialApply/import
 * */
export function importPreviewBatch(data) {
  return defHttp.post({ url: Api.ImportData + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 导入保存 /api/Information/sampleMaterialApply/importsave
 * */
export function importSaveBatch(data) {
  return defHttp.post({ url: Api.ImportData + `/${data}` });
}
/**
 * @description 模板下载 /api/Information/sampleMaterialApply/download/importtemplate
 * */
export function downloadImportTemplate() {
  return defHttp.get({ url: Api.ImportData + '/Download/ImportTemplate' });
}
/**
 * @description 获取当前导入任务  /api/Information/sampleMaterialApply/importTask
 * */
export function getImportTask() {
  return defHttp.get({ url: Api.ImportData + '/ImportTask' });
}

/**
 * @description 获取当前导入任务数据 /api/Information/sampleMaterialApply/importTaskData
 * */
export function getImportTaskData() {
  return defHttp.get({ url: Api.ImportData + '/ImportTaskData' });
}

/**
 * @description 取消导入任务  /api/Information/sampleMaterialApply/importTaskCancel
 * */
export function cancelImportTask() {
  return defHttp.post({ url: Api.ImportData + '/ImportTaskCancel' });
}

/**
 * @description 已阅 /api/Information/sampleMaterialApply/importTaskRead
 * */
export function importTaskRead() {
  return defHttp.post({ url: Api.ImportData + '/ImportTaskRead' });
}
