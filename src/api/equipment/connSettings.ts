import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Equipment/ConnSettings',
}

//查询列表
export function getDataFormat(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// //获取通信协议列表
// export function getEquipmentProtocolByCode(code = ' ') {
//   return defHttp.get({ url: Api.Prefix + `/GetEquipmentProtocolList/${code}` });
// }

//通过Id查询
export function getDataFormatById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function addDataFormat(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateDataFormat(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deleteDataFormat(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteDataFormat(data) {
  return defHttp.post({ url: Api.Prefix + '/BulkDelete', data });
}

//导出Excel
export function exportDataFormatExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}

// 导入预览
export function importDataFormatPreview(data) {
  return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

// 导入
export function importDataFormatData(data) {
  return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}


//查询参数命令
export function parmByFormat(data) {
  return defHttp.get({ url: Api.Prefix + `/ParmByFormat`, data })
}

//绑定命令
export function addParm(data) {
  return defHttp.post({ url: Api.Prefix + `/AddParm`, data })
}

//解绑命令
export function deleteParm(data) {
  return defHttp.delete({ url: Api.Prefix + `/DeleteParm`, data })
}