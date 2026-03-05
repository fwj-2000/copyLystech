import { defHttp } from '/@/utils/http/axios';
// import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Equipment/CollectSensorData/',
}

/**
 * 获取设备采集列表
 * @param data
 * @return {Promise<any>}
 */
export function getCollectSensorDataList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
export function getMachineList(data) {
  return defHttp.get({ url: Api.Prefix + `GetMachineList`, data });
}

export function exportCollectExcel(data) {
  return defHttp.get({ url: Api.Prefix + `Export`, data });
}
export function getLineChartData(data) {
  return defHttp.get({ url: Api.Prefix + `GetLineChartData`, data });
}
