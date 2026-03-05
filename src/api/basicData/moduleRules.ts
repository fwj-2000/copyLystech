import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/CoreCommon',
}

// 获取列表
export function getList(data) {
  return defHttp.get({
    url: Api.Prefix + '/idgeneratorrulemodule',
    data,
  });
}

// 新增
export function create(data) {
  return defHttp.post({
    url: Api.Prefix + '/idgeneratorrulemodule',
    data,
  });
}
// update
export function update(data) {
  return defHttp.put({
    url: Api.Prefix + '/idgeneratorrulemodule/' + data.Id,
    data,
  });
}
// del
export function del(id) {
  return defHttp.delete({
    url: Api.Prefix + '/idgeneratorrulemodule/' + id,
  });
}

// 获取规则名称
export function getNameList(data) {
  return defHttp.get({
    url: Api.Prefix + '/IDGeneratorRule/List',
    data,
  });
}

// 获取料号与规则列表
export function getProduceCodeRulePage(data) {
  return defHttp.get({
    url: Api.Prefix + '/idgeneratorrulemodule/produceCodeRulePage',
    data,
  });
}

// 获取料号下拉数据
export function getInnerMaterialNumberList(data) {
  return defHttp.get({
    url: '/api/Production/ProcessRulesTemplate/GetInnerMaterialNumberList',
    data,
  });
}

// 打印
export function geTemplabel(data) {
  return defHttp.post({
    url: '/api/Production/templabel',
    data,
  });
}

// 分页列表
export function geTemplabelList(data) {
  return defHttp.get({
    url: '/api/Production/templabel',
    data,
  });
}
