import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

// /api/file/Download?encryption=B2751376F0C0372049C5AF1A418B37E605D87A3B81E9255539081D8B7323462E1B1B6BBB0B29535BF109A7F1B7C42D874A70C3F124434DF6543F4B6F593D8BE1D846A67F4BDE7FB84D51AB3A2EB312422763D079B79FC87C00EEAA567AEA694F383ADE8730D37CC5
enum Api {
  Prefix = '/api/Information',
  Download = '/api/file',
  Basedata = '/api/basedata',
}

export function checkTerminalCustomerNum(data) {
  return defHttp.get({ url: Api.Prefix + `/PartNumberApply/CheckTerminalCustomerPartNumber`, data });
}

// 获取编码配置列表
export function getPartNumberApply(data) {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply`, data });
}
// 获取编码配置已生效列表
export function getEnablePartNumberApply(data) {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/Select`, data });
}
// 保存编码配置
export function postPartNumberApply(data) {
  return defHttp.post({ url: Api.Prefix + `/partnumberapply`, data });
}

// 客户代码下拉列表
// export function getCustomerList(data) {
//   return defHttp.get({ url: Api.Prefix + `/customer/List`, data });
// }

// 编辑保存
export function putCustomerList(data) {
  return defHttp.put({ url: Api.Prefix + `/partnumberapply/${data.Id}`, data });
}

// 上传 excel文件
export function importExcel(data) {
  return defHttp.post({
    url: `${Api.Prefix}/partnumberapply/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 专用导入-上传 excel文件
export function importExcelSpecial(data) {
  return defHttp.post({
    url: `${Api.Prefix}/partnumberapply/Special/Import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 模版下载
export function getTemplateDownload() {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/Download/ImportTemplate` });
}

// 专用导入-模版下载
export function getTemplateDownloadSpecial() {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/Download/Special/ImportTemplate` });
}

export function downloadTemplateFile(data) {
  return defHttp.get({
    url: Api.Download + `/Download?encryption=${data.encryption}`,
    responseType: 'blob',
  });
}

// 预生成料号
export function generatePartNumber(data) {
  return defHttp.post({ url: Api.Prefix + `/partnumberapply/Generator`, data });
}

// 保存表格数据
export function saveBatchData(batchCode) {
  return defHttp.post({ url: Api.Prefix + `/partnumberapply/${batchCode}` });
}

// 专用导入-保存表格数据
export function saveBatchDataSpecial(batchCode) {
  return defHttp.post({ url: Api.Prefix + `/partnumberapply/Special/${batchCode}` });
}

// 上传客户图纸
export function uploadCustomerDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/${id}/Upload/CustomerDrawings`,
    data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 上传工程图纸
export function uploadProjectDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/${id}/Upload/Engineeringdrawings`,
    data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 上传脱敏图纸
export function uploadDesensitizedDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/${id}/Upload/DesensitizedDrawings`,
    data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 批量上传客户图纸
export function uploadBatchCustomerDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/${id}/Upload/BatchUploadCustomerDrawings`,
    data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 批量上传脱敏图纸
export function uploadBatchDesensitizedDrawings(id, data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/${id}/Upload/BatchUploadDesensitizedDrawings`,
    data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 脱敏图纸下载
export function downloadDesensitizedDrawings(id) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/${id}/Download/DesensitizedDrawings`,
  });
}

// 详情
export function getPartNumberApplyDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/${id}` });
}

export function putIdProductCodeEnable(id) {
  return defHttp.put({ url: Api.Prefix + `/partnumberapply/enable/${id}` });
}

export function putIdProductCodeDisable(id) {
  return defHttp.put({ url: Api.Prefix + `/partnumberapply/disable/${id}` });
}

// 导出excel
export function exportPartnumberapplyExcel(data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/ExportExcel`,
    data,
  });
}

// 直接客户列表
// /api/Information/project/immediatecustomercodelist

export function getImmediateCustomerCodeList() {
  return defHttp.get({
    url: Api.Prefix + `/project/immediatecustomercodelist`,
  });
}

// 终端客户列表
// /api/Information/project/terminalcustomercodelist
export function getTerminalCustomerCodeList() {
  return defHttp.get({
    url: Api.Prefix + `/project/terminalcustomercodelist`,
  });
}

// 导出excel
// /api/Information/quotationrequirements/exportexcel
export function exportPartNumberApplyExcel(data) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/exportexcel`,
    data,
  });
}

// 获取图纸历史
// /api/Information/partnumberapply/{id}/drawingshistory

export function getDrawingshistory(data, id?) {
  const _id = id || data.id;
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/${_id}/drawingshistory`,
    data,
  });
}

// 预览图纸信息
// /api/Information/fileinfo/{id}/previewfileinfo

export function previewDrawingshistory(data) {
  return defHttp.get({
    url: Api.Prefix + `/fileinfo/${data.Id || data.id}/previewfileinfo`,
    data,
  });
}

// 报价需求列表
// /api/Information/partnumberapply/quotationrequirementslist

export function getQuotationRequirementsList(data) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/quotationrequirementslist`,
    data,
  });
}
// 下载图纸
// /api/Information/fileinfo/{id}/download

export function downloadDrawingshistory(data) {
  return defHttp.get({
    url: Api.Prefix + `/fileinfo/${data.Id}/download`,
  });
}

// 获取工厂列表
export function getFactoryList(data) {
  return defHttp.get({
    url: Api.Prefix + `/Factory/List`,
  });
}
// 获取内部项目代码列表
//  Information/Project/List
export function getProjectList(data) {
  return defHttp.get({
    url: Api.Prefix + `/Project/List`,
    data,
  });
}

// // 直接客户列表
// // Information/Customer/List
export function getCustomerList(data) {
  return defHttp.get({
    url: Api.Prefix + `/Customer/List`,
    data,
  });
}

// 审核
// /api/Information/partnumberapply/review
export function partnumberapplyReview(data) {
  return defHttp.put({
    url: Api.Prefix + `/partnumberapply/review`,
    data,
  });
}
// 启用
// /api/Information/partnumberapply/enable
export function partnumberapplyEnable(data) {
  return defHttp.put({
    url: Api.Prefix + `/partnumberapply/enable`,
    data,
  });
}

// 禁用
// /api/Information/partnumberapply/disable
export function partnumberapplyDisable(data) {
  return defHttp.put({
    url: Api.Prefix + `/partnumberapply/disable`,
    data,
  });
}

// 删除图纸
// /api/Information/partnumberapply/Delete/Drawings/{id}
export function deleteDrawings(id) {
  return defHttp.delete({
    url: Api.Prefix + `/partnumberapply/Delete/Drawings/${id}`,
  });
}
// 启用图纸
// PartNumberApply/Drawings/Enable/{id}
export function enableDrawings(id) {
  return defHttp.put({
    url: Api.Prefix + `/partnumberapply/Drawings/Enable/${id}`,
  });
}

// 删除料号
// /api/Information/partnumberapply/{id}
export function deletePartNumberApply(id) {
  return defHttp.delete({
    url: Api.Prefix + `/partnumberapply/${id}`,
  });
}
// 获取当前导入任务
// /api/Information/partnumberapply/ImportTask
export function getImportTask() {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/ImportTask`,
  });
}

// 获取专用导入任务
export function getImportTaskSpecial() {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/Special/ImportTask`,
  });
}

// 获取当前导入任务数据
// /api/Information/partnumberapply/ImportTaskData
export function getImportTaskData(data) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/ImportTaskData`,
    data,
  });
}

// 获取专用导入当前导入任务数据
export function getImportTaskDataSpecial(data) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/Special/ImportTaskData`,
    data,
  });
}

// 取消当前批导任务
export function cancelImportTask() {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/ImportTaskCancel`,
  });
}

// 取消专用导入当前批导任务
export function cancelImportTaskSpecial() {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/Special/ImportTaskCancel`,
  });
}

// 上报用户已阅
// /api/Information/partnumberapply/ImportTaskRead
export function importTaskRead() {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/ImportTaskRead`,
  });
}

// 专用导入上报用户已阅
export function importTaskReadSpecial() {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/Special/ImportTaskRead`,
  });
}

// 批量上传脱敏图纸
// /api/Information/partnumberapply/batchuploaddesensitizeddrawings
export function batchUploadDesensitizedDrawings(data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/batchuploaddesensitizeddrawings`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
// 批量上传客户图纸
// /api/Information/partnumberapply/batchuploadcustomerdrawings
export function batchUploadCustomerDrawings(data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/batchuploadcustomerdrawings`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 批量上传submit
// /api/Information/partnumberapply/batchupload/submit
export function batchUploadSubmit(data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/batchupload/submit`,
    data,
  });
}

/**
 * 生命周期查询 - 分页列表接口
 * @param params
 */
export function getLifeCycleList(params) {
  return defHttp.get({
    url: Api.Prefix + `/partnumberapply/LifeCycle`,
    params,
  });
}

// 推送3.8 /api/Information/partnumberapply/PushToMES
export function pushToMES(data) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/PushToMES`,
    data,
  });
}

/**
 * 绑定工厂 /Information/partnumberapply/BindFactory
 * @returns
 */
export function bindFactory(data: { id: string; factories: string[] }) {
  return defHttp.put({ url: `${Api.Prefix}/partnumberapply/BindFactory`, data });
}

/**
 * 解绑工厂
 * //Information/partnumberapply/UnbindFactory
 */
export function unbindFactory(data: { id: string; factories: string[] }) {
  return defHttp.put({ url: `${Api.Prefix}/partnumberapply/UnbindFactory`, data });
}

/**
 * 分配图纸
 * @param data.parentId 父料号`id`
 * @param data.subIds 子料号`id`列表
 */
export function assignDrawings(data: { parentId: string; subIds: Array<string> }) {
  return defHttp.put({
    url: Api.Prefix + `/PartNumberApply/Drawings/Assign`,
    data,
  });
}

/**
 * 获取SAP公司代码下拉列表
 * @param data
 * @param data.code 编码
 * @param data.name 名称
 * @returns
 */
export function getSapCompanyCode(params: { code?: string; name?: string }) {
  return defHttp.get({
    url: Api.Basedata + `/SapCompanyCode/List`,
    params,
  });
}

/**
 * 共用件 - 绑定项目
 * @param data.ids - 料号`id`列表
 * @param data.projects - 项目`id`
 * @returns
 */
export function bindProject(data: { ids: Array<string>; projects: Array<string> }) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/BindProj`,
    data,
  });
}

/**
 * 共用件 - 禁用项目
 * @param data.ids - 料号`id`列表
 * @param data.projects - 项目`id`
 * @returns
 */
export function bindProjectDisable(data: { ids: Array<string>; projects: Array<string> }) {
  return defHttp.post({
    url: Api.Prefix + `/partnumberapply/BindProjDisable`,
    data,
  });
}
