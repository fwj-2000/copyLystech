import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/materialdevelopimport',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
}

// 重新送样
export function sampleMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/resendsample', data });
}

// 重新推荐
export function recommendMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/resendrecommend`, data });
}

// 暂存
export function storageMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/temporarystorage`, data });
}

// 获取节点详情
export function getNodelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getnodelist', data });
}

// 修改
export function updateMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/updateimport`, data });
}

// 撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/BulkBackWithdraw', data });
}

// 驳回
export function rejectMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/returnengineering', data });
}

// 不导入
export function notImportMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/notimport', data });
}

// 导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importmaterialdevelapplyexportexcel`, data });
}

// 上传附件
export function upload(id, data) {
  return defHttp.post({ url: Api.Prefix + `/${id}/upload/uploadtechnologyinfo`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

export function getFiles(id) {
  return defHttp.get({
    url: Api.Prefix + `/${id}/technologyinfohistory`,
  });
}

// 下载
export function fileDownload(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}/download/downloadtechnologyinfo` });
}

// 删除
/**
 * 删除文件下载的接口函数
 * @param {string|number} id - 要删除的文件ID
 * @returns {Promise} 返回一个Promise对象，包含删除操作的响应结果
 */
export function delFileDownload(id) {
  return defHttp.delete({ url: Api.Prefix + `/delete/deletetechnologyinfo/${id}` }); // 发送DEL请求到删除接口，拼接完整的URL路径
}
