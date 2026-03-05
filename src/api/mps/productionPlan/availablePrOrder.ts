import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/mps/AvailablePrOrder',
}

//查询列表
export function getAvailablePrOrder(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// 导入模板下载
export function templateDownload() {
  return defHttp.get({ url: Api.Prefix + `/Download/ImportTemplate` });
}

// 导入预览修改
export function importPreview(data) {
  return defHttp.post({ url: Api.Prefix + `/Import`, data, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA } }, { ignoreCancelToken: false });
}

//保存导入的数据
export function importSave(batchCode: string, data) {
  return defHttp.post({ url: Api.Prefix + `/${batchCode}`, data });
}
