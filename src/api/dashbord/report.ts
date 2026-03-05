// 运营日报
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/',
}

// 获取运营周报
export function getWeeklyreport(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport`, data });
}

// 获取运营周报--人力二级界面
export function getWeeklyreportAttendance(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport/attendance`, data });
}

// 获取运营周报--设备二级界面
export function getWeeklyreportOee(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport/oee`, data });
}

// 获取运营周报--工单二级界面
export function getWeeklyreportOrder(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport/order`, data });
}
// 获取运营周报--产销存管理界面
export function getWeeklyreportValue(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport/value`, data });
}

// 模切BG出勤数据人员明细下载
export function downloadAttendanceDetails(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}attendance/details/download`, data });
}

// 模切BG机台开机明细下载
export function downloadMachworkingDetails(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}machworking/details/download`, data });
}

// 模切BG模切达成明细下载
export function downloadMqachieveDetails(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}mqachieve/details/download`, data });
}

// 模切BG AOI明细下载
export function downloadAoidataDetails(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}aoidata/details/download`, data });
}

// 模切BG客诉明细下载
export function downloadCustomcomplaintDetails(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}customcomplaint/details/download`, data });
}

// 模切产值数据明细下载
export function downloadOutputvalueDetails(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}outputvalue/details/download`, data });
}

// 查询手工良率
export function getHandyieldYield(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}handyield/yield`, data });
}

// 查询手工良率下载清单
export function downloadHandyieldMqyield(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}handyield/yield/downloadlist`, data });
}

// 查询手工良率
export function getStateyieldYield(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}stateyield/yield`, data });
}

// 查询手工良率下载清单
export function downloadStateyieldMqyield(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}stateyield/yield/downloadlist`, data });
}

// 查询包装产出明细
export function getProcessyield(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}processyield/details`, data });
}

// 查询包装产出明细下载清单
export function downloadProcessyield(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}processyield/details/downloadlist`, data });
}

// 查询模切效率
export function getMqefficiencyservice(data) {
  return defHttp.get({ url: `${Api.Prefix}mqefficiencyservice`, data });
}

// 运营周报--topx分析浮窗
export function getProblemInfo(data) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport/probleminfo`, data });
}

// 运营周报--topx分析详细
export function getProblemDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}weeklyreport/problemdetail`, data });
}

// MC周报
export function getMCWeekly(data) {
  return defHttp.get({ url: `${Api.Prefix}mcweekly`, data });
}
// MC周报-明细数据.
export function getMCWeeklyDetails(data) {
  return defHttp.get({ url: `${Api.Prefix}mcweekly/details`, data });
}
// MC周报-获取库位列表.
export function getMCWeeklyLgort(data) {
  return defHttp.get({ url: `${Api.Prefix}mcweekly/lgort`, data });
}

// 模切KPI
export function getDiecutkpiList(data) {
  return defHttp.get({ url: `${Api.Prefix}diecutkpiv2/list`, data });
}
// 模切KPI单指标所有厂区结果
export function getDiecutkpiMetricdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}diecutkpiv2/metricdetail`, data });
}

// 损益KPI结果
export function getProfitKpiList(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/list`, data });
}
// 损益单指标所有厂区结果
export function getProfitandlosMetricdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/metricdetail`, data });
}
// 损益-手工导入数据
export function getProfitandlosManualdatapage(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/manualdatapage`, data });
}
// 维度分组汇总
export function getDimension(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension`, data });
}
// 分页查询参数
export function getDimensionSearchparameter(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/searchparameter`, data });
}
// 工单类型查询参数
export function getDimensionWordNoSearchparameter(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/searchparameter/workNo`, data });
}
// 维度下拉查询参数
export function getSearchparameterByDimension(data, dimension) {
  return defHttp.get({ url: `${Api.Prefix}dimension/searchparameter/${dimension}`, data });
}
// 维度类型查询参数
export function getDimensionDimensionTypeparameter(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/dimensiontype`, data });
}
// 工单维度分页
export function getDimensionWorknopage(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/worknopage`, data });
}
// 工单维度分页导出
export function getDimensionExportWorknodim(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/exportworkNodim`, data });
}
// 维度导入模板下载
export function getDimensionDownload(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/download`, data });
}
// 维度未维护数据下载
export function getNoMaintenanceDatadownload(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/NoMaintenanceData`, data });
}
// 底稿维度分页
export function getDimensionManuscriptpage(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/manuscriptpage`, data });
}
// 底稿维度导出
export function getDimensionExportmanuscriptdim(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/exportmanuscriptdim`, data });
}
// 底稿维度数据同步
export function dimensionSyncbgbase() {
  return defHttp.post({ url: `${Api.Prefix}dimension/syncbgbase` });
}
// 6码料号维度汇总
export function getDimensionSixcodedi(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/sixcodedi`, data });
}
// 6码料号维度汇总导出
export function getDimensionExportSixcodedi(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/exportsixcodedim`, data });
}

// 指标中心--模切稼动
export function getUtilizationrateMainData(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/main`, data });
}
// 查询稼动率概览数据.
export function getUtilizationrateSummaryData(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/summary`, data });
}
// 损益报表导出
export function getProfitandlosReportexport(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/reportexport`, data });
}
// 损益周模板下载.
export function getProfitandlosExportTemplate(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/downloadTemplate`, data });
}
// 损益排行导出.
export function getProfitandlosRankingexport(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/rankingexport`, data });
}
// 产销率报表
export function getChanxiaolv(data, options) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv`, data, ...options });
}
// 产销率报表-产品线项目分组
export function getChanxiaolvGroup(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/group`, data });
}
export function getGroupByPeriod(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/groupByPeriod`, data });
}
// 产销率报表-产品线项目分组
export function getChanxiaolvCascade(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/cascade`, data });
}
// 产销率报表-明细数据
export function getChanxiaolvDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/detail`, data });
}

// 运营分析报表.
export function getDatacollection(data) {
  return defHttp.get({ url: `${Api.Prefix}datacollection`, data });
}

// 运营分析报表-同环比趋势.
export function getDatacollectionTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}datacollection/trend`, data });
}

// 运营分析报表-对应时间排名.
export function getDatacollectionRank(data) {
  return defHttp.get({ url: `${Api.Prefix}datacollection/rank`, data });
}

// 指标中心概览图
export function getProfitandlosSummary(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/summary`, data });
}

// 指标中心趋势图
export function getProfitandlosThend(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/thend`, data });
}
export function getPerformancetrend(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/performancetrend`, data });
}

// WOS趋势
export function getWostrend(data) {
  return defHttp.get({ url: `${Api.Prefix}wostrend`, data });
}

// WOS趋势-二阶.
export function getWostrendDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}wostrend/detail`, data });
}
export function getWostrendDetailState() {
  return defHttp.get({ url: `${Api.Prefix}wostrend/detailstate` });
}

// WOS趋势-三阶.
export function getWostrendWeekly(data) {
  return defHttp.get({ url: `${Api.Prefix}wostrend/weekly`, data });
}
export function getFcdetailbyitem(data) {
  return defHttp.get({ url: `${Api.Prefix}wostrend/fcdetailbyitem`, data });
}

// FC趋势
export function getFctrend(data) {
  return defHttp.get({ url: `${Api.Prefix}wostrend/fc`, data });
}
// FC趋势-二阶.
export function getFctrendDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}wostrend/fcdetail`, data });
}

// 指标中心--AOI数据
export function getAoidatanew(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidatanew`, data });
}

// 指标中心--AOI数据概览
export function getAoidatanewSummary(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidatanew/summary`, data });
}

// AOI数据明细趋势
export function getAoidatanewTrend(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidatanew/trend`, data });
}

// AOI数据明细
export function getAoidatanewDetails(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidatanew/details`, data });
}

// AOI数据明细-下载
export function downloadAoidatanewDetails(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidatanew/details/download`, data });
}

// 指标中心--模切稼动率
export function getDiecututilization(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/diecututilization`, data });
}

// 模切稼动率--二阶
export function getDiecututilizationanalys(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/diecututilizationanalys`, data });
}
// 模切稼动率--单独更新综合、平板、圆刀的分析结果
export function getDiecututilizationanalyssection(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/diecututilizationanalyssection`, data });
}
// 模切稼动率--三阶维度分组
export function getDiecututilizationdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/diecututilizationdetail`, data });
}
// 模切稼动率--维度下拉框数据
export function getUtilizationrateDimesionname(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/dimesionname`, data });
}
// 模切稼动率--四阶维度分组原因分析明细
export function getDiecututilizationanalysdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/diecututilizationanalysdetail`, data });
}

// 指标中心--费用占比卡片
export function getFaremanageAllocation(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/allocation`, data });
}
// 指标中心--费用占比卡片二阶概览
export function getFaremanageAllocationsummary(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/allocationsummary`, data });
}
// 指标中心--费用占比卡片三阶趋势
export function getFaremanageAllocationtrend(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/allocationtrend`, data });
}
// 指标中心--费用占比卡片三阶趋势
export function getFaremanageAllocationdetail(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/allocationdetail`, data });
}
// 指标中心--费用占比卡片三阶趋势
export function getFaremanageDetail(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/details`, data });
}

// 产销率报表--无单价料号明细
export function getNofpricedetails(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/nofpricedetails`, data });
}
// 产销率报表--无单价料号件数
export function getNofpricedetailcount(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/nofpricedetailcount`, data });
}
// 产销率报表--无单价料号明细导出
export function exportnofpricedetails(data) {
  return defHttp.get({ url: `${Api.Prefix}chanxiaolv/exportnofpricedetails`, params: data });
}

// 模切BG机台开机率详情
export function getworkingdetaillist(data) {
  return defHttp.get({ url: `${Api.Prefix}machworking/getworkingdetaillist`, params: data });
}

// 根据厂区更新Sap底稿状态
export function updateSapFactory(params) {
  return defHttp.put({ url: `${Api.Prefix}dimension/sap/factoryupdate?${params}` });
}

// 获取库存提报列表
export function getkucuntbquerylist(data) {
  return defHttp.get({ url: `${Api.Prefix}kucuntb/getkucuntbquerylist`, params: data });
}

// 获取库存提报
export function getkucuntbquerydetails(data) {
  return defHttp.get({ url: `${Api.Prefix}kucuntb/inprogresdetail`, params: data });
}

// 库存提报导出
export function kucuntbexportdata(data) {
  return defHttp.get({ url: `${Api.Prefix}kucuntb/exportdata`, params: data });
}

// 更新库存每日提报备注
export function addorupdateremark(data) {
  return defHttp.post({ url: `${Api.Prefix}kucuntb/addorupdateremark`, params: data });
}

// 分析因子列表
export function getAnalysisfactorlistApi() {
  return defHttp.get({ url: `${Api.Prefix}commonalityanalyse/analysisfactorlist`, params: {} });
}

// 项目号列表
export function getProjectnolistApi(data) {
  return defHttp.get({ url: `${Api.Prefix}commonalityanalyse/projectnolist`, params: data });
}

// 主界面分析
export function analyseMainApi(data) {
  return defHttp.post({ url: `${Api.Prefix}commonalityanalyse/main`, params: data });
}

// 副界面分析
export function analyseAssistantApi(data) {
  return defHttp.post({ url: `${Api.Prefix}commonalityanalyse/assistant`, params: data });
}

// 主界面分析因子列表
export function getMainAnalysisfactorlistApi() {
  return defHttp.get({ url: `${Api.Prefix}commonalityanalyse/mainAnalysisfactorlist`, params: {} });
}

// SN明细数据
export function getCommonalityanalysePage(data) {
  return defHttp.post({ url: `${Api.Prefix}commonalityanalyse/page`, params: data });
}

// 剔除维护
// /report/shipmentdebit/page
export function getshipmentdebitPage(data) {
  return defHttp.get({ url: `${Api.Prefix}shipmentdebit/page`, params: data });
}
// 新增||修改剔除维护
// /report/shipmentdebit/addorupdate
export function updateShipmentdebitPage(data) {
  return defHttp.post({ url: `${Api.Prefix}shipmentdebit/addorupdate`, params: data });
}

// 删除
// /report/shipmentdebit/15
export function deleteShipmentdebit(data) {
  return defHttp.delete({ url: `${Api.Prefix}shipmentdebit/${data}` });
}
