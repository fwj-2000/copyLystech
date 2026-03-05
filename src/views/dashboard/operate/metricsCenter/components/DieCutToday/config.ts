import type { EChartsOption } from 'echarts';
import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 基本的配置项
export const baseOptions: EChartsOption = {
  legend: {
    show: true,
    orient: 'horizontal',
    width: '100%',
    height: 44,
    itemWidth: 12,
    itemHeight: 12,
    top: 0,
    left: 0, // 左侧距离10%
    itemStyle: {
      borderWidth: 0,
    },
  },
  grid: {
    left: 0,
    right: 0,
    bottom: 12,
    top: 44,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    valueFormatter: value => `${value}%`,
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      margin: 8, // 刻度标签与轴线之间的距离
      color: '#666', // 文本颜色
      fontSize: 12, // 字体大小
    },
  },
  yAxis: {
    show: true,
    min: 0,
    max: 100, // 设定最大值为100%，根据需要调整
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'dashed',
      },
    },
    axisLabel: {
      show: true,
      formatter: '{value}%',
    },
  },
  series: [
    {
      name: '实际达成',
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%', // 格式化函数，显示数据值
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#4B7BEC',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(245, 248, 255, 1)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(75, 123, 236, 1)', // 100% 处的颜色
            },
          ],
        },
      },
      data: [65, 65],
    },
    {
      name: '目标达成',
      type: 'bar',
      barGap: '300%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%', // 格式化函数，显示数据值
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#AEAEAE',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(255, 255, 255, 1)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(174, 174, 174, 1)', // 100% 处的颜色
            },
          ],
        },
      },
      data: [50, 30],
    },
  ],
  barWidth: 12,
};

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '模切达成',
    content: ['一个模切生产计划为一个批次，模切多工序取主工序产量'],
  },
  {
    title: '批次达成率',
    content: ['生产数量达成批次数/模切批次总数*100%'],
  },
  {
    title: '数量达成率',
    content: ['总模切报数数量/总模切计划数量*100%'],
  },
];
