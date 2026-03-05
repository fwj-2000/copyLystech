import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { useGlobSetting } from '/@/hooks/setting';
import { AxiosProgressEvent } from 'axios';
import { UploadFileParams } from '/#/axios';
const globSetting = useGlobSetting();

const { uploadDrawingReview = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadDrawingReviewImg(params: UploadFileParams, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadDrawingReview,
      onUploadProgress,
    },
    {
      ...params,
      data: {
        filePath: 'DrawingsReview',
      },
    },
  );
}

export function uploadPCCImg(params: UploadFileParams, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadDrawingReview,
      onUploadProgress,
    },
    {
      ...params,
      data: {
        filePath: 'PCC',
      },
    },
  );
}

export function uploadPCCInstallImg(params: UploadFileParams, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  console.log(params);
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadDrawingReview,
      onUploadProgress,
    },
    {
      data: {
        file: params,
        filePath: 'PCC',
      },
    },
  );
}
//

export function uploadProductCodeImg(params: UploadFileParams, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  console.log(params);
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: '/dev/api/Information/PartNumberApply/Upload/ProductImage',
      onUploadProgress,
    },
    {
      ...params,
    },
  );
}

export function uploadProductImg(params: UploadFileParams, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: '/dev/api/Information/PartNumberApply/Upload/ProductImage',
      onUploadProgress,
    },
    {
      ...params,
    },
  );
}

// 图片公共上传入口
export function uploadImg(params: UploadFileParams, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: globSetting.uploadFileUrl,
      onUploadProgress,
    },
    {
      ...params,
    },
  );
}
