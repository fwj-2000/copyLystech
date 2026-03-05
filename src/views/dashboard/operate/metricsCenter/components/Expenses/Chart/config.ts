import type { EChartsOption } from 'echarts';

export const highlightColor = {
  type: 'linear',
  x: 0,
  x2: 1,
  y: 0,
  y2: 0,
  colorStops: [
    {
      offset: 0,
      color: 'rgba(61, 156, 221, 0)',
    },
    {
      offset: 0.45,
      color: 'rgba(255, 255, 255, 0.1)',
    },
    {
      offset: 0.5,
      color: 'rgba(255, 255, 255, 0.35)',
    },
    {
      offset: 0.55,
      color: 'rgba(255, 255, 255, 0.1)',
    },
    {
      offset: 1,
      color: 'rgba(61, 156, 221, 0)',
    },
  ],
};
// 方形柱子图表的渐变颜色配置
export const colorStyle = {
  foot: {
    type: 'linear',
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(0, 21, 69, 0)',
      },
      {
        offset: 1,
        color: 'rgba(0, 61, 208, 0.13)',
      },
    ],
  },
  head: '#6b91ea',
  bar: {
    type: 'linear',
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [
      {
        offset: 1,
        color: 'rgba(104, 140, 226, 0.05)',
      },
      {
        offset: 0,
        color: 'rgba(64, 109, 214, 1)',
      },
    ],
  },
};

export interface IMetricKeyListConfig {
  key: string; // 取值的键
  legendKey?: string; // 图例的键
  name: string; // X轴类别
  value: number; // 取值
}
// 特殊柱状图
export const getPictorialBarSeriesOptions = (keyListConfig: IMetricKeyListConfig[]): any => {
  const maxValue = Math.max(...keyListConfig.map(item => item.value));
  const coefficient = maxValue * 0.05; // 将值取值系数 形成错落
  return [
    // 底部方片
    {
      name: '',
      type: 'pictorialBar',
      symbol: 'diamond', //底部组件形状，不写默认为椭圆
      symbolOffset: [0, -4],
      symbolSize: [12, 4], //底面[宽，高]
      z: 12,
      symbolPosition: 'end',
      tooltip: {
        show: false,
      },
      data: keyListConfig.map(item => ({
        value: item.value === 0 ? null : 0,
        itemStyle: {
          color: colorStyle.foot,
        },
      })),
    },
    // 顶部方片
    {
      name: '',
      type: 'pictorialBar',
      symbol: 'diamond', //底部组件形状，不写默认为椭圆
      symbolOffset: [0, -2],
      symbolSize: [12, 4], //底面[宽，高]
      z: 12,
      symbolPosition: 'end',
      tooltip: {
        show: false,
      },
      data: keyListConfig.map(item => ({
        value: item.value === 0 ? null : Math.max(0, item.value - coefficient),
        itemStyle: {
          color: colorStyle.head,
        },
      })),
    },
    // 数据柱子
    {
      z: 13,
      type: 'bar',
      showBackground: false,
      data: keyListConfig.map(item => ({
        value: Math.max(0, item.value - coefficient),
        itemStyle: {
          color: highlightColor,
        },
      })),
    },
    // 数据颜色柱子
    {
      z: 2,
      barGap: '-100%',
      type: 'bar',
      showBackground: false,
      data: keyListConfig.map(item => ({
        value: Math.max(0, item.value - coefficient),
        itemStyle: {
          color: colorStyle.bar,
        },
      })),
    },
    // 折线图
    {
      data: keyListConfig.map(item => item.value),
      type: 'line',
      smooth: true,
      z: 15,
      lineStyle: {
        color: 'rgba(255, 123, 0, 1)',
      },
      itemStyle: {
        color: 'rgba(255, 123, 0, 1)',
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
      },
    },
  ];
};
// 总览
export const chartOptions: EChartsOption = {
  tooltip: {
    show: false,
    enterable: false,
  },
  grid: {
    left: 0,
    right: 8,
    top: 24,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E6E6E6',
        width: 1,
      },
    },
    axisLabel: {
      show: true,
      width: 24,
      lineHeight: 16,
      interval: 0,
      margin: 8, //刻度标签与轴线之间的距离。
      overflow: 'break',
      color: 'rgba(26,26,26,0.6)',
    },
  },
  yAxis: {
    show: true,
    nameGap: 12,
    // min: 0,
    nameTextStyle: {
      align: 'right',
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'dashed',
      },
    },
    axisLabel: {
      show: false,
    },
  },
  series: [],
  barWidth: 12,
  barGap: '100%',
};
