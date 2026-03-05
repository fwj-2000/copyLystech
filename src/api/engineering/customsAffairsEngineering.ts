import { defHttp } from '/@/utils/http/axios';
// import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/CustomsAffairsEngineering',
}

/**
 * 获取列表
 * @param params
 * @returns
 */
export function getList(params: any) {
  return defHttp.get({ url: Api.Prefix, params });
}

/**
 * 导出Excel
 * @param params
 * @returns
 */
export function exportExcel(params: any) {
  return defHttp.get({ url: Api.Prefix + '/Export', params });
}

/**
 * 获取详情
 * @param id
 * @returns
 */
export function getDetail(id: string) {
  return defHttp.put({ url: Api.Prefix + '/GetDetail/' + id });
}

/**
 * 提交
 * @param data customsAffairsApplyId: 交付中心-关务业务-备案需求表Id；engineeringUpInputs：工程资料维护列表；translateEngineerings：工程资料维护翻译列表；produceUpInputs：生产资料维护列表
 * @returns
 */
export function save(data: { customsAffairsApplyId: string; engineeringUpInputs: Array<any>; translateEngineerings: Array<any>; produceUpInputs: Array<any> }) {
  return defHttp.post({ url: Api.Prefix, data });
}

/**
 * 暂存
 * @param data customsAffairsApplyId: 交付中心-关务业务-备案需求表Id；engineeringUpInputs：工程资料维护列表；translateEngineerings：工程资料维护翻译列表；produceUpInputs：生产资料维护列表
 * @returns
 */
export function temporaryStorage(data: {
  customsAffairsApplyId: string;
  engineeringUpInputs: Array<any>;
  translateEngineerings: Array<any>;
  produceUpInputs: Array<any>;
}) {
  return defHttp.post({ url: Api.Prefix + '/TemporaryStorage', data });
}

/**
 * 转办
 * @param data
 * @returns
 */
export function bulkTransfer(data: { ids: Array<string>; transferUserId: string; transferRemarks: string }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/BulkTransfer', data });
}

/**
 * 获取关务工程资料产品类型
 */
export function getCAEProductType() {
  return defHttp.get({ url: Api.Prefix + '/GetCAEProductType' });
}

/**
 * 获取翻译列表
 * @param data customsAffairsApplyId: 交付中心-关务业务-备案需求表Id; engineeringUpInputs: 工程资料维护列表
 */
export function getTranslateInfo(data: { customsAffairsApplyId: string; engineeringUpInputs: any }) {
  return defHttp.put({ url: Api.Prefix + '/GetTranslateInfo', data });
}

/**
 * 获取可引用的历史记录的列表
 * @param params
 * @returns
 */
export function getHistoryPage(params: any) {
  return defHttp.get({ url: Api.Prefix + '/GetHistoryPage', params });
}

/**
 * 用8码获取技术资料
 * @param shortMaterialCode 8码
 */
export function getTechnologyInfoHistory(shortMaterialCode: string) {
  return defHttp.get({ url: Api.Prefix + '/GetTechnologyInfoHistory', data: { shortMaterialCode } });
}

/**
 * 更新维护类型
 * @param data
 * @param data.ids 记录Id列表
 * @param data.maintainedType 维护类型 1-无需维护，2-启动维护
 * @returns
 */
export function updateMaintainedType(data: { ids: Array<string>; maintainedType: 1 | 2 }) {
  return defHttp.post({ url: Api.Prefix + '/bulk/UpdateMaintainedType', data });
}
