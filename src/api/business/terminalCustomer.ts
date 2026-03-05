import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { getAppEnvConfig } from '/@/utils/env';
const { VITE_GLOB_API_URL } = getAppEnvConfig();
enum Api {
  Prefix = '/api/basedata/terminalcustomer',
  ProductStagePrefix = '/api/basedata/ProductStage',
}

// 获取列表
export function getList(data) {
  return defHttp.get({
    url: Api.Prefix,
    data,
  });
}
// 获取详情
export function getDetail(id) {
  return defHttp.get({
    url: Api.Prefix + '/' + id,
  });
}

// 新增
export function create(data) {
  return defHttp.post({
    url: Api.Prefix,
    data,
  });
}
// update
export function update(data) {
  return defHttp.put({
    url: Api.Prefix + '/' + data.id,
    data,
  });
}
// del
export function del(id) {
  return defHttp.delete({
    url: Api.Prefix + '/' + id,
  });
}

// del
// /api/basedata/terminalcustomer/bulk/delete
export function batchDel(data) {
  return defHttp.post({
    url: Api.Prefix + '/bulk/delete',
    data,
  });
}

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importterminalcustomerexportexcel`, data });
}

// 启用
export function enable(Id) {
  return defHttp.put({ url: Api.Prefix + `/enable/${Id}` });
}
// 停用
export function disable(Id) {
  return defHttp.put({ url: Api.Prefix + `/disable/${Id}` });
}

// 模板导出
export function template() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//导出Excel
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

// 校验数据
export function checkidentical(mainProcess, terminalCustomerCode) {
  return defHttp.put({ url: Api.Prefix + `/checkidentical?terminalCustomerCode=${terminalCustomerCode}&mainProcess=${mainProcess}` });
}

// 获取编码列表
export function getCodeList(data) {
  return defHttp.get({ url: Api.Prefix + `/getavailablecodes`, data });
}

// 上传图片 /basedata/terminalcustomer/upload/images
export function uploadImage(data, onUploadProgress) {
  return defHttp.uploadFile<{
    message: string;
    code: number;
    data: string;
  }>(
    {
      url: VITE_GLOB_API_URL + Api.Prefix + `/upload/images`,
      onUploadProgress,
    },
    data,
  );
}

// 删除图片 /basedata/terminalcustomer/delete/image
export function deleteImage(data) {
  return defHttp.delete({ url: Api.Prefix + `/delete/image`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

// 保存脱敏信息
export function updateTerminalDesensitization(id, data) {
  return defHttp.put({
    url: Api.Prefix + `/${id}/desensitization`,
    data,
  });
}

// 获取终端客户产品阶段列表
export function getProductStageList(data) {
  return defHttp.get({ url: Api.ProductStagePrefix + '/List', data });
}

// 终端客户-产品阶段维护
export function productStageCreateOrUpdate(data) {
  return defHttp.post({ url: Api.ProductStagePrefix + '/createOrUpdate', data });
}

// 终端客户-获取终端客户产品阶段列表V2
export function getProductStageListv2(data) {
  return defHttp.get({ url: Api.ProductStagePrefix + '/Listv2', data });
}

// 终端客户-产品阶段新增或更新数据 V2
export function productStageCreateOrUpdateV2(data) {
  return defHttp.post({ url: Api.ProductStagePrefix + '/createOrUpdateV2', data });
}
