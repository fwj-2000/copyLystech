import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/CoreCommon',
}

// 分页列表
// /api/CoreCommon/templatemanagement
export function getTemplateManagementList(data) {
  return defHttp.get({ url: Api.Prefix + `/templatemanagement`, data });
}

// 下载模板
// /api/CoreCommon/templatemanagement/Download
export function downloadTemplateManagement(data) {
  return defHttp.get({ url: Api.Prefix + `/templatemanagement/Download`, data });
}

// 新增
// api/CoreCommon/templatemanagement
export function saveTemplateManagement(data) {
  return defHttp.post({ url: Api.Prefix + `/templatemanagement`, data });
}

// 删除
// /api/CoreCommon/templatemanagement/{id}
export function deleteTemplateManagement(id) {
  return defHttp.delete({ url: Api.Prefix + `/templatemanagement/${id}` });
}

// 修改
// /api/CoreCommon/templatemanagement/{id}
export function updateTemplateManagement(id, data) {
  return defHttp.put({ url: Api.Prefix + `/templatemanagement/${id}`, data });
}

// 启用
// /api/CoreCommon/templatemanagement/enable
export function postTemplateManagementById(data) {
  return defHttp.post({ url: Api.Prefix + `/templatemanagement/enable`, data });
}

// 禁用
// /api/CoreCommon/templatemanagement/disable/{id}
export function postTemplateManagementByDiabled(data) {
  return defHttp.post({ url: Api.Prefix + `/templatemanagement/disable`, data });
}
