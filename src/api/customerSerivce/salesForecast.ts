import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/salesForecastHistory/',
}

/**
 * @description 销售预测 - 历史数据 - 导入模板下载
 */
export function downloadTemplateSalesForecastHistory() {
  return defHttp.get({ url: Api.Prefix + 'download/importTemplate' });
}

/**
 * 销售预测 - 历史数据 - 导入
 * @param data 文件内容
 * @param mainProcess 主要制程
 */
export function importSalesForecastHistory(data: any, mainProcess: string) {
  const params = new URLSearchParams('');
  mainProcess && params.append('mainProcess', mainProcess);
  return defHttp.post({
    url: Api.Prefix + 'import' + '?' + params.toString(),
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

/**
 * @description 销售预测 - 历史数据 - 分页列表
 * @param params
 */
export function getSalesForecastHistory(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * @description 销售预测 - 历史数据 - 导出
 * @param params
 */
export function exportSalesForecastHistory(params: any) {
  return defHttp.get({ url: Api.Prefix + 'exportExcel', params: { ...params, terminalCustomerPartNumber: 'XX' } });
}

/**
 * @description 根据版本号获取历史数据详情
 * @param batchCode 版本号
 */
export function getSalesForecastHistoryDetail(batchCode: string) {
  return defHttp.get({ url: `${Api.Prefix}getBatchList/${batchCode}` });
}

/**
 * @description 销售预测 - 历史数据 - 保存
 * @param data
 */
export function updateSalesForecastHistory(data: Array<any>) {
  return defHttp.post({ url: Api.Prefix + 'update', data });
}

/**
 * @description 销售预测 - 历史数据 - 批量删除
 * @param ids 将被删除的id集合
 */
export function bulkDeleteSalesForecastHistory(ids: string[]) {
  return defHttp.post({ url: Api.Prefix + 'bulkDelete', data: ids });
}
