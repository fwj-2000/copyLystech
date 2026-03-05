import { downloadByUrl } from '/@/utils/file/download';

// 导出excel
export const downloadFile = ({ requestApi, params, defaultFileName = 'download' }) => {
  return requestApi(params).then(res => {
    const { url, fileName = defaultFileName } = res.data;
    downloadByUrl({ url, fileName: fileName });
  });
};
