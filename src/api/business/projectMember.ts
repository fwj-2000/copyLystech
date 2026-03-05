import { setObjToUrlParams } from '/@/utils';
import { defHttp } from '/@/utils/http/axios';
// import { ContentTypeEnum } from '/@/enums/httpEnum';
enum Api {
  Prefix = '/api/basedata/projectMembersGroup',
}

// 项目成员主表
export function getProjectMembers(data) {
  return defHttp.get({ url: Api.Prefix, data });
}
// 获取成员详情
export function getProjectMembersDetails(ids, params) {
  return defHttp.put({
    url: setObjToUrlParams(Api.Prefix + '/getGroupTeams', params),
    data: ids,
  });
}
// 更新成员
export function updateProjectMembers(data, params?: Object) {
  return defHttp.put({
    url: setObjToUrlParams(Api.Prefix + '/updateGroup', params || null),
    data,
  });
}

/**
 * 配置角色管理
 */
// 配置角色 获取配置类型
// export function getProjectMembersSonConfig(data) {
//   return defHttp.get({ url: Api.Prefix + '/getRoleList?mainProcess=', data });
// }
// 获取全部角色列表
export function getProjectMembersConfigs(data) {
  return defHttp.get({ url: Api.Prefix + '/getConfigTypeList', data });
}
// 获取二级角色列表
export function getProjectMembersSonConfig(data) {
  return defHttp.get({ url: Api.Prefix + '/getRoleList', data });
}
// 保存配置类型  /api/basedata/projectMembersGroup/saveRole
export function saveProjectMembersConfig(data) {
  return defHttp.post({ url: Api.Prefix + '/saveRole', data });
}
// 获取小厂数据
export function getFactorylist(data) {
  return defHttp.get({ url: Api.Prefix + '/getFactorylist', data });
}

/**
 * 项目组管理
 */
// 获取项目组列表
export function getProjectMembersTeamList(data) {
  return defHttp.get({ url: Api.Prefix + '/getTeamList', data });
}
// 删除项目组
export function deleteProjectMembersTeamList(id) {
  return defHttp.delete({ url: Api.Prefix + `/deleteConfig?id=${id}` });
}
// 更新项目组
export function updateProjectMembersTeamList(data) {
  return defHttp.post({
    // url: setObjToUrlParams(Api.Prefix + '/maintainConfig'),
    url: Api.Prefix + '/maintainConfig',
    data,
  });
}
// 指定项目组
export function designProjectMembersTeam(data) {
  return defHttp.post({ url: Api.Prefix + '/designatedGroup', data });
}

/**
 * 人员维护
 */
// 获取下拉框
export function getdropdownlist(data) {
  return defHttp.get({ url: Api.Prefix + '/getdropdownlist', data });
}
// 待维护的下拉
export function getdropdownlistToMain(data) {
  return defHttp.get({ url: Api.Prefix + '/getdownlist', data });
}
// 获取待维护
export function getToMaintainist(data) {
  return defHttp.get({ url: Api.Prefix + '/getUnprocessedGroupList', data });
}
// 获取已维护
export function getMaintainList(data) {
  return defHttp.get({ url: Api.Prefix + '/getMaintainedTeamList', data });
}
// 修改人员 /api/basedata/projectMembersGroup/updateGroup
export function updateMaintain(data) {
  return defHttp.put({ url: Api.Prefix + '/updateGroup', data });
}
// 指定项目组 /api/basedata/projectMembersGroup/designatedGroup
export function updateMaintai(data) {
  return defHttp.put({ url: Api.Prefix + '/designatedGroup', data });
}

// 获取枚举类型集合 /api/basedata/projectMembersGroup/getTypeList
export function getEnumTypeList(data) {
  return defHttp.post({ url: Api.Prefix + '/getTypeList', data });
}

// 导出总表数据
export function exportTotals(data) {
  return defHttp.get({ url: Api.Prefix + '/exportExcel', data });
}
