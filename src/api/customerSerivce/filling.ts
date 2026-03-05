import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/filingsbill',
}

// 导出 <包含模板>
export const exportCharts = (enterprise, data) => defHttp.get({ url: Api.Prefix + '/exportcustomizedexcel/' + enterprise, data });
// 导入
export const importPreview = (data, enterprise) => {
  return defHttp.post({ url: Api.Prefix + `/import/${enterprise}`, headers: { 'Content-Type': ContentTypeEnum.FORM_DATA }, data });
};
// 保存
export const importSave = (batchcode, params) => {
  return defHttp.post({ url: Api.Prefix + `/saveImportData/${params.multiplyKey}/${batchcode}` });
};

// 客服-列表
// export const getReplayList = data => defHttp.get({ url: Api.Prefix + '/filingsbill/getreplypage', data });
// // 客服-导出
// export const expostReplayCustom = data => defHttp.get({ url: Api.Prefix + '/filingsbill/filingsbillreplyexportexcel', data });

// 布局模板
export const configList = () => {
  return defHttp.get({
    url: Api.Prefix + '/getconfiglist',
  });
};
// 更改布局模板
export const updateConfigList = data => {
  return defHttp.put({
    url: Api.Prefix + '/saveconfig',
    data,
  });
};

// 转办
export const transfer = data => {
  return defHttp.post({
    url: Api.Prefix + '/bulk/bulktransfer',
    data,
  });
};
