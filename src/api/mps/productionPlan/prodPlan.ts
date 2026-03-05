import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/mps/masterproductionplan',
}

//查询列表
export function getMasterProductionPlan(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 根据id获取详情
export function getMasterProductionPlanDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/detail', data });
}

// 下推排程交期
export function pushScheduleDelivery(data) {
  return defHttp.post({ url: Api.Prefix + '/pushscheduledelivery', data });
}
