import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information/filingsapply',
}

// 上传图片
export const uploadImg = data => {
  return defHttp.post({
    url: Api.Prefix + '/upload/picturev2',
    data,
    headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
  });
};

// 图片历史记录
export const getImgHistory = (innerMaterialNumber, role) => {
  return defHttp.get({
    url: Api.Prefix + `/getpicturerecord/${innerMaterialNumber}`,
  });
};

// 审核记录
export const getAuditlog = (id, role) => {
  return defHttp.get({
    url: Api.Prefix + `/getauditlog/${id}/${role}`,
  });
};

// 转办
export const transferFilling = data => {
  return defHttp.post({
    url: Api.Prefix + '/transfer',
    data,
  });
};
