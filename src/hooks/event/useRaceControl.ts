import { reactive } from 'vue';
export function useRaceCondition() {
  const requestCounters = reactive(new WeakMap());
  const abortControllers = reactive(new WeakMap());

  // 准备请求 - 返回当前请求ID和signal
  const prepareRequest = row => {
    // 取消前一个未完成的请求
    if (abortControllers.has(row)) {
      abortControllers.get(row).abort();
    }

    // 创建新的AbortController
    const controller = new AbortController();
    abortControllers.set(row, controller);

    // 递增当前行的请求计数器
    const currentCount = (requestCounters.get(row) || 0) + 1;
    requestCounters.set(row, currentCount);

    return {
      requestId: currentCount,
      signal: controller.signal,
      cleanup: () => {
        if (abortControllers.get(row) === controller) {
          abortControllers.delete(row);
        }
      },
    };
  };

  // 检查请求是否过期
  const isRequestValid = (row, requestId) => {
    return requestCounters.get(row) === requestId;
  };

  return {
    prepareRequest,
    isRequestValid,
  };
}
