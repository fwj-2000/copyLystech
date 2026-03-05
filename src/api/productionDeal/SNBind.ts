import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production/dispatchcode',
}

//查询列表
export function getDispatchcode(data) {
  return defHttp.post({ url: Api.Prefix + '/page', data });
}

// 校验热压标签.
export function checktemplabel(data) {
  return defHttp.get({ url: Api.Prefix + '/checktemplabel', data });
}

// 获取SN数据.
export function getsninfo(data) {
  return defHttp.get({ url: Api.Prefix + '/getsninfo', data });
}

// 新增.
export function addDispatchcode(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 详情
export function getDispatchcodeDetail(id) {
  return defHttp.get({ url: Api.Prefix + '/' + id });
}

// 获取SN绑定数量
export function getsnbindqty() {
  return defHttp.get({ url: Api.Prefix + '/getsnbindqty' });
}

// 派码作废
export function discard(data) {
  return defHttp.post({ url: Api.Prefix + '/Discard', data });
}

// 获取最大镭射序号
export function getmaxlsseq() {
  return defHttp.get({ url: Api.Prefix + '/getmaxlsseq' });
}

// 批量设置镭射序号
export function batchsetlsseq(data) {
  return defHttp.put({ url: Api.Prefix + '/batchsetlsseq', data });
}

// 上传excel文件
export function importExcel(data) {
  return defHttp.post({
    url: `${Api.Prefix}/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 导入保存.
export function saveimport(batchCode) {
  return defHttp.post({ url: Api.Prefix + `/saveimport/${batchCode}` });
}

// 导入模板下载.
export function getTemplateDownload() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

export function exportExcel(data) {
  return defHttp.post({ url: Api.Prefix + '/export', data });
}
