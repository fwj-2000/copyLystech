import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { getAppEnvConfig } from '/@/utils/env';
const { VITE_GLOB_API_URL } = getAppEnvConfig();
enum Api {
  Prefix = '/api/Production/AbnormalTimelinessMonitoring',
  ProductionPlanBoardfix = '/api/Production/ProductionPlanBoard',
  InformationPrefx = '/api/Information',
}
//获取厂区类型
export function getFactoryList(data) {
  return defHttp.get({ url: Api.Prefix + '/GetFactory', data });
}

//分页列表
export function getPageList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//处理人分页列表
export function getProcessorPage(data) {
  return defHttp.get({ url: Api.Prefix + '/ProcessorPage', data });
}

//查询已处理的数据
export function getProcessedPage(data) {
  return defHttp.get({ url: Api.Prefix + '/ProcessedPage', data });
}

//扫描
export function getFlowTagData(data) {
  return defHttp.get({ url: Api.Prefix + '/GetFlowTagData', data });
}

//工单列表
export function getWorkOrderData(data) {
  return defHttp.get({ url: Api.Prefix + '/GetWorkOrderData', data });
}

//异常类型下拉框
export function getExceptionTypeList(data) {
  return defHttp.get({ url: Api.Prefix + '/GetExceptionTypeList', data });
}

//导出Excel
export function exportProductLineExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//导出Excel
export function exportDataProcessor(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportDataProcessor`, data });
}

//新增
export function addData(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateData(data) {
  return defHttp.post({ url: Api.Prefix + '/Update', data });
}

//上报
export function reportData(data) {
  return defHttp.post({ url: Api.Prefix + '/Report', data });
}

//确认问题
export function confirmationProblem(data) {
  return defHttp.post({ url: Api.Prefix + '/ConfirmationProblem', data });
}

//转移异常单
export function TurnTo(data) {
  return defHttp.post({ url: Api.Prefix + '/TurnTo', data });
}

//处理人提交
export function handlerSolutionResult(data) {
  return defHttp.post({ url: Api.Prefix + '/HandlerSolutionResult', data });
}

//完成
export function processingComplete(data) {
  return defHttp.post({ url: Api.Prefix + '/Complete', data });
}

//返工
export function rework(data) {
  return defHttp.post({ url: Api.Prefix + '/Rework', data });
}

//获取处理人
export function getProcessorList(data) {
  return defHttp.get({ url: Api.Prefix + '/GetProcessorList', data });
}

//撤回
export function revocationData(data) {
  return defHttp.post({ url: Api.Prefix + `/Revocation`, data });
}

//批量撤回
export function revocationList(data) {
  return defHttp.post({ url: Api.Prefix + '/RevocationList', data });
}

//删除
export function deleteData(data) {
  return defHttp.delete({ url: Api.Prefix, data });
}

//批量删除
export function deleteDataList(data) {
  return defHttp.delete({ url: Api.Prefix + '/DeleteList', data });
}

// 上传图片
export function uploadImage(data, onUploadProgress) {
  return defHttp.uploadFile<{
    message: string;
    code: number;
    data: string;
  }>(
    {
      url: VITE_GLOB_API_URL + Api.Prefix + `/upload/images`,
      onUploadProgress,
    },
    data,
  );
}

// 删除图片
export function deleteImage(data) {
  return defHttp.delete({ url: Api.Prefix + `/delete/image`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

//异常报表分页列表
export function getDashbroadsPage(data) {
  return defHttp.get({ url: Api.Prefix + '/GetDashbroadsPage', data });
}

// 模切生产进度看板分页
export function getProductionTableData(data) {
  return defHttp.get({ url: Api.ProductionPlanBoardfix, data }, { ignoreCancelToken: true });
}

// 模切生产进度看板机台下拉框
export function getMachinelCodeList(data) {
  return defHttp.get({ url: Api.ProductionPlanBoardfix + '/GetMachinelNoList', data });
}

// 模切生产进度看板获取客诉质量接口
export function getQualityCustomerComplaintListApi(data) {
  return defHttp.get({ url: Api.ProductionPlanBoardfix + '/GetQualityCustomerComplaintList', data }, { ignoreCancelToken: true });
}

// 模切生产进度看板获取看板数据
export function getProductionPlanBoardApi(data) {
  return defHttp.get({ url: Api.ProductionPlanBoardfix + '/GetProductionPlanBoard', data }, { ignoreCancelToken: true });
}

// 客诉质量看板导出
export function qualityCustomerComplaintReport(data = {}) {
  return defHttp.get({ url: Api.ProductionPlanBoardfix + '/ExprotQualityCustomerComplaint', data }, { ignoreCancelToken: true });
}

// 获取责任单位名称.
export function getbusinessunit(data = {}) {
  return defHttp.get({ url: Api.Prefix + '/getbusinessunit', data });
}

// 异常类型下拉
export function getExceptionType(data) {
  return defHttp.get({
    url: Api.InformationPrefx + '/exceptioncontactconfig/GetExceptionType',
    data,
  });
}

// 根据异常类型查询责任单位
export function getDetailByExceptionType(data) {
  return defHttp.get({
    url: Api.InformationPrefx + '/exceptioncontactconfig/detail',
    data,
  });
}

// 获取解决方案数据.
export function getHanlder(data) {
  return defHttp.get({ url: Api.Prefix + '/GetHanlder/' + data.id });
}

// 获取当前用户组长信息
export function GetGroupInfoByJobNumber() {
  return defHttp.get({ url: '/api/Production/GroupInfo/GetGroupInfoByJobNumber' });
}

// 根据异常id获取内容
export function GetInfoById(data) {
  return defHttp.get({ url: Api.Prefix + '/GetInfoById', data });
}

// 异常时效性监控-处理人 分页
export function getFlowPage(data) {
  return defHttp.get({ url: Api.Prefix + '/GetFlowPage', data });
}

// 组长/工程上报
export function GroupLeaderReport(data) {
  return defHttp.post({ url: Api.Prefix + '/GroupLeaderReport', data });
}

// 去处理
export function ToDealwith(data) {
  return defHttp.post({ url: Api.Prefix + '/ToDealwith', data });
}

// 驳回
export function Reject(data) {
  return defHttp.post({ url: Api.Prefix + '/Reject', data });
}

// 主管审批同意
export function Agree(data) {
  return defHttp.post({ url: Api.Prefix + '/Agree', data });
}

// 返工
export function Rework(data) {
  return defHttp.post({ url: Api.Prefix + '/Rework', data });
}

// 完成
export function Complete(data) {
  return defHttp.post({ url: Api.Prefix + '/Complete', data });
}

// 判断是否为组长
export function GetIsGroupLeader() {
  return defHttp.get({ url: Api.Prefix + '/GetIsGroupLeader' });
}

// 通过异常id获取状态
export function GetStatusById(data) {
  return defHttp.get({ url: Api.Prefix + '/GetStatusById', data });
}
// 根据机台号查询料号
export function getInnerMaterialNumberList(data) {
  return defHttp.get({
    url: Api.ProductionPlanBoardfix + '/GetInnerMaterialNumberList',
    data,
  });
}

// 获取厂区.
export const ListByUserfactory = () => defHttp.get({ url: `/api/Information/Factory/ListByUserfactory` });

// 撤回
export function Bathwithdraw(data) {
  return defHttp.post({ url: Api.Prefix + '/bathwithdraw', data });
}
