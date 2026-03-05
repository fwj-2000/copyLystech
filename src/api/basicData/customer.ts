import { defHttp } from '/@/utils/http/axios';
enum Api {
  Prefix = '/api/Information',
}

// 获取客户名称列表
export function getCustomerList(keyword) {
  return defHttp.get({
    url: Api.Prefix + '/customer/list',
    data: {
      keyword,
    },
  });
}
// 同步SAP客户信息
// /api/Information/customer/insertfromsap
export function insertFromSap(data) {
  return defHttp.post({
    url: Api.Prefix + `/customer/insertfromsap`,
    data,
  });
}

// 获取联系人
export function getGrouplist(data) {
  return defHttp.get({
    url: Api.Prefix + `/contacts/getgrouplist`,
    data,
  });
}

// 保存联系人
export function bathSave(data) {
  return defHttp.get({
    url: Api.Prefix + `/contacts/bathsave`,
    data,
  });
}
