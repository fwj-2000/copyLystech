// 3D 饼图-tooltip
const getPieTooltipHtmlStr = () => {
  return `
  <div class="uptime-center-tooltips">
    <div class="content-container">
      <div class="head-container flex ct-between mb-4px">
        <p>{point.name}</p>
      </div>
      <div class="item-container flex ct-between">
        <div class="item flex ct-between style1">
          <p>在职人数：</p>
          <p>{point.y}</p>
        </div>
        <div class="item flex ct-between style1">
          <p>在职占比：</p>
          <p>{point.percentage:.2f}%</p>
        </div>
      </div>
    </div>
  </div>
  `;
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
    margin: [12, 0, 0, 0], // 顶部边距设为0
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
    followPointer: true,
    headerFormat: '',
    pointFormat: getPieTooltipHtmlStr(),
    footerFormat: '',
    useHTML: true,
    distance: 24,
    hideDelay: 200,
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      depth: 25,
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
      data: [
        {
          y: 8,
          name: '派遣工',
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#00D6D0'], // start
              [1, '#00AAE2 '], // end
            ],
          },
        },
        {
          y: 7,
          name: '临时工',
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#EDC265'], // start
              [1, '#F3CE7D '], // end
            ],
          },
        },
        {
          y: 34,
          name: '正式工',
          color: {
            linearGradient: { x1: 24, x2: 53, y1: 6, y2: 50 },
            stops: [
              [0, '#009CE5'], // start
              [1, '#00D8D1 '], // end
            ],
          },
        },
      ],
    },
  ],
};
