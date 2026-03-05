import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/processscheduling',
}

//工序排产计划分页列表.
export function getProcessschedulingpage(data) {
  return defHttp.get({ url: Api.Prefix + '/processschedulingpage', data });
}

//计划完工时间编辑列表
export function getPlancompletetimes(data) {
  return defHttp.get({ url: Api.Prefix + '/plancompletetimes', data });
}

//更新序号
export function updateseq(data) {
  return defHttp.post({ url: Api.Prefix + '/updateseq', data });
}

//更新计划完工时间
export function updatecompletetime(data) {
  return defHttp.post({ url: Api.Prefix + '/updatecompletetime', data });
}

//初始化排产数据.
export function initSchedulingData(data) {
  return defHttp.post({ url: Api.Prefix + '/init-scheduling-data', data });
}

export function processschedulingExport(data) {
  return defHttp.get({ url: Api.Prefix + '/export', data });
}
