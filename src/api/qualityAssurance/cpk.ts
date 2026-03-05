import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information',
  BaseData = '/api/BaseData',
}

// 查询
// /Information/cpk/tag
export function getCpkTag(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk/tag`, data });
}

// 列表
// Information/cpk
export function getCpkData(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk`, data });
}

// CPK标识
// /Information/cpk/tag
export function postCpkTag(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/tag`, data });
}

// 取消CPK标识
// /Information/cpk/tag/cancel
export function cancelCpkTag(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/tag/cancel`, data });
}

// CPK报告上传
// /Information/cpk
export function postCpk(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk`, data });
}
// CPK详情
// /Information/cpk/Detail
export function postCpkDetail(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/Detail`, data });
}

// CPK驳回
// /Information/cpk/Reject
export function postCpkReject(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/Reject`, data });
}

// CPK转办
// /Information/cpk/Transfer
export function postCpkTransfer(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/Transfer`, data });
}

// CPK附件提交
// /Information/cpk/CommitWithFile
export function postCpkCommitWithFile(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/CommitWithFile`, data });
}

// CPK撤回
// /Information/cpk/Withdraw
export function postCpkWithdraw(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/Withdraw`, data });
}

// CPK 意见提交
// /Information/cpk/CommitWithOpinion
export function postCpkCommitWithOpinion(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/CommitWithOpinion`, data });
}
// CPK进度查询
// /Information/cpk/Progress
export function postCpkProgress(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk/Progress`, data });
}
// CPK催办
// /Information/cpk/remind
export function postCpkRemind(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/remind`, data });
}

// 导出CPK标识
// /Information/cpk/ExportTag
export function postCpkExportTag(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk/ExportTag`, data });
}

// CPK查询导出
// /Information/cpk/ExportExcel
export function postCpkExportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk/ExportExcel`, data });
}

// CPK 进度导出
// /Information/cpk/ExportProgress
export function postCpkExportProgress(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk/ExportProgress`, data });
}

// 同步工单
// /Information/cpk/SyncWorkOrder
export function postSyncWorkOrder(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/SyncWorkOrder`, data });
}

// 推送记录
// /Information/cpk/PushSapPage
export function getPushSapPage(data) {
  return defHttp.get({ url: Api.Prefix + `/cpk/PushSapPage`, data });
}

// 请求SAP工厂
// /BaseData/factorysap/OnlySapFactory
export function getSAPFactory(data) {
  return defHttp.get({ url: Api.BaseData + `/factorysap/OnlySapFactory`, data });
}

// 获取当前是否开启同步SAP
// /Information/cpk/SapSwitch
// export function getSAPSapSwitch(data) {
//   return defHttp.get({ url: Api.Prefix + `/cpk/SapSwitch`, data });
// }
//
// // CPK开启\关闭同步SAP
// export function postSAPFactory(data) {
//   return defHttp.get({ url: Api.Prefix + `/cpk/SapSwitch`, data });
// }
//

// 手动推送
// /Information/cpk/PushToSap
export function postPushToSap(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/PushToSap`, data });
}

// 数据归档
// /Information/cpk/Archive
export function postCPKArchive(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/Archive`, data });
}

// 取消数据归档
// /Information/cpk/CancelArchive
export function postCPKCancelArchive(data) {
  return defHttp.post({ url: Api.Prefix + `/cpk/CancelArchive`, data });
}

// CPK标识设置列表
// /Information/cpktagset
export function getCpktagset(data) {
  return defHttp.get({ url: Api.Prefix + `/cpktagset`, data });
}

// CPK工厂
// /Information/factory/list
export function getFactoryList(data) {
  return defHttp.get({ url: Api.Prefix + `/factory/list`, data });
}

// /Information/cpktagset/bathsave
// 批量保存CPK标识设置
export function postCpktagsetBatchSave(data) {
  return defHttp.post({ url: Api.Prefix + `/cpktagset/bathsave`, data });
}

// 单个编辑
// /Information/cpktagset
export function postCpktagset(data) {
  return defHttp.post({ url: Api.Prefix + `/cpktagset`, data });
}

// 批量启用
// /Information/cpktagset/bathenable
export function postCpktagsetBatchEnable(data) {
  return defHttp.post({ url: Api.Prefix + `/cpktagset/bathenable`, data });
}

// 批量禁用
// /Information/cpktagset/bathdisable
export function postCpktagsetBatchDisable(data) {
  return defHttp.post({ url: Api.Prefix + `/cpktagset/bathdisable`, data });
}

// 批量删除
// /Information/cpktagset/bathdel
export function postCpktagSetBatchDel(data) {
  return defHttp.post({ url: Api.Prefix + `/cpktagset/bathdel`, data });
}

//cpk仓位代码配置表查询
export function getCpkPositionCodeList(data) {
  return defHttp.get({ url: Api.Prefix + `/CPKLocation`, data });
}
//cpk仓位代码配置表新增
export function postCpkPositionCodeSave(data) {
  return defHttp.post({ url: Api.Prefix + `/CPKLocation`, data });
}
//cpk仓位代码配置表修改
export function postCpkPositionCodeUpdate(data) {
  return defHttp.put({ url: Api.Prefix + `/CPKLocation/${data.id}`, data });
}
//cpk仓位代码配置表删除
export function postCpkPositionCodeDelete(data) {
  return defHttp.delete({ url: Api.Prefix + `/CPKLocation/${data[0]}`, data });
}
//cpk仓位代码配置表批量删除
export function postCpkPositionCodeBatchDelete(data) {
  return defHttp.post({ url: Api.Prefix + `/CPKLocation/bulk/delete `, data });
}
//cpk仓位代码配置表导出
export function postCpkPositionCodeExport(data) {
  return defHttp.get({ url: Api.Prefix + `/CPKLocation/Export`, data });
}
