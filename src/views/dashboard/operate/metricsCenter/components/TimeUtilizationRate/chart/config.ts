import { PopoverInfoList } from '/@/views/dashboard/operate/types';

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
export const colorStyle2 = {
  foot: {
    type: 'linear',
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(255, 212, 120, 0.01)',
      },
      {
        offset: 1,
        color: 'rgba(255, 212, 120, 0.15)',
      },
    ],
  },
  head: 'rgba(255, 212, 120, 1)',
  bar: {
    type: 'linear',
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [
      {
        offset: 1,
        color: 'rgba(239, 199, 111, 0.05)',
      },
      {
        offset: 0,
        color: 'rgba(2255, 212, 120, 1)',
      },
    ],
  },
};
// 基本的配置项
export const chartOptions = {
  tooltip: {
    trigger: 'item',
    confine: true,
    show: false,
    appendToBody: true,
    // formatter: getTooltipHtmlStr,
  },
  grid: {
    left: 0,
    right: 8,
    top: 18,
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
      width: 30,
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
      offset: 4,
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
    },
  },
  series: [
    // 底部方片
    {
      name: '',
      type: 'pictorialBar',
      symbol: 'diamond', //底部组件形状，不写默认为椭圆
      symbolOffset: [0, -4],
      symbolSize: [16, 8], //底面[宽，高]
      z: 12,
      symbolPosition: 'end',
      tooltip: {
        show: false,
      },
    },
    // 顶部方片
    {
      name: '',
      type: 'pictorialBar',
      symbol: 'diamond', //底部组件形状，不写默认为椭圆
      symbolOffset: [0, -3.5],
      symbolSize: [16, 6], //底面[宽，高]
      z: 12,
      symbolPosition: 'end',
      tooltip: {
        show: false,
      },
    },
    // 数据柱子
    {
      z: 13,
      type: 'bar',
      showBackground: false,
      label: {
        show: true,
        position: 'top',
      },
      data: [],
    },
    // 数据颜色柱子
    {
      z: 2,
      barGap: '-100%',
      type: 'bar',
      showBackground: false,
    },
  ],
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
    value: '',
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
export const groupOptions = [
  {
    label: 'By厂区',
    value: '1',
  },
  {
    label: 'By组别',
    value: '2',
  },
];
// export const DEFAULT_IS_CONTAIN = '否';
// export const isContainOptions = [
//   {
//     label: '否',
//     value: '否',
//   },
//   {
//     label: '是',
//     value: '是',
//   },
// ];
