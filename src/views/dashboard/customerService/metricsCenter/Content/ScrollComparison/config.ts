import echarts from 'echarts';

// 柱状图配置
export const barChartOptions: echarts.EChartsOption = {
  tooltip: {
    show: true,
    appendTo: 'body',
  },
  grid: {
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    data: [],
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    show: false,
    name: '',
    nameGap: 12,
    min: 0,
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
};

// 背景样式绘制
export const staticBaseBgOptions: echarts.EChartsOption = {
  grid: {
    left: 0,
    right: 0,
    top: 8,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    data: ['WK23', 'WK24', 'WK25', 'WK26'],
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      fontSize: 12,
      color: 'rgba(0,0,0,0.4)',
      margin: 8, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
    min: 0,
    max: 100,
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'dashed',
      },
    },
    axisLabel: {
      show: true,
      fontSize: 12,
      color: 'rgba(0,0,0,0.4)',
      margin: 12, //刻度标签与轴线之间的距离。
    },
  },
  series: [
    {
      type: 'bar',
      barWidth: 14,
      data: [0, 0, 0, 0],
      itemStyle: {
        color: 'transparent',
      },
    },
  ],
};

// 饼图配置
export const basePieOptions = {
  credits: {
    enabled: false, // 设置为false以禁用版权信息
  },
  accessibility: {
    enabled: false,
  },
  legend: {
    // 图例配置
    enabled: false,
  },
  chart: {
    type: 'pie3d',
    margin: [0, 0, 0, 0], // 顶部边距设为0
    // sapcing: [0, 0, 0, 0], // 顶部边距设为0
    options3d: {
      enabled: true,
      alpha: 60,
      beta: 0,
    },
  },
  title: {
    text: '',
  },
  tooltip: {
    enabled: true,
    outside: true,
    followPointer: false,
    headerFormat: '',
    // pointFormat: getPieTooltipHtmlStr(),
    // pointFormat: '{point.percentage:.2f}%',
    pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%',
    footerFormat: '',
    useHTML: true,
    hideDelay: 200,
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      depth: 15,
      dataLabels: {
        enabled: false,
        softConnector: true,
        distance: 1,
        allowOverlap: true,
        connectorPadding: 0,
        format: '{point.name}: {point.y}',
      },
    },
  },
  series: [
    {
      type: 'pie',
      startAngle: 30,
      data: [],
    },
  ],
};
