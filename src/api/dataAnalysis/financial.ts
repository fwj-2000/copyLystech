import { AxiosRequestConfig } from 'axios';
import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  REPORT_PREFIX = '/api/report/', // 报表通用
  INVENTORY_PREFIX = '/api/report/inventory/', // 库存在制
  PROFIT_PREFIX = '/api/report/profitandlos/', // 损益
  DIMENSION_PREFIX = '/api/report/dimension/', // 边贡维度
  DIECUTKPI_PREFIX = '/api/report/diecutkpiv2/', // 模切KPI
}
const commonOption: AxiosRequestConfig = {
  timeout: 1000 * 60 * 2,
};
const commonRetryRequestOptions = {
  retryRequest: {
    isOpenRetry: true,
    count: 3,
    waitTime: 100,
  },
};

// 损益KPI结果
export function getProfitKpiList(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}listv2`, data });
}
export function analysisAddOrUpdate(data) {
  return defHttp.post({ url: `${Api.PROFIT_PREFIX}analysisaddorupdate`, data });
}
// 模切KPI
export function getDiecutkpiList(data) {
  return defHttp.get({ url: `${Api.DIECUTKPI_PREFIX}list`, data });
}
// 模切KPI单指标所有厂区结果
export function getDiecutkpiMetricdetail(data) {
  return defHttp.get({ url: `${Api.DIECUTKPI_PREFIX}metricdetail`, data });
}

// 获取经管组织层级
export function getSyOrganization(data = {}) {
  return defHttp.get({ url: `/api/report/organization/getsy`, data, ...commonRetryRequestOptions });
}

// 库位报表-分页数据
export function getwarehouselocationpage(data: Record<string, any> = {}, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}warehouselocationpage`, data, ...commonOption, ...options });
}
// 验证是否存在未维护库位
export function getverifwarehouselocation() {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}verifwarehouselocation`, ...commonOption });
}

// 库位报表-分页数据
export function exportnomaintenance(options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}exportnomaintenance`, ...commonOption, ...options });
}

// 库位报表-分页数据
export function exportwarehouselocationtemplate(options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}exportwarehouselocationtemplate`, ...commonOption, ...options });
}

// 库存在制报表-库存在制汇总
export function getInventorySummary(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}summary`, params: data });
}
// 库存在制报表-在制指标
export function getInventoryMakingindex(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}makingindex`, params: data });
}
// 在制分析
export function getInventoryMakingAnalysis(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}makingindexanalysis`, params: data });
}
/**
 * 库存在制报表 - WIP明细
 * @param data
 */
export function getInventoryWipDetail(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}wipdetail`, params: data });
}
// 库存在制报表-库存明细
export function getinventorylistdetail(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}getinventorylistdetail`, params: data });
}
// 库存明细导出
export function inventoryListexportdata(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}inventoryListexportdata`, data });
}
// 月库存导出 2
export function inventoryListExportDataOther(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}InventoryListExportDataOther`, data });
}
// 库存在制报表-在制明细
export function getmakinglistdetail(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}getmakinglistdetail`, params: data });
}
// 在制明细导出
export function makinglistexportdata(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}makinglistexportdata`, data });
}
// 结单率报表-在制明细
export function closeRatePage(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}closeRatePage`, params: data });
}
// 在制明细导出
export function closeRateExportData(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}closeRateExportData`, data });
}
// 结单率车间明细
export function closeOrderRateDimens(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}closeOrderRateDimens`, params: data });
}
// 分切料头
export function getCutMaterialHead(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}cutmaterialhead`, params: data });
}

// 分切料头明细
export function getCutMaterialHeadDetail(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}cutmaterialheadpage`, params: data });
}
// 分切料头By料号
export function getCutMaterialHeadMatnr(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}cutmaterialheadbymatnr`, params: data });
}

// VMI业务范围照表
export function getInventoryVmiCompareCode(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}vmiCompareCode`, params: data });
}

// 导入VMI数据
// export function importExcel(data) {
//   return defHttp.post({
//     url: `${Api.INVENTORY_PREFIX}importVmiCompareCode`,
//     data,
//     headers: {
//       'Content-Type': ContentTypeEnum.FORM_DATA,
//     },
//   });
// }

// 库位报表-分页数据
export function exportVmiCompareCodeTemplate(options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}exportVmiCompareCodeTemplate`, ...commonOption, ...options });
}

/**
 * 库存在制报表-库存计提汇总表(存跌计提指标)
 * @param data
 * @returns
 */
export function getInventoryJtje(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}jtjeindex`, params: data });
}
// 报废趋势
export function getWorthlesstrend(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}worthlesstrend`, params: data });
}
// 报废top /report/inventory/worthlesstop
export function getWorthlesstTop(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}worthlesstop`, params: data });
}

export function getPositionParam(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}positionparam`, params: data });
}
//报废库龄
export function getWorthlesslibraryage(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}worthlesslibraryage`, params: data });
}

// 损益周报
export function getProfitWeekListV2(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}weekListV2`, params: data });
}
export function syncHFMDataApi(data) {
  return defHttp.post(
    {
      url: `${Api.PROFIT_PREFIX}synchfmdata`,
      params: data,
    },
    {
      joinParamsToUrl: true,
    },
  );
}
export function unlockstatu(data) {
  return defHttp.put(
    {
      url: `${Api.PROFIT_PREFIX}unlockstatu`,
      params: data,
    },
    {
      joinParamsToUrl: true,
    },
  );
}
//解锁预测导入
export function unlockPredictStatu(data) {
  return defHttp.put(
    {
      url: `${Api.PROFIT_PREFIX}unlockPredictStatu`,
      params: data,
    },
    {
      joinParamsToUrl: true,
    },
  );
}
export function pushweeksituation(data) {
  return defHttp.get({
    url: `${Api.PROFIT_PREFIX}pushweeksituation`,
    params: data,
  });
}
// 损益周报明细
export function getProfitWeekListV2detail(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}weeklistv2detail`, params: data });
}
export function getManualdetailbyfactort(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}manualdetailbyfactort`, params: data });
}
//  周损益排名
export function getWeekRank(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}weekrank`, params: data });
}
/**
 * 费用明细数据同步
 * @returns
 */
export function syncWeekDailydata() {
  return defHttp.post({ url: `${Api.PROFIT_PREFIX}syncdata` });
}

// 损益-手工导入数据
export function getProfitandlosManualdatapage(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}manualdatapage`, data });
}
// 损益-Zfi019nl数据
export function getProfitZfi019nl(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}zfi019nl`, data });
}
// 损益-同步019nl数据 /report/profitandlos/sync019nl
export function postSync019nl(orgCode: string, data?: any) {
  return defHttp.post({ url: `${Api.PROFIT_PREFIX}sync019nl?orgCode=${orgCode}` });
}
// 损益-Zfi008数据
export function getProfitZfi008(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}zfi008`, data });
}
// 损益-Zfi080c数据
export function getProfitZfi080c(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}zfi080c`, data });
}
// 损益-Zmm010i数据
export function getProfitZmm010i(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}zmm010i`, data });
}
// 损益-Zmm023数据
export function getProfitZmm023(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}zmm023`, data });
}
export function getProfitZif168(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}zfi168`, data });
}
// 损益报表导出
export function getProfitandlosReportexport(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}reportexport`, data });
}
// 损益单指标所有厂区结果
export function getProfitandlosMetricdetail(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}metricdetail`, data });
}
// 损益排行
export function getProfitandlosRankingData(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}rankingstatistic`, data });
}
// 损益排行 合并 月 周
export function getProfitandlosRankData(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}rank`, data });
}
// 损益排行导出.
export function getProfitandlosRankingexport(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}rankingexport`, data });
}

/** 损益报表 - 下载导入模版 */
export function getProfitandlosDownloadTemplate(data: { fileName: string } = { fileName: '手工数据导入模板' }) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}downloadTemplate`, data });
}

// 补录数据分页
export function getHfmdata(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}hfmdata`, params: data });
}
/** 损益报表 - 海波龙推送页面 */
export function getHfmbasisdata(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}hfmbasisdata`, params: data });
}
/** 损益报表 - 海波龙推送页面 推送请求 */
export function pushHfmdata(data) {
  return defHttp.post(
    {
      url: `${Api.PROFIT_PREFIX}pushhfmdata`,
      params: data,
    },
    {
      joinParamsToUrl: true,
    },
  );
}
export function syncHFMmanualData() {
  return defHttp.post({
    url: `${Api.PROFIT_PREFIX}syncHFMmanualData`,
  });
}
export function pushhfmsituation(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}pushhfmsituation`, params: data });
}
export function getHfmdetail(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}hfmdetail`, params: data });
}
export function getMonthpredict(data) {
  return defHttp.get({ url: `${Api.PROFIT_PREFIX}monthpredict`, params: data });
}

// 成品编号维度分页列表
export function getDimensionOther(data, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}other`, ...commonOption, data, ...options });
}
// 原因分析分页
export function getAnalysisPage(data, options: AxiosRequestConfig = {}) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}analysis/page`, ...commonOption, data, ...options });
}
// 底稿维度分页
export function getDimensionManuscriptpage(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}manuscriptpage`, data });
}
// 分页查询参数
export function getDimensionSearchparameter(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}searchparameter`, data });
}
// 六码维度-维度下拉框数据
export function getDimensiontypeSixCode(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}dimensiontypeSixCode`, data });
}
// 底稿维度数据同步
export function dimensionSyncbgbase() {
  return defHttp.post({ url: `${Api.DIMENSION_PREFIX}syncbgbase` });
}
// 根据厂区更新Sap底稿状态
export function updateSapFactory(params) {
  return defHttp.put({ url: `${Api.DIMENSION_PREFIX}sap/factoryupdate?${params}` });
}
// 维度导入模板下载
export function getDimensionDownload(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}download`, data });
}
// 维度未维护数据下载
export function getNoMaintenanceDatadownload(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}NoMaintenanceData`, data });
}
// 维度分组汇总
export function getDimension(data) {
  return defHttp.get({ url: `${Api.REPORT_PREFIX}dimension`, data });
}
// 工单类型查询参数
export function getDimensionWordNoSearchparameter(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}searchparameter/workNo`, data });
}
// 工单维度分页
export function getDimensionWorknopage(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}worknopage`, data });
}
// 钉钉推送
export function postDingDingRobotNotific(orgCode: string) {
  return defHttp.post({ url: `${Api.DIMENSION_PREFIX}dingDingRobotNotific?notificId=${orgCode}` });
}
// 6码料号维度汇总
export function getDimensionSixcodedi(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}sixcodedi`, data });
}
// 维度排行
export function getDimensionRankingData(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}rankingstatistic`, data });
}
export function getMaterialTransfer(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}materialTransfer`, data });
}
// 维度类型查询参数
export function getDimensionDimensionTypeparameter(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}dimensiontype`, data });
}

/**
 * 成品编号维度、订单号维度、大项目维度 - 分页列表
 * @param data dimension: prod - 成品编号，order - 订单号维度，project - 大项目维度
 * @returns
 */
export function getDimensionOtherData(data: { dimension: 'prod' | 'order' | 'project' } & Partial<Record<string, any>>) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}other`, data });
}

/**
 * 人工效率 - 分页列表
 * @param data
 * @returns
 */
export function getlaborEfficiency(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}laborefficiency`, data });
}
// 区间列表
export function getpriceRange(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}priceRange`, data });
}
// 批量删除区间列表
export function delPriceRangeDel(data) {
  return defHttp.delete({ url: `${Api.DIMENSION_PREFIX}priceRangeDel`, data });
}
// /report/dimension/priceRangeAddOrUpdate
export function updatePriceRange(data: {}) {
  return defHttp.post({
    url: `${Api.DIMENSION_PREFIX}priceRangeAddOrUpdate`,
    data,
  });
}
// By产品线
export function getDimByProjectline(data: {}) {
  return defHttp.get({
    url: `${Api.DIMENSION_PREFIX}getdimbyprojectline`,
    data,
  });
}
// By产品线下拉列表
export function searchparameterCpx(data: {}) {
  return defHttp.get({
    url: `${Api.DIMENSION_PREFIX}searchparameter/cpx`,
    data,
  });
}

// 呆滞TOP-库龄参数
export function getDullDetatilLibraryAgeParam(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}dullDetatilLibraryAgeParam`, data });
}
// 呆滞TOP-是否良品参数
export function dullDetatilGoodProductParam(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}dullDetatilGoodProductParam`, data });
}
// 呆滞TOP汇总 /report/inventory/dulldetatil
export function getDulldetatil(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}dulldetatil`, data });
}

/**
 * 车间维护 - 分页列表
 * @param params
 */
export function getWorkshopcodeList(params: { Mrp: String }) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}workshopcodepage`, params });
}
/**
 * 车间维护 - 未维护数据导出
 * @returns
 */
export function exportWorkShopNoMaintenance() {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}exportWorkShopNoMaintenance` });
}
/**
 * 车间维护 - 导入模版下载
 * @returns
 */
export function exportWorkShopTemplate() {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}exportWorkShopTemplate` });
}
/**
 * 车间维护 - 导入
 * @param data
 * @returns
 */
export function importWorkShop(data: { file: File }) {
  return defHttp.post({
    url: `${Api.INVENTORY_PREFIX}importWorkShop`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * 财务存跌金额 /report/inventory/financedecline
 * @param data
 * @returns
 */
export function getFinancedecline(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}financedecline`, params: data });
}
// 明细导出
export function ExportDataFinanceDecline(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}financeDeclineExportData`, data });
}

export function getfinanceBukrsParamSelect(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}financeBukrsParam`, data });
}

/**
 * 工单损耗分析 - 分页列表
 * @param data
 */
export function getWorkOrderLossAnalysis(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workOrderLossAnalysis`, data });
}
export function getWorkOrderLossAnalysisOption(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workorderlossanalyparam`, data });
}
export function exportWorkOrderLossAnalysis(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workOrderLossAnalysisExport`, data });
}
export function getWorkOrderLossAnalysiDimlist(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workorderlossanalydimlist`, data });
}
/**
 * 3.8工单损耗- 分页列表
 * @param data
 */
export function getWorkOrderLossAnalysis38(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workorderlossanaly38`, data });
}
export function workorderlossanaly38Detail(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workorderlossanaly38page`, data });
}
export function workorderlossanaly38export(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workorderlossanaly38export`, data });
}
export function getWorkOrderLossAnalysisOption38(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workOrderLoss38Dim`, data });
}
export function getWorkOrderLoss38auazhparam(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}workorderloss38auazhparam`, data });
}
/**
 * 工厂明细 - 分页列表
 * @param data
 * @returns
 */
export function getWorthlesspage(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}worthlesspage`, params: data });
}
// 工厂明细导出
export function ExportWorthlessexportdata(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}worthlessexportdata`, data });
}
// 库存在制报表-库存在制汇总
export function getBadInventorySummary(data) {
  return defHttp.get({ url: `${Api.INVENTORY_PREFIX}badinventory`, params: data });
}

// 指标
export function getMilbadpropindex(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}milbadpropindex`, data });
}
// 工单类型下拉参数
export function getMilBadPropAuartDmparam(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}milBadPropAuartDmparam`, data });
}
// 明细页面
export function getMilbadproppage(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}milbadproppage`, data });
}
// 明细导出
export function getMilbadpropExport(data) {
  return defHttp.get({ url: `${Api.DIMENSION_PREFIX}milbadpropExport`, data });
}
// BOM稽核
export function getBomdiffreport(data: {}) {
  return defHttp.get({
    url: `${Api.DIMENSION_PREFIX}bomdiffreport`,
    data,
  });
}
// BOM稽核维度下拉框
export function getBomdiffreportgroupname(data: {}) {
  return defHttp.get({
    url: `${Api.DIMENSION_PREFIX}bomdiffreportgroupname`,
    data,
  });
}
