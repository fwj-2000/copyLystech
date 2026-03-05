import { unref, onUnmounted, onActivated, onDeactivated, type Ref } from 'vue';

interface AutoScrollConfig {
  windowSize: number;
  interval?: number;
}

export function useChartAutoScroll(chartRef: Ref<any>, config: AutoScrollConfig) {
  const { windowSize, interval = 2000 } = config;

  let timer: any = null;
  let currentStart = 0;
  let storedDataLen = 0;

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = (dataLen?: number) => {
    if (dataLen !== undefined) {
      storedDataLen = dataLen;
      currentStart = 0;
    }
    if (storedDataLen <= windowSize) {
      stop();
      return;
    }
    stop(); // 防止多重定时器

    // 4. 启动定时器
    timer = setInterval(() => {
      // 获取 ECharts 实例 (兼容常见的 vue-echarts 封装方式)
      const el = unref(chartRef);
      if (!el) return;

      const chartInstance = el.getInstance?.() || el.chart || el;

      if (!chartInstance || typeof chartInstance.dispatchAction !== 'function') return;

      // 计算下一帧的索引
      currentStart++;
      let currentEnd = currentStart + windowSize - 1;

      // 触底循环逻辑
      if (currentEnd >= storedDataLen) {
        currentStart = 0;
        currentEnd = windowSize - 1;
      }

      // 触发滚动
      chartInstance.dispatchAction({
        type: 'dataZoom',
        dataZoomIndex: 0,
        startValue: currentStart,
        endValue: currentEnd,
      });
    }, interval);
  };

  // === 核心修改在这里 ===

  // 1. 组件销毁时清除 (标准流程)
  onUnmounted(() => {
    stop();
  });

  // 2. 页面离开/切换 Tab 时清除 (KeepAlive 流程)
  onDeactivated(() => {
    stop();
  });

  // 3. 页面重新进入时恢复 (KeepAlive 流程)
  onActivated(() => {
    // 如果之前有数据，就恢复滚动
    if (storedDataLen > windowSize) {
      start();
    }
  });

  return { start, stop };
}
