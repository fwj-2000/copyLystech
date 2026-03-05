import { PopoverInfoList } from '/@/views/dashboard/operate/types';

export const highlightColor = {
  type: "linear",
  x: 0,
  x2: 1,
  y: 0,
  y2: 0,
  colorStops: [{
    offset: 0,
    color: 'rgba(61, 156, 221, 0)',
  }, {
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
  }],
};
export const colorStyle = {
  normal: {
    foot: {
      type: "linear",
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: 'rgba(220, 241, 255, 0.4)',
      },
      {
        offset: 1,
        color: 'rgba(61, 156, 221, 0.4)',
      }],
    },
    head: 'rgba(94, 190, 255, 1)',
    bar: {
      type: "linear",
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [{
        offset: 1,
        color: 'rgba(220, 241, 255, 0.69)',
      },
      {
        offset: 0,
        color: 'rgba(61, 156, 221, 1)',
      }],
    },
  },
  high: {
    foot: {
      type: "linear",
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: 'rgba(157, 228, 155, 0.15)',
      },
      {
        offset: 1,
        color: 'rgba(157, 228, 155, 0.75)',
      }],
    },
    head: '#94E197',
    bar: {
      type: "linear",
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [{
        offset: 1,
        color: 'rgba(157, 228, 155, 0.05)',
      },
      {
        offset: 0,
        color: 'rgba(66, 185, 71, 0.75)',
      }],
    },
  }
}
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
    left: 16,
    right: 54,
    top: 18,
    bottom: 16,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      margin: 8, //刻度标签与轴线之间的距离。
    }
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
    min: 0,
    nameTextStyle: {
      align: 'right',
    },
    splitLine: {
      show: true,
      offset: 4,
      lineStyle: {
        width: 1,
        type: 'dashed'
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      formatter: '{value}%'
    }
  },
  series: [
    // 底部方片
    {
      name: '',
      type: 'pictorialBar',
      symbol: "diamond",//底部组件形状，不写默认为椭圆
      symbolOffset: [0, -4],
      symbolSize: [16, 8],//底面[宽，高]
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
      symbol: "diamond",//底部组件形状，不写默认为椭圆
      symbolOffset: [0, -3.5],
      symbolSize: [16, 6],//底面[宽，高]
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
        formatter: '{c}%',
      },
      data: []
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
    title: '模切良率',
    content: ['材料损耗报表中用料米数换算标准产量，模切报数/标准产量*100%'],
  },
  {
    title: '通用AOI',
    content: ['AOI检良品数/总过检数*100%'],
  },
  {
    title: '手工良率',
    content: ['手工报数，良品数/(良品数+不良品数)*100%'],
  },
  {
    title: '结单良率',
    content: ['昨日SAP入库数据，入库数/工单数*100%'],
  },
];
