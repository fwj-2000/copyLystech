import type { EChartsOption } from 'echarts';

export const option: EChartsOption = {
  color: ['#4b7bec'],
  grid: {
    left: 12,
    top: 24,
    right: 0,
    bottom: 12,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    showContent: false,
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: false, // 分割线
    },
    axisLine: {
      show: false, // 轴线
    },
    axisTick: {
      show: false, // 刻度线
    },
    axisLabel: {
      width: 52,
      interval: 0,
      hideOverlap: false,
      lineHeight: 16,
      overflow: 'break',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  series: [
    {
      data: [],
      type: 'bar',
      itemStyle: {
        borderRadius: [50, 50, 0, 0],
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 12, // 字体大小
        color: '#333', // 字体颜色
      },
    },
    {
      data: [],
      color: 'transparent',
      type: 'bar',
      itemStyle: {
        borderRadius: [50, 50, 0, 0],
      },
      barGap: '-100%',
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
  ],
  barWidth: 12,
};
