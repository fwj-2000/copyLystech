import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/Information/materialdevelopapply',
}

//查询列表
export function getNewMaterial(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addNewMaterial(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//暂存
export function storageMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/temporarystorage', data });
}

// 获取详情
export function getDetails(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
}

// 获取节点详情
export function getNodelist(data) {
  return defHttp.get({ url: Api.Prefix + '/getnodelist', data });
}

//修改
export function updateMaterial(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

// 撤回
export function recallMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbackreview', data });
}
// 终止
export function stopMaterial(data) {
  return defHttp.put({ url: Api.Prefix + '/bulkbacktermination', data });
}

//删除
export function deleteNewMaterial(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeleteNewMaterial(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

//导出Excel
export function exportNewMaterialExcel(data) {
  return defHttp.get({ url: Api.Prefix + `/importmaterialdevelapplyexportexcel`, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

// 导入预览
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(data) {
  return defHttp.post({ url: Api.Prefix + `/${data}` });
}

// 获取工厂
export function getFactory(data) {
  return defHttp.get({ url: Api.Prefix + `/getfactorylist`, data });
}
// 获取内部料号
export function getInnerPartNumber(data) {
  return defHttp.get({ url: Api.Prefix + `/getinnermaterialnumber`, data });
}

// 一键生成材料描述
export function verifySpec() {
  return defHttp.post({ url: Api.Prefix + `/generatematerialdesc` });
}

// 生成材料描述
export function autoSpec(data) {
  return defHttp.post({ url: Api.Prefix + `/getmaterialdesc`, data });
}

// 修正旧数据的预估总量
export function synproductarea() {
  return defHttp.post({ url: Api.Prefix + `/synproductarea` });
}
