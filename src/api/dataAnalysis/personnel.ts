import { defHttp } from '/@/utils/http/axios';

enum Api {
  PREFIX = '/api/report/',
  RESIGNATION_PREFIX = '/api/report/resignation/',
  ORGANIZATION_PREFIX = '/api/report/Organization/',
  ATTENDANCE_PREFIX = '/api/report/attendance/', // 考勤
}
// 人力预算
export function getBudget(data = {}) {
  return defHttp.get({ url: `${Api.PREFIX}renlibudget`, data });
}

// 离职率分析
export function getresignationrate(data = {}) {
  return defHttp.get({ url: `${Api.RESIGNATION_PREFIX}resignationrate`, data });
}

// 离职周期分析
export function getresignationcycle(data = {}) {
  return defHttp.get({ url: `${Api.RESIGNATION_PREFIX}resignationcycle`, data });
}

// 离职率分析导出
export function exportResignationRate(data) {
  return defHttp.get({ url: `${Api.RESIGNATION_PREFIX}exportResignationRate`, params: data });
}

// 离职周期分析导出
export function exportResignationCycle(data) {
  return defHttp.get({ url: `${Api.RESIGNATION_PREFIX}exportResignationCycle`, params: data });
}

// 厂区负责人列表
export function getResponsiblePerson(data) {
  return defHttp.get({ url: `${Api.ORGANIZATION_PREFIX}responsiblePerson`, params: data });
}
// 厂区负责人列表
export function updateResponsiblePerson(data) {
  return defHttp.post({ url: `${Api.ORGANIZATION_PREFIX}updateResponsiblePerson`, params: data });
}
// 异常考勤列表
export function getAttenPushLog(data) {
  return defHttp.get({ url: `${Api.ATTENDANCE_PREFIX}attenpushlog`, params: data });
}
