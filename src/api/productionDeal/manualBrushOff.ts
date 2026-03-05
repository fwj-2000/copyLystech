import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Production',
}
// 分页列表
export function getManualpctransfer(data) {
  return defHttp.get({ url: Api.Prefix + '/manualpctransfer', data });
}

// 新增
export function addManualpctransfer(data) {
  return defHttp.post({ url: Api.Prefix + '/manualpctransfer', data });
}

// 详情
export function getManualpctransferDetail(id) {
  return defHttp.get({ url: Api.Prefix + '/manualpctransfer' + id });
}

// 导入ecel
export function importManualpctransfer(data) {
  return defHttp.post({
    url: `${Api.Prefix}/manualpctransfer/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

// 保存导入的数据
export function saveManualpctransfer(batchcode) {
  return defHttp.post({ url: Api.Prefix + '/manualpctransfer/' + batchcode });
}

// 下载模版
export function downloadimporttemplate(batchcode) {
  return defHttp.get({ url: Api.Prefix + '/manualpctransfer/download/importtemplate' + batchcode });
}
