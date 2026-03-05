import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/hrbis/manpowertarget',
}

export interface ManpowertargetItem {
  id: string;
  archiveGroup: string;
  factory: string;
  department: string;
  directClassify: string;
  postName: string;
  natureEmployment: string;
  yearMonth: any;
  peopleNumber: string;
}

// 人力目标分页明细
export function getManpowertargetPage(data) {
  return defHttp.get({ url: Api.Prefix + `/page`, data });
}

// 新增人力目标
export function insertManpowertarget(data) {
  return defHttp.post({ url: Api.Prefix + `/insert`, data });
}

// 编辑人力目标人数
export function updateManpowertarget(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}/${data.peopleNumber}` });
}

// 删除人力目标
export function deleteManpowertarget(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

// 模板下载
export function templatedownload(data) {
  return defHttp.get({ url: `${Api.Prefix}/templatedownload`, data });
}
