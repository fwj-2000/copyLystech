import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information',
}

// /api/Information/drawingsreviewreq
export function getDrawingsRequirements(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreviewreq`, data });
}

// 获取内部料好列表
// /api/Information/partnumberapply/searchcamelcase
export function getPartNumberApplySearch(data) {
  return defHttp.get({ url: Api.Prefix + `/partnumberapply/searchcamelcase`, data });
}
// 新增图纸评审需求
///api/Information/drawingsreviewreq
export function postDrawingsRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreviewreq`, data });
}

// 获取工程制作资料详情
export function getengineeringinformationDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/engineeringinformation/${id}` });
}

// 获取图纸评审需求详情列表
// /api/Information/drawingsreviewreq/{id}/item
export function getDrawingsRequirementsItem(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreviewreq/${data.id}/item`, data });
}
// 批量删除
// /api/Information/drawingsreviewreq/bulk/delete
export function batchDelDrawingsRequirements(data) {
  return defHttp.post({ url: Api.Prefix + `/drawingsreviewreq/bulk/delete`, data });
}

// 单个删除
// /api/Information/drawingsreviewreq/{id}
export function delDrawingsRequirements(id) {
  return defHttp.delete({ url: Api.Prefix + `/drawingsreviewreq/${id}` });
}

// 修改
// /api/Information/drawingsreviewreq/{id}
export function putDrawingsRequirements(data) {
  return defHttp.put({ url: Api.Prefix + `/drawingsreviewreq/${data.id}`, data });
}

// 审核
// /api/Information/drawingsreviewreq/review
export function reviewDrawingsRequirements(data) {
  return defHttp.put({ url: Api.Prefix + `/drawingsreviewreq/review`, data });
}

// 反审核
// /api/Information/drawingsreviewreq/reversereview
export function reverseReviewDrawingsRequirements(data) {
  return defHttp.put({ url: Api.Prefix + `/drawingsreviewreq/reversereview`, data });
}

// 导出
// /api/Information/drawingsreviewreq/exportexcel
export function exportDrawingsRequirements(data) {
  return defHttp.get({
    url: Api.Prefix + `/drawingsreviewreq/exportexcel`,
    data,
  });
}

// 获取图纸评审需求明细
// /api/Information/drawingsreviewreq/{id}
export function getDrawingsRequirementsDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/drawingsreviewreq/${data.id}` });
}
