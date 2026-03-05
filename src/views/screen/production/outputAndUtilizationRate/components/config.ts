import * as echarts from 'echarts';

// 产出图表配置
export const outputChartConfig: echarts.EChartsOption = {
  tooltip: {
    show: true,
    trigger: 'axis',
  },
  legend: {
    show: true,
    left: 0,
    itemGap: 16,
    itemWidth: 10,
    itemHeight: 10,
    data: [
      {
        name: '实际产出',
        itemStyle: {
          color: '#0182ee',
        },
      },
      {
        name: '计划产出',
      },
    ],
    textStyle: {
      color: '#fff',
      fontSize: 14,
    },
  },
  grid: {
    left: 30,
    right: 0,
    top: 64,
    bottom: 20,
  },
  xAxis: {
    type: 'category',
    splitLine: {
      lineStyle: {
        opacity: 0.5, // 设置 x 轴线的透明度，可根据需求调整该值
      },
    },
    axisLabel: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        opacity: 0.2,
      },
    },
    axisLabel: {
      color: '#fff',
    },
  },
  series: [
    {
      type: 'line',
      name: '计划产出',
      smooth: true,
      symbol: 'circle',
      symbolSize: 12,
      label: {
        show: true,
        color: '#fff',
        fontSize: 14,
      },
      lineStyle: {
        width: 5,
        color: '#01C4D2',
      },
      itemStyle: {
        color: '#fff',
        borderWidth: 4,
        borderColor: '#01C4D2',
      },
    },
    {
      type: 'bar',
      name: '实际产出',
      barWidth: 21, // 设置柱状图的宽度
      label: {
        show: true,
        color: '#fff',
        fontSize: 14,
        position: 'top',
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(1, 130, 238, 1)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(1, 130, 238, 0)', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        }, // 设置柱状图的颜色
      },
    },
  ],
};
// 稼动率图表配置
export const rateChartConfig: echarts.EChartsOption = {
  legend: {
    show: true,
    left: 0,
    itemGap: 16,
    textStyle: {
      color: '#fff',
      fontSize: 14,
    },
  },
  grid: {
    left: 44,
    right: 0,
    top: 64,
    bottom: 20,
  },
  xAxis: {
    type: 'category',
    splitLine: {
      lineStyle: {
        opacity: 0.5, // 设置 x 轴线的透明度，可根据需求调整该值
      },
    },
    axisLabel: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        opacity: 0.2,
      },
    },
    axisLabel: {
      color: '#fff',
      formatter: '{value}%',
    },
  },
  series: [
    {
      type: 'line',
      name: '稼动率',
      smooth: true,
      symbol: 'circle',
      symbolSize: 12,
      label: {
        show: true,
        color: '#fff',
        fontSize: 14,
        formatter: '{c}%',
      },
      lineStyle: {
        width: 5,
        color: '#C59E00',
      },
      itemStyle: {
        color: '#fff',
        borderWidth: 4,
        borderColor: '#C59E00',
      },
    },
    {
      type: 'line',
      name: '良率',
      smooth: true,
      symbol: 'circle',
      symbolSize: 12,
      label: {
        show: true,
        color: '#fff',
        fontSize: 14,
        formatter: '{c}%',
      },
      lineStyle: {
        width: 5,
        color: '#01C4D2',
      },
      itemStyle: {
        color: '#fff',
        borderWidth: 4,
        borderColor: '#01C4D2',
      },
    },
  ],
};
