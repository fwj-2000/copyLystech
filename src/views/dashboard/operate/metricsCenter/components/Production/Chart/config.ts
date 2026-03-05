import type { EChartsOption } from 'echarts';
export interface IMetricKeyListConfig {
  key: string; // 取值的键
  name: string; // 指标名称
  color: string; // 图例的颜色
  suffix?: string; // 后缀
  labelPos?: 'top' | 'bottom' | 'insideTop';
  labelStyle?: any; // 标签样式
}

// 圆形颜色id
export enum EColorId {
  chanzhi = 'chanzhi',
  chuhuo = 'chuhuo',
}

export const colorInfo = {
  [EColorId.chanzhi]: {
    process: '#5EBEFF',
    circleFill: 'paint0_linear_14581_51727',
    circleStroke: 'paint1_linear_14581_51727',
  },
  [EColorId.chuhuo]: {
    process: '#4B7BEC',
    circleFill: 'paint0_linear_14581_51736',
    circleStroke: 'paint1_linear_14581_51736',
  },
};

// 折线图
export const getLineSeriiesOptions = (keyListConfig: IMetricKeyListConfig, listdata: any): any => {
  const { key, suffix = '%', labelPos = 'top', color = '#FF7B00', labelStyle = {} } = keyListConfig;
  const data = listdata.map(item => Number.parseFloat(item[key]));
  return {
    name: keyListConfig.name,
    type: 'line',
    smooth: true,
    itemStyle: {
      color,
    },
    label: {
      show: true,
      color: '#333',
      distance: 2,
      position: labelPos,
      formatter: `{c}${suffix}`,
      ...labelStyle,
    },
    data: data.map(value => ({
      value,
    })),
    // 设置类别间距
    categoryGap: 30,
  };
};

// 基础数据
export const chartOptions: EChartsOption = {
  title: {
    top: 0,
    textStyle: {
      fontWeight: 'normal',
      fontSize: 13,
    },
  },
  legend: {
    top: 0,
    right: 0,
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    enterable: false,
    appendTo: 'body',
  },
  grid: {
    left: 6,
    right: 6,
    top: 44,
    bottom: 32,
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
      width: 30,
      lineHeight: 16,
      interval: 0,
      fontSize: 10,
      margin: 16, //刻度标签与轴线之间的距离。
      overflow: 'break',
    },
  },
  yAxis: {
    show: true,
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#E6E6E6',
        type: 'dashed',
      },
    },
  },
  series: [],
};

// 产值配置
export const chanzhiListConfig: IMetricKeyListConfig[] = [
  {
    key: 'YcCzfValue',
    name: '预测',
    color: '#AEAEAE',
    suffix: '',
    labelPos: 'top',
    labelStyle: {
      color: 'rgba(33,33,33,0.4)',
    },
  },
  {
    key: 'SjCzfValue',
    name: '实际',
    color: '#5ABCFE',
    suffix: '',
  },
];

// 出货配置
export const chuhuoListConfig: IMetricKeyListConfig[] = [
  {
    key: 'YcChfValue',
    name: '预测',
    color: '#AEAEAE',
    suffix: '',
    labelPos: 'top',
    labelStyle: {
      color: 'rgba(33,33,33,0.4)',
    },
  },
  {
    key: 'SjChfValue',
    name: '实际',
    color: '#4B7BEC',
    suffix: '',
  },
];

// 产销率配置
export const chanxiaolvListConfig: IMetricKeyListConfig[] = [
  {
    key: 'YcCxl',
    name: '目标',
    color: '#AEAEAE',
    suffix: '%',
    labelPos: 'top',
    labelStyle: {
      color: 'rgba(33,33,33,0.4)',
    },
  },
  {
    key: 'SjCxl',
    name: '实际',
    color: '#FF7B00',
    suffix: '%',
  },
];
