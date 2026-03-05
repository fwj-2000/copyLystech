// hr离职报表
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/report/resignation/',
}

// 离职率分析
export function getresignationrate(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}resignationrate`, data });
}

// 离职周期分析
export function getresignationcycle(data = {}) {
  return defHttp.get({ url: `${Api.Prefix}resignationcycle`, data });
}

// 离职率分析导出
export function exportResignationRate(data) {
  return defHttp.get({ url: `${Api.Prefix}exportResignationRate`, params: data });
}

// 离职周期分析导出
export function exportResignationCycle(data) {
  return defHttp.get({ url: `${Api.Prefix}exportResignationCycle`, params: data });
}
