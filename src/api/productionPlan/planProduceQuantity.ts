import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Production/PlanProduceQuantity',
}

//获取厂区列表
export function getFactoryAreaList(data) {
  return defHttp.get({ url: '/api/Production/ProcessRulesTemplate/GetFactoryList', data });
}

//查询列表
export function getPlanProduceQuantity(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//详情
export function getPlanProduceQuantityDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addPlanProduceQuantity(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updatePlanProduceQuantity(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deletePlanProduceQuantity(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeletePlanProduceQuantity(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportPlanProduceQuantityExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/Export`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + '/SaveImportData', data });
}
