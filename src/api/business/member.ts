import { defHttp } from '/@/utils/http/axios';
// import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/basedata/projectmembers',
}

//查询列表
// export function getMember(data) {
//   return defHttp.get({ url: Api.Prefix, data });
// }

// //通过ID查询
// export function getMemberById(id) {
//   return defHttp.get({ url: Api.Prefix + `/${id}` });
// }

// //新增
// export function addMember(data) {
//   return defHttp.put({ url: Api.Prefix, data });
// }

// //修改
// export function updateMember(data) {
//   return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
// }

// //删除
// export function deleteMember(id) {
//   return defHttp.delete({ url: Api.Prefix + `/${id}` });
// }

// //批量删除
// export function blukDeleteMember(data) {
//   return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
// }

// //导出Excel
// export function exportMemberExcel(data) {
//   return defHttp.get({ url: Api.Prefix + `/Importreviewconfigexportexcel`, data });
// }

// // 启用
// export function enableMember(Id) {
//   return defHttp.put({ url: Api.Prefix + `/enable/${Id}` });
// }
// // 停用
// export function disableMember(Id) {
//   return defHttp.put({ url: Api.Prefix + `/disable/${Id}` });
// }

// // 模板导出
// export function templateMember() {
//   return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
// }

// // 导入预览
// export function importPreview(data) {
//   return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
// }

// //导出Excel
// export function importSave(data) {
//   return defHttp.post({ url: Api.Prefix + `/${data}` });
// }

// // 获取责任人类型
// export function getMemberTypes() {
//   return defHttp.get({ url: Api.Prefix + '/getpersontypelist' });
// }

// 获取类型集合
type ConfigType = 'personType' | 'mainProcess' | 'workflowType' | 'productionType' | 'configStatus' | 'businessType';
// 类型集 personType：责任类型 mainProcess： 主要制程 workflowType：流程类型 productionType：生产类型 configStatus：配置状态 businessType：业务类型
export function getConfigTypes(types: ConfigType[]) {
  return defHttp.put({ url: Api.Prefix + '/gettypelist', data: types });
}

// 获取配置类型
// export function getApplyDetailByMaterial(data) {
//   return defHttp.get({ url: '/api/Information/reviewconfig/gettypelist', data });
// }

// 获取全部的配置类型
export function getconfigtypelist() {
  return defHttp.get({ url: Api.Prefix + '/getconfigtypelist' });
}
// 获取子项的配置类型
export function getSonconfigtypelist(mainprocess) {
  return defHttp.get({ url: Api.Prefix + `/getmemberroleconfiglist/${mainprocess}` });
}
// 保存所有的配置角色
export function saveConfig(data) {
  return defHttp.post({ url: Api.Prefix + `/saveconfig`, data });
}
// 保存
export function maintainSave(data) {
  return defHttp.post({ url: Api.Prefix + `/maintain`, data });
}
// 获取列表信息
export function getlist(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
// 获取详细信息
export function getDetail(data) {
  return defHttp.put({ url: Api.Prefix + '/getdetail', data });
}
// 更新详细信息
export function updateDetail(data) {
  return defHttp.put({ url: Api.Prefix + '/updatemaintain', data });
}

// 保存下拉框数据
// 传1则根据内部项目代码查询为主； 传2则根据直接客户查询为主；传3则根据料件号查询为主；
export function getSlectOps(data: { code: string; type: 1 | 2 | 3; mainProcess: string | number }) {
  return defHttp.get({ url: Api.Prefix + `/getdropdownlist`, data });
}

// 获取工厂列表
export function getFactorylist(data: { mainProcess: string; code: string }) {
  return defHttp.get({ url: Api.Prefix + `/getfactorylist/`, data });
}

// 校验
export function checkidentical(data) {
  return defHttp.put({ url: Api.Prefix + '/checkidentical', data });
}

// 保存项目成员团队配置
export function saveTeam(data, configType) {
  return defHttp.post({ url: Api.Prefix + '/saveteamconfig?configType=' + configType, data });
}

// 获取项目成员团队维护列表
export function getTeamList(data) {
  return defHttp.get({ url: Api.Prefix + `/getprojectteamconfiglist`, data });
}

// 删除项目成员团队
export function delTeam(id) {
  return defHttp.put({ url: Api.Prefix + '/deleteprojectteamconfig?id=' + id });
}

// 保存未维护项目成员
export function savewaitmaintain(data, teamid) {
  return defHttp.post({ url: Api.Prefix + '/savewaitmaintain?teamId=' + teamid, data });
}

// 维护
export function maintain(data) {
  return defHttp.post({ url: Api.Prefix + '/maintain', data });
}

// 获取料件号
export function getMetaiaList(data) {
  return defHttp.get({ url: Api.Prefix + `/getprojectskulist`, data });
}

// 获取直接客户
export function getCustomerCodeList(data) {
  return defHttp.get({ url: Api.Prefix + `/getprojectcustomercodelist`, data });
}
// 获内部项目代码
export function getInnerCodeist(data) {
  return defHttp.get({ url: Api.Prefix + `/getprojectlist`, data });
}

// 更新已维护成员
export function updtaeprojectmembers(configType) {
  return defHttp.put({ url: Api.Prefix + '/updtaeprojectmembers?configType=' + configType });
}
