import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/checkmaintain',
}

//查询列表
export function getCheckmaintain(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addCheckmaintain(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateCheckmaintain(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteCheckmaintain(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteCheckmaintain(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportCheckmaintainExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/export`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

// 导入预览
export function importCheckmaintainPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

// 导入保存
export function importCheckmaintainData(batchcode, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchcode}`, data });
}
