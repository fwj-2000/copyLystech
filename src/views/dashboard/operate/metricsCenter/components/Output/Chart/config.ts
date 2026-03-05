import { PopoverInfoList } from '/@/views/dashboard/operate/types';
import type { EChartsOption } from "echarts";

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
  foot: {
    type: "linear",
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [{
      offset: 0,
      color: 'rgba(0, 21, 69, 0)',
    },
    {
      offset: 1,
      color: 'rgba(0, 61, 208, 0.13)',
    }],
  },
  head: '#6b91ea',
  bar: {
    type: "linear",
    x: 0,
    x2: 0,
    y: 0,
    y2: 1,
    colorStops: [{
      offset: 1,
      color: 'rgba(104, 140, 226, 0.05)',
    },
    {
      offset: 0,
      color: 'rgba(64, 109, 214, 1)',
    }],
  },
}
export const colorStyle2 = {
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
// 基本的配置项
export const chartOptions = {
  tooltip: {
    trigger: 'item',
    confine: true,
    show: false,
    appendToBody: true,
  },
  grid: {
    left: 0,
    right: 16,
    top: 24,
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
    nameGap: 12,
    min: 0,
    nameTextStyle: {
      align: 'right',
    },
    splitLine: {
      show: false,
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
      show: false,
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

// 基本的配置项
export const baseOptions: EChartsOption = {
  tooltip: {
    trigger: 'item',
    confine: true,
    show: false,
    appendToBody: true,
  },
  grid: {
    left: 0,
    right: 0,
    top: 24,
    bottom: 16,
    containLabel: true,
  },
  xAxis: {
    data: ['人均产值', 'DL人均产值'],
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
    nameGap: 12,
    min: 0,
    splitLine: {
      show: true,
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
      show: false,
    }
  },
  series: [
    {
      name: 'hill',
      type: 'pictorialBar',
      barCategoryGap: '0%',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(90, 188, 254, 1)',
          },
          {
            offset: 1,
            color: 'rgba(181, 225, 255, 0.15)',
          }],
        }
      },
      label: {
        show: true,
        position: 'top',
      },
      data: [759, 1298],
    },
  ]
};
// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '产值',
    content: ['Σ(产品入库数*产品单价)'],
  },
  {
    title: '人均产值',
    content: ['总产值/总在职人数'],
  },
  {
    title: 'DL人均产值',
    content: ['总产值/DL在职人数'],
  },
];
