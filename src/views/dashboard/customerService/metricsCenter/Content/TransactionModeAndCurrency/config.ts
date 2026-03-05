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
