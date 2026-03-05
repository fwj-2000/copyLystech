import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/',
  PrefixDim = '/api/report/dimension/',
}

const commonRetryRequestOptions = {
  retryRequest: {
    isOpenRetry: true,
    count: 3,
    waitTime: 100,
  },
};

// 获取组织架构
export function getOrganization(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}organization`, data }, commonRetryRequestOptions);
}

// 获取全部组织层级
export function getAllOrganization(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}organization/getall`, data }, commonRetryRequestOptions);
}

// 获取经管组织层级
export function getSyOrganization(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}organization/getsy`, data }, commonRetryRequestOptions);
}

// 获取组织层级
export function getFyOrganization(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}organization/getfy`, data }, commonRetryRequestOptions);
}

// 查询oee数据
export function getOeedata(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata`, data }, commonRetryRequestOptions);
}

// 查询oee趋势数据
export function getOeeTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/trend`, data }, commonRetryRequestOptions);
}

// 查询性能利用率异常点数
export function getOeedataIssueMquserate(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/issues/mquserate`, data }, commonRetryRequestOptions);
}

// 查询模切良率异常点数
export function getOeedataIssueMqyield(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/issues/mqyield`, data }, commonRetryRequestOptions);
}

// 查询模切稼动率范围分布
export function getUtilizationrateIssues(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/issues`, data }, commonRetryRequestOptions);
}

// 查询模切良率
export function getOeedataMqyield(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/mqyield`, data });
}

// 查询模切良率异常下载列表
export function getMqyieldDownloadlist(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/mqyield/downloadlist`, data });
}

// 查询性能利用率
export function getOeedataMquserate(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/mquserate`, data });
}

// 查询性能利用率异常下载列表
export function getMquserateDownloadlist(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/mquserate/downloadlist`, data });
}

// 查询时间稼动率
export function getUtilizationrate(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate`, data });
}

// 查询时间稼动率下载列表
export function getUtilizationrateDownloadlist(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/downloadlist`, data });
}

// 查询停机原因排行
export function getUtilizationrateDowntime(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/downtime`, data });
}

// 查询指标中心-AOI数据
export function getAoidata(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidata`, data });
}

// 查询指标中心-出勤数据
export function getAttendancedata(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance`, data });
}

// 查询指标中心-模切达成率
export function getMqachievedata(data) {
  return defHttp.get({ url: `${Api.Prefix}mqachieve`, data });
}

// 查询指标中心-品质稽核
export function getQcauditdata(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit`, data });
}

// 查询指标中心-工单状态
export function getOrderstatusdata(data) {
  return defHttp.get({ url: `${Api.Prefix}orderstatus`, data });
}

// 查询指标中心-oee
export function getOeeMaindata(data) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/main`, data });
}

// 查询指标中心-开机率
export function getMachworkingMaindata(data) {
  return defHttp.get({ url: `${Api.Prefix}machworking/main`, data });
}

// 查询指标中心-制程良率
export function getProcessyielddata(data) {
  return defHttp.get({ url: `${Api.Prefix}processyield`, data });
}

// 查询指标中心--当周客诉.
export function getCustomcomplaintdata(data) {
  return defHttp.get({ url: `${Api.Prefix}customcomplaint`, data });
}

// 查询指标中心--产值.
export function getOutputvaluedata(data) {
  return defHttp.get({ url: `${Api.Prefix}outputvalue`, data });
}

// 指标中心损益图表
export function getProfitandlosMetricscenter(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/metricscenter`, data });
}
export function getPerformanceratio(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/performanceratio`, data });
}
export function getPerformancesummary(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/performancesummary`, data });
}

// 指标中心损益图表明细
export function getProfitandlosMetricscenterDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/metricscenterdetail`, data });
}

// 开机率-概览

export function getMachworkingSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}machworking/summary`, data });
}

// 开机率-明细
export function getMachworkingTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}machworking/trend`, data });
}

// 开机率-开机明细
export function getMachworkingDetaildata(data) {
  return defHttp.get({ url: `${Api.Prefix}machworking/details`, data });
}

// 出勤率-概览
export function getAttendanceSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/summary`, data });
}

// 出勤率-趋势
export function getAttendanceTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/trend`, data });
}

// 出勤率-明细
export function getAttendanceDetails(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/details`, data });
}

// 制程良率-概览
export function getProcessyieldSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}processyield/summary`, data });
}

// 制程良率-趋势
export function getProcessyieldTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}processyield/trend`, data });
}

// 更新用户视图配置
export function addViewSetting(data) {
  return defHttp.post({ url: `${Api.Prefix}viewsetting/add`, data });
}

// 获取用户视图配置
export function getViewSetting(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}viewsetting`, data });
}

// 模切达成-概览
export function getMqachieveSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}mqachieve/summary`, data });
}

// 模切达成-趋势
export function getMqachieverenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}mqachieve/trend`, data });
}

// 模切达成-明细
export function getMqachieveDetaildata(data) {
  return defHttp.get({ url: `${Api.Prefix}mqachieve/details`, data });
}

// AOI数据概览-概览
export function getAoidataSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidata/summary`, data });
}

// AOI数据概览-趋势
export function getAoidatadata(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidata/trend`, data });
}

// AOI数据概览-明细
export function getAoidataDetailsdata(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidata/details`, data });
}

// 客诉数据概览-概览
export function getCustomcomplaintSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}customcomplaint/summary`, data });
}

// 客诉数据概览-趋势
export function getCustomcomplaintTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}customcomplaint/trend`, data });
}

// 客诉数据概览-明细
export function getCustomcomplaintDetailsdata(data) {
  return defHttp.get({ url: `${Api.Prefix}customcomplaint/details`, data });
}

// 产值数据概览-概览
export function getOutputvalueSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}outputvalue/summary`, data });
}

// 产值数据概览-趋势
export function getOutputvalueTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}outputvalue/trend`, data });
}

// 产值数据概览-明细
export function getOutputvalueDetailsdata(data) {
  return defHttp.get({ url: `${Api.Prefix}outputvalue/details`, data });
}

// 指标中心--当周边贡
export function getFinanceeconomicdata(data) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic`, data });
}

// 模切BG边贡概览
export function getFinanceeconomicSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic/summary`, data });
}

// 模切BG边贡趋势
export function getFinanceeconomicTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic/trend`, data });
}

// 获取边贡工单类型枚举清单
export function getFinanceeconomicOrdertype(data) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic/ordertype`, data });
}

// 模切BG品质稽核概览
export function getQcauditSummarydata(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit/summary`, data });
}

// 模切BG品质稽核趋势
export function getQcauditTrenddata(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit/trend`, data });
}

// 稽核问题点明细
export function getQcauditProblemDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit/details/problem`, data });
}

// FQC明细
export function getQcauditFqcDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit/details/fqc`, data });
}

// 首件明细
export function getQcauditIpqcDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit/details/ipqc`, data });
}

// 查询稼动率趋势数据
export function getUtilizationrateTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/trend`, data });
}

// 人力明细查询档案分组
export function getOrganizationDoc(data) {
  return defHttp.get({ url: `${Api.Prefix}organization/getdoc`, data });
}

// 指标中心--费用数据.
export function getFaremanage(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage`, data });
}

// 指标中心--费用概览数据.
export function getFaremanageSummary(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/summary`, data });
}

// 指标中心--费用趋势数据.
export function getFaremanageTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/trend`, data });
}

// 人力 - 人均产值详情
export function getAttendancePercapitatrend(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/percapitatrend`, data });
}

// 产销汇总-指标中心卡片数据.
export function getProductsalesum(data) {
  return defHttp.get({ url: `${Api.Prefix}productsalesum`, data });
}

// 产销汇总-趋势页.
export function getProductsalesumTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}productsalesum/trend`, data });
}

// 产销汇总-年度汇总数据.
export function getProductsalesumYearsummary(data) {
  return defHttp.get({ url: `${Api.Prefix}productsalesum/yearsummary`, data });
}

// 人机比明细./report/manmachineratio/summary
export function manmachineratioSummary(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratio/summary`, data });
}

// 看板总览
// /report/heatdissi/dailybulletinboard
export function manmachineratioTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/dailybulletinboard`, data });
}

// 良率总览
// /report/heatdissi/trend
export function manmachineratioHeatdissitrend(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/trend`, data });
}

// 工序趋势
// /report/heatdissi/processetrend
export function getProcesseTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/processetrend`, data });
}

// 工序下拉列表
// /report/heatdissi/processeparam
export function getProcesseparam(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/processeParamWithCritical`, data });
}

// 项目下拉列表
// /report/heatdissi/projectParam
export function getProjectParam(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/projectParam`, data });
}

// MIL管理列表
export function getMilbulletinboard(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/mILBulletinBoardV2`, data });
}

// 新增MIL
// /report/heatdissi/miladdorupdate
export function postMilbulletinboard(data) {
  return defHttp.post({ url: `${Api.Prefix}heatdissi/miladdorupdate`, data });
}

// 人机比-产值明细
// /report/manmachineratiodetail/czdetail
export function humanMachineCzdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratiodetail/czdetail`, data });
}

// 人机比-开机明细
// /report/manmachineratiodetail/kjdetail
export function humanMachineKjdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratiodetail/kjdetail`, data });
}

// 人机比-出勤明细
// /report/manmachineratiodetail/cqdetail
export function humanMachineCqdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratiodetail/cqdetail`, data });
}

// 人机比-模切前加工明细
// /report/manmachineratiodetail/mqdetail
export function humanMachineMqdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratiodetail/mqdetail`, data });
}

// 人机比-间接工明细
// /report/manmachineratiodetail/mqdetail
export function humanMachineJjdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratiodetail/jjdetail`, data });
}

// 人机比-过程指标明细
// /report/manmachineratiodetail/gczbdetail
export function humanMachineGczbdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}manmachineratiodetail/gczbdetail`, data });
}

// 工序良率 Process yield
export function getProcessYield(data) {
  return defHttp.get({ url: `${Api.Prefix}heatdissi/processes`, data });
}
// 基础资料明细
export function getBaseReport(data) {
  return defHttp.get({ url: `${Api.Prefix}customerschedul/basereport`, data });
}
//基础资料明细下拉框参数
export function getBaseReportParam(data) {
  return defHttp.get({ url: `${Api.Prefix}customerschedul/basereportparam`, data });
}
export function exportImportbaseTemplate() {
  return defHttp.get({ url: `${Api.Prefix}customerschedul/downloadtemplate` });
}
///季度达成主界面
export function getQuarAchieveInterface(data) {
  return defHttp.get({ url: `${Api.Prefix}customerschedul/shareachievementone`, data });
}
//季度达成二级界面
export function getQuarAchieveInterfaceDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}customerschedul/shareachievementtwo`, data });
}
// 指标中心3.8损失率--首页图表
export function getLoss38metricscenter(data) {
  return defHttp.get({ url: `${Api.PrefixDim}workorderloss38metricscenter`, data });
}

// 指标中心3.8损失率--明细
export function getWorkorderloss38summary(data) {
  return defHttp.get({ url: `${Api.PrefixDim}workorderloss38summary`, data });
}
// 指标中心3.8损失率--趋势
export function getWorkorderloss38trend(data) {
  return defHttp.get({ url: `${Api.PrefixDim}workorderloss38trend`, data });
}
