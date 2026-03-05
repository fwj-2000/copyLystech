import type { EChartsOption } from "echarts";

// 左边图表的渐变颜色配置
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
// 基本的配置项
export const baseNumOptions: EChartsOption = {
  tooltip: {
    trigger: 'item',
    confine: true,
    show: false,
    appendToBody: true,
  },
  grid: {
    left: 16,
    right: 16,
    top: 36,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    data: ['包装', '手工', '横切'],
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
    name: '在制',
    nameGap: 12,
    min: 0,
    nameTextStyle: {
      align: 'right',
      padding: [0, 12, 0, 0],
    },
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
      show: true,
      formatter: '{value}'
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
            color: 'rgba(75, 123, 236, 1)',
          },
          {
            offset: 1,
            color: 'rgba(189, 206, 245, 0.12)',
          }],
        }
      },
      label: {
        show: true,
        position: 'top',
      },
      data: [273, 759, 1298],
    },
  ]
};

// 饼图
export const basePieOptions = {
  credits: {
    enabled: false // 设置为false以禁用版权信息
  },
  accessibility: {
    enabled: false,
  },
  legend: { // 图例配置
    enabled: false,
  },
  chart: {
    type: 'pie',
    options3d: {
      enabled: true,
      beta: 0,
      alpha: 65,
    },
    spacing: [0, 0, 24, 0], // 上、右、下、左边距
  },
  title: {
    text: ''
  },
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      innerSize: "75%",
      dataLabels: {
        enabled: false,
      }
    }
  },
  series: [{
    color: '#a3b9f5',
    startAngle: 20,
    endAngle: 200,
    depth: 40,
    data: [
      {
        name: '结单率',
        y: 8,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(243, 249, 250, 0.6)'], // start
            [1, 'rgba(239, 243, 244, 1) '] // end
          ]
        }
      },
    ]
  }, {
    startAngle: 200,
    endAngle: 380,
    depth: 80,
    zIndex: 100,
    data: [
      {
        name: '结单率',
        y: 8,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(75, 120, 236, 0.1)'], // start
            [1, 'rgba(131, 156, 243, 1) '] // end
          ]
        }
      },
    ]
  }]
};
