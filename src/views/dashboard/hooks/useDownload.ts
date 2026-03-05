import { ref } from 'vue';
import { downloadByUrl } from '/@/utils/file/download';
export interface IParams {
  afterUpload?: () => void;
  requestApi: (...arg: any) => Promise<any>;
}

export function useDownload(params: IParams) {
  const { requestApi, afterUpload } = params;
  const loading = ref<boolean>(false);

  // 导出excel
  const downloadFile = (params, defaultFileName = 'download') => {
    loading.value = true;
    return requestApi(params)
      .then(res => {
        const { url, fileName = defaultFileName } = res.data;
        downloadByUrl({ url, fileName: fileName });
      })
      .finally(() => {
        loading.value = false;
        afterUpload?.();
      });
  };

  return { downloadFile, loading };
}
