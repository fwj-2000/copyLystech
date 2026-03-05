import { EChartsOption } from 'echarts';

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
// 方形柱子图表的渐变颜色配置
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
}
// 总览
export const chartOptions: EChartsOption = {
  tooltip: {
    trigger: 'item',
    confine: true,
    show: false,
    appendToBody: true,
    // formatter: getTooltipHtmlStr,
  },
  grid: {
    left: 0,
    right: 0,
    top: 24,
    bottom: 16,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        width: 1,
        opacity: 0.3,
      }
    },
    axisLabel: {
      show: true,
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
      show: false,
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
      symbolOffset: [0, -8],
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

// 空闲排产
export const chartOptions2: EChartsOption = {
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
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        width: 1,
        opacity: 0.3,
      }
    },
    axisLabel: {
      show: true,
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
      show: false,
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
    // 底部柱子
    {
      z: 2,
      barGap: '100%',
      type: 'bar',
      stack: 'one',
      showBackground: false,
      data: [
        {
          value: 94,
          itemStyle: {
            color: 'transparent',
          },
          cursor: 'default', // 更改鼠标样式
        },
        {
          value: 94,
          label: {
            show: true,
            position: 'top',
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#67D06B',
            color: {
              type: 'linear',
              x: 0,
              x2: 0,
              y: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(234, 253, 234, 1)',
              },
              {
                offset: 1,
                color: 'rgba(111, 211, 115, 1)',
              }],
            },
          },
        },
      ],
    },
    // 顶部柱子
    {
      z: 2,
      barGap: '100%',
      type: 'bar',
      stack: 'one',
      showBackground: false,
      data: [
        {
          value: 94,
          label: {
            show: true,
            position: 'top',
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#EFC76F',
            color: {
              type: 'linear',
              x: 0,
              x2: 0,
              y: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(253, 242, 219, 1)',
              },
              {
                offset: 1,
                color: 'rgba(239, 199, 111, 1)',
              }],
            },
          },
        },
        {
          value: 94,
          cursor: 'default', // 更改鼠标样式
          itemStyle: {
            color: 'transparent',
          },
        },
      ],
    },
  ],
  barWidth: 8,
  barGap: '100%',
};