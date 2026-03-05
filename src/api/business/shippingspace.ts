import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/basedata/shippingspace',
}

//查询列表
export function getList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//查询下拉列表
export function getSelectList(data) {
  return defHttp.get({ url: Api.Prefix + `/List`, data });
}

//通过ID查询
export function getDetailById(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//新增
export function add(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function update(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function del(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDelete(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importshippingspaceexportexcel`, data });
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

// 导出Excel
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

// 获取工厂信息:factoryCode
export function getFactoryList(data) {
  return defHttp.get({
    url: Api.Prefix + `/getfactorylist`,
    data,
  });
}
