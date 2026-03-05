import { EChartsOption } from 'echarts';
import { PopoverInfoList } from '/@/views/dashboard/operate/types';
import { IMetricKeyConfigList } from '/@/views/dashboard/types';

// 折线指标配置
export const metricKeyConfigList: IMetricKeyConfigList[] = [
  {
    key: 'MoqiejiadongRate',
    name: '综合',
    color: 'rgba(255, 123, 0, 1)',
    suffix: '%',
  },
  {
    key: 'YMoqiejiadongRate',
    name: '圆刀',
    color: 'rgba(90, 188, 254, 1)',
    suffix: '%',
  },
  {
    key: 'PMoqiejiadongRate',
    name: '平板',
    color: 'rgba(75, 123, 236, 1)',
    suffix: '%',
  },
];

// 基本的配置项
export const chartOptions: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    show: true,
    appendTo: 'body',
  },
  legend: {
    show: true,
    left: 0,
    itemWidth: 18,
    itemHeight: 8,
  },
  grid: {
    left: 0,
    right: 8,
    top: 44,
    bottom: 16,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      width: 38,
      interval: 0, // 强制显示所有的标签
      margin: 8, //刻度标签与轴线之间的距离。
      overflow: 'break',
    },
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
    min: 0,
    nameTextStyle: {
      align: 'right',
      fontSize: 10,
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'dashed',
      },
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      formatter: '{value}%',
    },
  },
  series: [],
  barWidth: 16,
  barGap: '100%',
};

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '时间稼动率',
    content: ['机台运行时间/排产时间'],
  },
];

// 是否包含NPI下拉
export const DEFAULT_IS_CONTAIN = 'MP';
export const isContainOptions = [
  {
    label: '全部',
    value: 'ALL',
  },
  {
    label: 'NPI',
    value: 'NPI',
  },
  {
    label: 'MP',
    value: 'MP',
  },
];
