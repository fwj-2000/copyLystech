import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/BaseData',
}
// 列表
// /api/BaseData/wagerate
export function getBaseDataWagerate(data) {
  return defHttp.get({ url: Api.Prefix + `/wagerate`, data });
}
// 终端客户代码列表
//  api/basedata/TerminalCustomer/List
export function getBaseDataTerminalCustomerList(data) {
  return defHttp.get({ url: Api.Prefix + `/TerminalCustomer/ListAsync`, data });
}
// 工资率全局列表
// /api/BaseData/wagerate/list
export function getBaseDataWagerateList(data) {
  return defHttp.get({ url: Api.Prefix + `/wagerate/list`, data });
}
// 修改
// /api/BaseData/wagerate/{id}
export function editBaseDataWagerate(data) {
  return defHttp.put({ url: Api.Prefix + `/wagerate/${data.id}`, data });
}

// 新增
// /api/BaseData/wagerate
export function addBaseDataWagerate(data) {
  return defHttp.post({ url: Api.Prefix + `/wagerate`, data });
}

// 下载模版
// /api/BaseData/wagerate/download/importtemplate
export function downloadBaseDataWagerateImportTemplate() {
  return defHttp.get({ url: Api.Prefix + `/wagerate/download/importtemplate` });
}
// 保存
// /api/BaseData/wagerate/{batchcode}
export function saveBaseDataWagerate(batchcode, data) {
  return defHttp.post({ url: Api.Prefix + `/wagerate/${batchcode}`, data });
}
// 导出
// /api/BaseData/wagerate/export
export function exportBaseDataWagerate(data) {
  return defHttp.get({ url: Api.Prefix + `/wagerate/export`, data });
}
// 删除
// /api/BaseData/wagerate/{id}
export function delBaseDataWagerate(id) {
  return defHttp.delete({ url: Api.Prefix + `/wagerate/${id}` });
}
// 批量删除
// /api/BaseData/wagerate/bulkdelete
export function bulkdeleteBaseDataWagerate(data) {
  return defHttp.post({ url: Api.Prefix + `/wagerate/bulkdelete`, data });
}
// 批量导入
// /api/BaseData/wagerate/import
export function importBaseDataWagerate(data) {
  return defHttp.post({
    url: Api.Prefix + `/wagerate/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
