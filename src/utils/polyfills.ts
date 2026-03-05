/**
 * 通过requestAnimationFrame和MessageChannel模拟空闲回调机制
 */
const IdleCallbackAdapter = (() => {
  // 回调任务队列
  let callbackQueue: any = [];
  // 当前帧的截止时间
  let frameDeadline = 0;
  // 是否已安排调度
  let isScheduled = false;

  // 创建消息通道用于异步调度
  const channel = new MessageChannel();
  const port1 = channel.port1;
  const port2 = channel.port2;

  // 消息处理函数 - 在浏览器空闲时执行
  port2.onmessage = () => {
    // 计算当前帧剩余时间
    const timeRemaining = () => Math.max(0, frameDeadline - performance.now());
    const currentTime = performance.now();

    // 当前帧有空闲时间且有任务待执行
    if (currentTime < frameDeadline && callbackQueue.length > 0) {
      const deadline = {
        timeRemaining,
        didTimeout: timeRemaining() <= 0,
      };

      // 复制当前任务队列并清空
      const tasksToRun = [...callbackQueue];
      callbackQueue = [];

      // 执行所有任务
      tasksToRun.forEach(task => {
        try {
          task.callback(deadline);
        } catch (error) {
          console.error('requestIdleCallbackAdapter task error:', error);
        }
      });
    }

    // 标记调度结束
    isScheduled = false;

    // 如果队列中还有任务，安排下一次调度
    if (callbackQueue.length > 0) {
      scheduleIdleCallback();
    }
  };

  // 安排空闲回调检测
  const scheduleIdleCallback = () => {
    if (isScheduled) return;
    isScheduled = true;

    // 使用requestAnimationFrame获取下一帧开始时间
    requestAnimationFrame(rafTime => {
      // 设置帧截止时间（当前时间 + 16.67ms）
      frameDeadline = rafTime + 16.667;
      // 通过消息通道触发任务检查
      port1.postMessage(null);
    });
  };

  // 返回适配器API
  return {
    /**
     * 请求空闲回调
     * @param {Function} callback - 空闲时执行的回调函数
     * @param {Object} options - 配置选项
     * @returns {string} 任务ID（用于取消任务）
     */
    request(callback, options = {}) {
      const task: any = {
        callback,
        options,
        id: `idle_task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      };

      // 将任务加入队列
      callbackQueue.push(task);

      // 如果没有安排调度，启动调度
      if (!isScheduled) {
        scheduleIdleCallback();
      }

      return task.id;
    },

    /**
     * 取消空闲回调
     * @param {string} id - 要取消的任务ID
     * @returns {boolean} 是否成功取消
     */
    cancel(id) {
      const initialLength = callbackQueue.length;

      // 过滤掉指定ID的任务
      callbackQueue = callbackQueue.filter(task => task.id !== id);

      return initialLength !== callbackQueue.length;
    },
  };
})();

/**
 * Safari浏览器requestIdleCallback适配器
 */
export function requestIdleCallbackAdapter(callback, options = {}) {
  if (window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options);
  }
  return IdleCallbackAdapter.request(callback, options);
}
