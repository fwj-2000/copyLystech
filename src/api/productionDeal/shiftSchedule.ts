import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Prefix = '/api/Production/shiftschedule',
}

//查询列表
export function getShiftschedule(data) {
  return defHttp.get({ url: Api.Prefix, data });
}

// //通过name查询
// export function getShiftscheduleByName(name) {
//   return defHttp.get({ url: Api.Prefix + `/${name}` });
// }

//自动排班
export function autoSchedule(data) {
  return defHttp.post({ url: Api.Prefix + `/autoschedule`, data });
}

//保存
export function saveShiftschedule(data) {
  return defHttp.post({ url: Api.Prefix + `/save`, data });
}

//保存
export function getShiftscheduleDetail(data) {
  return defHttp.get({ url: Api.Prefix + `/detail`, data });
}

//导入
export function importShiftschedule(data) {
  return defHttp.post({
    url: Api.Prefix + `/import`,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}

//下载
export function downloadImporttemplate() {
  return defHttp.get({ url: Api.Prefix + `/download/importtemplate` });
}

//批量删除
export function batchDeleteShiftschedule(data) {
  return defHttp.post({ url: Api.Prefix + `/bulk/delete`, data });
}

// 导出
export function batchExportShiftschedule(data) {
  return defHttp.get({ url: Api.Prefix + `/export`, data });
}
