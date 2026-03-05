import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { useGlobSetting } from '/@/hooks/setting';
const { uploadUrl } = useGlobSetting();
enum Api {
  Prefix = '/api/Production/processrulestemplate',
  preFixCheck = '/api/Production/applyworkprocesspersonnel/check',
}

//查询列表
export function getProcessrulestemplate(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取机台号下拉数据.
export function getMachineNoList(data) {
  return defHttp.get({ url: Api.Prefix + '/getmachinenolist', data });
}

//获取组别下拉数据.
export function getGrouplist(data) {
  return defHttp.get({ url: Api.Prefix + '/getgrouplist', data });
}

//获取厂别下拉数据.
export function getFactorylist(data) {
  return defHttp.get({ url: Api.Prefix + '/getfactorylist', data });
}

//保存工序规则模板详情.
export function saveProcrulesTempDetail(data) {
  return defHttp.put({ url: Api.Prefix + '/savedetail', data });
}

//获取岗位下拉数据.
export function getjobinfolist(data) {
  return defHttp.get({ url: Api.Prefix + '/getjobinfolist', data });
}

//获取工序模板数据详情.
export function getProcrulesTempDetail(data) {
  return defHttp.get({ url: Api.Prefix + '/detail', data });
}

//删除工序模板数据
export function delteProcrulesTemp(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//模板启停
export function updatestatus(id, status) {
  return defHttp.put({ url: Api.Prefix + `/updatestatus/${id}/${status}` });
}

//获取线体数据
export function getlineinfolist() {
  return defHttp.get({ url: Api.Prefix + `/getlineinfolist` });
}

//获取模具编号
export function getMouldmateriallist() {
  return defHttp.get({ url: Api.Prefix + `/getmouldmateriallist` });
}

//获取物料数据
export function getInnermaterialnumberlist(data) {
  return defHttp.get({
    url:
      Api.Prefix +
      `/getinnermaterialnumberlist
`,
    data,
  });
}

//根据工序名称获取配置的表头数据.
export function getConfigtablebyprocessname(data) {
  return defHttp.get({ url: Api.Prefix + `/getconfigtablebyprocessname`, data });
}

//根据工序名称获取已开启的配置.
export function getDetailbyprocessname(data) {
  return defHttp.get({ url: Api.Prefix + `/getdetailbyprocessname`, data });
}

// 上传附件
export function upload(data) {
  return defHttp.post({ url: Api.Prefix + '/uploadfile', data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } });
}

// 下载
export function fileDownload(id) {
  return defHttp.get({ url: `/api/Information/fileinfo/${id}/download` });
}
//操作人校验.
export function SNUsrerCheck(data) {
  return defHttp.get({ url: Api.preFixCheck, data });
}
