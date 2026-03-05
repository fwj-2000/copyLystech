import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/diecutquantity',
}
// 模切报数------

//查询列表
export function getDiecutquantity(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//删除工序模板数据
export function deleteDiecutquantity(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//新增
export function addDiecutquantity(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateDiecutquantity(id) {
  return defHttp.put({ url: Api.Prefix + '/' + id });
}

// //根据单据号获取模切预打印信息
// export function getDiecutquantityDetail(data) {
//   return defHttp.get({ url: Api.Prefix + '/getdiecutperprintdetail', data });
// }

// 手工开工-------

//获取所有手工数据.
export function getManualstart(data) {
  return defHttp.get({ url: '/api/Production/manualstart', data });
}

//新增手工数据.
export function addManualstart(data) {
  return defHttp.post({ url: '/api/Production/manualstart', data });
}

//新增手工数据.
export function getManualstartById(id) {
  return defHttp.get({ url: '/api/Production/manualstart/' + id });
}

//更新手工数据.
export function updateManualstartById(id) {
  return defHttp.put({ url: '/api/Production/manualstart/' + id });
}

//更新开工状态.
export function updateManualStatus(id) {
  return defHttp.post({ url: '/api/Production/manualstart/confirm/' + id });
}

// 流转工序---------------

//查询列表
export function getProcesscirculation(data) {
  return defHttp.get({ url: '/api/Production/processcirculation', data });
}

//删除工序模板数据
export function deleteProcesscirculation(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//新增
export function addProcesscirculation(data) {
  return defHttp.post({ url: '/api/Production/processcirculation', data });
}

//修改
export function updateProcesscirculation(id) {
  return defHttp.put({ url: '/api/Production/processcirculation' + '/' + id });
}

//根据单据号获取手工流转标签打印信息并且返回计划单号.
export function getManuallabelprintdetail(data) {
  return defHttp.get({ url: '/api/Production/processcirculation/getdiecutperprintdetail', data });
}

//根据单据号获取流转标签打印信息-流转
export function getProcessCirculationTagDetail(data) {
  return defHttp.get({ url: '/api/Production/ProcessCirculation/GetProcessPrePrintDetail', data });
}

//根据单据号获取流转标签打印信息-报数
export function getProcessDiecutquantityTagdetail(data) {
  return defHttp.get({ url: Api.Prefix + '/getprocesspreprintdetail', data });
}

//根据单据号获取流转标签打印信息-报数SN
export function getProcessPrePrintDetailBySn(data) {
  return defHttp.get({ url: Api.Prefix + '/getprocesspreprintdetailbysn', data });
}

// 报数工序-批量新增
export function diecutquantityBathadd(data) {
  return defHttp.post({ url: Api.Prefix + '/bathadd', data });
}

// SN批量报工
export function snbathadd(data) {
  return defHttp.post({ url: Api.Prefix + '/snbathadd', data });
}
