import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  PreviewFile = '/api/file/Uploader/Preview',
  Merge = '/api/file/merge',
  AMap = '/api/system/Location',
}

// 获取下载文件链接
export function getDownloadUrl(type: string, fileName: string = '') {
  return defHttp.get({ url: `/api/file/Download/${type}/${fileName}` });
}
// 获取全部下载文件链接（打包下载）
export function getPackDownloadUrl(type: string, data) {
  return defHttp.post({ url: `/api/file/PackDownload/${type}`, data });
}
// 预览文件
export function previewFile(data) {
  return defHttp.get({ url: Api.PreviewFile, data });
}
// 分片组装
export function chunkMerge(data) {
  return defHttp.post({ url: Api.Merge, data, headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED } });
}
// 下载导入示例模板
export function getTemplateDownload(url) {
  return defHttp.get({ url: `/api/${url}/TemplateDownload` });
}
// 下载导入示例模板
export function getImportPreview(url, data) {
  return defHttp.get({ url: `/api/${url}/ImportPreview`, data });
}
// 导入数据
export function importData(url, data) {
  return defHttp.post({ url: `/api/${url}/ImportData`, data });
}
// 导入数据
export function getImportExceptionData(url, data) {
  return defHttp.post({ url: `/api/${url}/ImportExceptionData`, data });
}
// 查询附近数据
export function getAroundList(data) {
  return defHttp.get({ url: Api.AMap + '/around', data });
}
// 根据关键字查询附近数据
export function getTextList(data) {
  return defHttp.get({ url: Api.AMap + '/text', data });
}
// 输入提示
export function getInputTips(data) {
  return defHttp.get({ url: Api.AMap + '/inputtips', data });
}
// 导入
export function upload(url, data) {
  return defHttp.post({ url: url, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

/**
 * @description 删除导入的数据条目
 * @param id
 */
export function deleteImportedData(id: string) {
  return defHttp.delete({
    url: `/api/CoreCommon/ImportTask/${id}`,
  });
}

// 纯文件上传，无业务捆绑，返回资源url
export function uploadfiles(data, url = '/api/Information/fileinfo/uploadfiles') {
  return defHttp.post({ url, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

// 纯文件上传，无业务捆绑，返回资源url
export function downloadfile(data) {
  return defHttp.get({
    url: `/api/Information/fileinfo/downloadfile?filePath=${data.url}&fileName=${data.fileName}`,
    headers: { 'Content-Type': 'application/octet-stream' },
    responseType: 'blob', // 关键设置
  });
}

/**
 * 文件上传
 * @param data
 * @returns
 */
export function uploadInstallFile(data: { fileList: File }) {
  return defHttp.post({
    url: `/api/Information/fileinfo/uploadfiles`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
