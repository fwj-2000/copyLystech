import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Information/pccpackingtype',
  Prefix2 = '/api/Information',
}

//查询列表
export function getPCCPackingType(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

//新增
export function addPCCPackingType(data) {
  return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updatePCCPackingType(data) {
  return defHttp.put({ url: Api.Prefix + `/${data.id}`, data });
}

//删除
export function deletePCCPackingType(id) {
  return defHttp.delete({ url: Api.Prefix + `/${id}` });
}

//批量删除
export function blukDeletePCCPackingType(data) {
  return defHttp.post({ url: Api.Prefix + '/bulk/delete', data });
}

// 获取计量单位列表
export function getunitList(keyword) {
  return defHttp.get({
    url: Api.Prefix2 + '/unit/keywordlist',
    data: {
      keyword,
    },
  });
}
