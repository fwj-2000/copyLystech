import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Production/SplitingPrint',
}

//查询分切记录列表
export function getSplitingRecordList(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//获取分切详情
export function getSplitingRecordDetail(id) {
  return defHttp.get({ url: Api.Prefix + `/${id}` });
}

//创建分切打印信息
export function addSplitingRecordData(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//获取厂区列表
export function getFactoryListByName(name = ' ') {
  return defHttp.get({ url: Api.Prefix + `/GetFactoryAreaList/${name}` });
}

//查询物料列表
export function getMaterialList(data) {
  return defHttp.get({ url: Api.Prefix + `/GetMaterials`, data });
}
