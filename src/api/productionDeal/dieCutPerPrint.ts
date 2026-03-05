import { defHttp } from '/@/utils/http/axios';

enum BaseApi {
  Prefix = '/api/Production',
}
enum Api {
  Prefix = '/api/Production/diecutperprint',
}

// 分页列表
export function getDieCutPerPrint(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 新增预打印
export function addDieCutPerPrint(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

// 根据工单号和手册类型获取文件信息..
export function getMesfilelist(data) {
  return defHttp.get({ url: Api.Prefix + `/getmesfilelist`, data });
}

// 打印预览.
export function perprint(data) {
  return defHttp.post({ url: Api.Prefix + `/perprint`, data });
}

// 获取文件
export function PreviewFile(data) {
  return defHttp.get({ url: Api.Prefix + `/previewFile`, data, responseType: 'blob' }, { isReturnNativeResponse: true });
}

//根据单据号获取模切预打印信息
export function getDiecutperprintdetail(data) {
  return defHttp.get({ url: Api.Prefix + '/getdiecutperprintdetail', data });
}

// 获取手工流转标签列表
export function getManuallabelprint(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/manuallabelprint', data });
}

// 新增手工流转标签
export function addManuallabelprint(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/manuallabelprint', data });
}

// 预打印列表
export function getProcesspreprint(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint', data });
}

// 新增预打印
export function addProcesspreprint(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint', data });
}

// 预打印详情
export function getProcesspreprintDetail(id) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/' + id });
}

// 根据单据号获取预打印信息..
export function getDetailbydocumentnumber(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getdetailbydocumentnumber', data });
}

// 根据单据号获取下一道工序.
export function getNextroutenode(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getnextroutenode', data });
}

// 根据内部料号获取PCC版本
export function getPccversionlist(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getpccversionlist', data });
}

// 根据工单号和工序获取工艺路线中的当前工序节点数据.
export function getRoutenodedetail(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getroutenodedetail', data });
}

// 开工.
export function startwork(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/startwork', data });
}

// 根据单据号获取下一道工序 -- 开工..
export function getStartworknode(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getstartworknode', data });
}

// 根据单据号获取下一道工序 -- 转换
export function getPrintnextnode(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getprintnextnode', data });
}

// 转换
export function transfer(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/transfer', data });
}

// 标签转换 -- 一转多.
export function transferOnetomany(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/onetomany', data });
}

// 标签转换  -- 多转一.
export function transferManytoone(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/manytoone', data });
}

// 获取开工分页列表.
export function getStartworkpage(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/startworkpage', data });
}

// 接收物料列表
export function getReceivepage(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/receivepage', data });
}

// 接收物料
export function receive(id) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/receive/' + id });
}

// 根据厂区获取工序数据--返回所有数据.
export function getlistbyfactory(data) {
  return defHttp.get({ url: '/api/BaseData/process/getlistbyfactory', data });
}

// 流转标签打印批量新增
export function processpreprintBathadd(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/bathadd', data });
}

// 扫描接收物料
export function receiveByDocumentNumber(data) {
  return defHttp.post({ url: BaseApi.Prefix + '/processpreprint/receiveByDocumentNumber', data });
}

// 根据ID获取流转记录.
export function getlabelrecordbyid(data) {
  return defHttp.get({ url: BaseApi.Prefix + '/processpreprint/getlabelrecordbyid', data });
}
