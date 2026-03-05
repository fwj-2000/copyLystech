import { ref } from 'vue';
import { http2s } from '/@/adapter/utils';

export function useFileLoading() {
  // 加载进度，0 到 100 的数值
  const loadingProgress = ref(0);
  // 是否正在加载
  const isLoading = ref(false);
  // 是否加载成功
  const isSuccess = ref(false);
  // 是否加载失败
  const isError = ref(false);
  // 加载完成的文件内容
  const loadedContent = ref(null);
  // 是否开启缓存
  const enableCache = ref(false);
  const loadFile = async fileUrl => {
    isLoading.value = true;
    isSuccess.value = false;
    isError.value = false;
    loadingProgress.value = 0;
    fileUrl = http2s(fileUrl);
    // 如果不开启缓存，每次都重新加载
    if (!enableCache.value) {
      const _currentFileUrl = new URL(fileUrl);
      _currentFileUrl.searchParams.set('_t', Date.now().toString()); // 添加时间戳
      fileUrl = _currentFileUrl.toString();
      console.log('fileUrl', fileUrl);
    }
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.responseType = 'blob'; // 根据实际文件类型选择合适的数据类型

      // 监听加载进度
      xhr.onprogress = event => {
        if (event.lengthComputable) {
          const percentComplete = Number.parseInt(((event.loaded / event.total) * 100).toFixed(0));
          loadingProgress.value = percentComplete;
        }
      };

      // 监听加载完成
      xhr.onload = () => {
        if (xhr.status === 200) {
          loadedContent.value = xhr.response;
          isSuccess.value = true;
        } else {
          isError.value = true;
          throw new Error('加载失败，状态码：' + xhr.status);
        }
        isLoading.value = false;
      };

      // 监听加载错误
      xhr.onerror = () => {
        isError.value = true;
        isLoading.value = false;
        throw new Error('加载出错');
      };

      xhr.send();
    } catch (error) {
      console.error('文件加载错误：', error);
      isError.value = true;
      isLoading.value = false;
    }
  };

  const setProgress = progress => {
    if (progress >= 0 && progress <= 100) {
      loadingProgress.value = progress;
    }
  };

  return {
    loadingProgress,
    isLoading,
    isSuccess,
    isError,
    loadedContent,
    loadFile,
    setProgress,
  };
}
