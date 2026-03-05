// 绩效排名
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/',
}

// 出勤数据排行
export function getAttendanceRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}attendance/ranking`, data });
}

// 开机率排行
export function getMachworkingRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}machworking/ranking`, data });
}

// 制程良率排行
export function getProcessyieldRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}processyield/ranking`, data });
}

// 模切达成排行
export function getMqachieveRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}mqachieve/ranking`, data });
}

// AOI数据排行
export function getAoidataRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}aoidata/ranking`, data });
}

// OEE数据排行
export function getOeeDataRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}oeedata/ranking`, data });
}

// 产值数据排行
export function getOutputvalueRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}outputvalue/ranking`, data });
}

// 边贡数据排行
export function getFinanceeconomicBgRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic/ranking/bg`, data });
}

// 材料损耗排行
export function getFinanceeconomicClshRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic/ranking/clsh`, data });
}

// 人工排行
export function getFinanceeconomicRgRanking(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}financeeconomic/ranking/rg`, data });
}

// 稼动率数据排行
export function getUtilizationrateRankingData(data) {
  return defHttp.get({ url: `${Api.Prefix}utilizationrate/ranking`, data });
}

// 维度排行
export function getDimensionRankingData(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/rankingstatistic`, data });
}

// 损益排行
export function getProfitandlosRankingData(data) {
  return defHttp.get({ url: `${Api.Prefix}profitandlos/rankingstatistic`, data });
}

// 品质稽核排行
export function getQcauditRanking(data) {
  return defHttp.get({ url: `${Api.Prefix}qcaudit/ranking`, data });
}

// 费用排名数据.
export function getFaremanageRanking(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/ranking`, data });
}

// 人力-人均产值排名
export function getAttendancePercapitaranking(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/percapitaranking`, data });
}

// 产销汇总排名
export function getProductsalesumRanking(data) {
  return defHttp.get({ url: `${Api.Prefix}productsalesum/ranking`, data });
}

// AOI数据排行
export function getAoidatanewRanking(data) {
  return defHttp.get({ url: `${Api.Prefix}aoidatanew/ranking`, data });
}

// 指标中心--费用排名页
export function getFaremanageAllocationrank(data) {
  return defHttp.get({ url: `${Api.Prefix}faremanage/allocationranking`, data });
}
// 指标中心3.8损失率--排名
export function getWorkorderloss38rank(data) {
  return defHttp.get({ url: `${Api.Prefix}dimension/workorderloss38rank`, data });
}
export function performanceranking(data) {
  return defHttp.get({ url: `${Api.Prefix}attendance/performanceranking`, data });
}
