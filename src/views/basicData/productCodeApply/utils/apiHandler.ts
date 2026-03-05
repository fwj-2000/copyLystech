import { message } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';

const { createMessage } = useMessage();

/**
 * 统一处理 API 响应
 * @param response API 响应
 * @param successCallback 成功回调
 * @param errorCallback 错误回调
 */
export function handleApiResponse(response: { code: number; msg: string }, successCallback?: () => void, errorCallback?: (msg: string) => void) {
  if (response.code === 200) {
    message.success(response.msg);
    successCallback?.();
  } else {
    const errorMsg = response.msg || '操作失败';
    message.error(errorMsg);
    errorCallback?.(errorMsg);
  }
}

/**
 * 创建标准的 API 处理器
 * @param apiCall API 调用函数
 * @param successCallback 成功回调
 * @param errorCallback 错误回调
 */
export function createApiHandler(apiCall: () => Promise<{ code: number; msg: string }>, successCallback?: () => void, errorCallback?: (msg: string) => void) {
  return () => {
    return apiCall().then(response => {
      handleApiResponse(response, successCallback, errorCallback);
    });
  };
}
