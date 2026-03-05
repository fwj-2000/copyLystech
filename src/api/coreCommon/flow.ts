// api/flow.ts
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Flow = '/api/CoreCommon/flow',
  FlowDetail = '/api/CoreCommon/flow/getflowdetail',
  SaveFlowDetail = '/api/CoreCommon/flow/saveflowdetail',
}

// 分页列表
export function getFlowList(params?: {
  keyword?: string;
  queryJson?: string;
  currentPage?: number;
  pageSize?: number;
  sidx?: string;
  sort?: string;
  menuId?: string;
}) {
  return defHttp.get({
    url: Api.Flow,
    params,
  });
}

// 新增流程
export function createFlow(data: any) {
  return defHttp.post({
    url: Api.Flow,
    data,
  });
}

// 获取流程图详情
export function getFlowDetail(id: string) {
  return defHttp.get({
    url: Api.FlowDetail,
    params: { id },
  });
}

// 保存流程图详情
export function saveFlowDetail(data: any) {
  return defHttp.put({
    url: Api.SaveFlowDetail,
    data,
  });
}

// 删除流程
export function deleteFlow(id: string) {
  return defHttp.delete({
    url: `${Api.Flow}/${id}`,
  });
}

// 修改流程
export function updateFlow(data: any) {
  return defHttp.put({
    url: `${Api.Flow}/${data.id}`,
    data,
  });
}

// 启用流程
export function enableFlow(id: string) {
  return defHttp.put({
    url: `${Api.Flow}/enable/${id}`,
  });
}

// 停用流程
export function disableFlow(id: string) {
  return defHttp.put({
    url: `${Api.Flow}/disable/${id}`,
  });
}
