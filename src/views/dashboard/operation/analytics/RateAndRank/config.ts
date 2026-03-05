import { EChartsOption } from 'echarts';

// 同比图表配置
export const baseOption: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '0%',
    right: '0%',
    top: '66',
    bottom: '0%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E9E9E9',
          type: 'dashed',
        },
      },
    },
    {
      type: 'value',
    },
  ],
  series: [],
};
