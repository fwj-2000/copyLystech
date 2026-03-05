import * as echarts from 'echarts';

// tooltip html字符串
const getTooltipHtmlStr = params => {
  return `
  <div class="uptime-center-tooltips">
      <div class="content-container">
        <div class="head-container flex ct-between mb-4px">
          <p>${params.name}</p>
          <p style="font-size: 16px;">
            总在职人数：${params.data.value + params.data.qq}
          </p>
        </div>
        <div class="item-container flex ct-between">
          <div class="item flex ct-between style1">
            <p>出勤人数：</p>
            <p>${params.data.value}</p>
          </div>
          <div class="item flex ct-between style1">
            <p>缺勤人数：</p>
            <p>${params.data.qq}</p>
          </div>
        </div>
      </div>
  </div>
  `;
};
// 3D 饼图-劳动类型 tooltip
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
export const baseOptions = {
  tooltip: {
    trigger: 'item',
    confine: false,
    appendToBody: true,
    formatter: getTooltipHtmlStr,
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 18,
    containLabel: false,
  },
  xAxis: {
    data: ['DL'],
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      margin: 8, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
    nameTextStyle: {
      align: 'right',
    },
    // max: 100,
    splitLine: {
      show: true,
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
      show: false,
    },
  },
  series: [
    // 最低下的圆片1
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: ['-100%', 1],
      z: 12,
      tooltip: {
        show: false,
      },
      itemStyle: {
        opacity: 1,
        color: '#6385d6',
      },
      data: [1],
    },
    // 最低下的圆片2
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: ['100%', 1],
      z: 12,
      tooltip: {
        show: false,
      },
      itemStyle: {
        opacity: 1,
        color: '#d4b162',
      },
      data: [1],
    },
    // 2层
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: ['-100%', -1],
      z: 12,
      symbolPosition: 'end',
      itemStyle: {
        color: '#3da4eb',
        opacity: 1,
      },
      tooltip: {
        show: false,
      },
      data: [20],
    },
    // 2层2
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: ['100%', -1],
      z: 12,
      symbolPosition: 'end',
      itemStyle: {
        color: '#9dcc39',
        opacity: 1,
      },
      tooltip: {
        show: false,
      },
      data: [20],
    },
    // 3层
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: ['-100%', -2],
      z: 12,
      itemStyle: {
        opacity: 1,
        color: function (params) {
          var a = params.name.slice(0, 2);
          if (a === 'DL') {
            return '#98d5ff';
          } else {
            return '#4ec0ac';
          }
        },
      },
      tooltip: {
        show: false,
      },
      symbolPosition: 'end',
      data: [40],
    },
    // 3层2
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: ['100%', -2],
      z: 12,
      itemStyle: {
        opacity: 1,
        color: '#92da91',
      },
      tooltip: {
        show: false,
      },
      symbolPosition: 'end',
      data: [40],
    },
    // DL1
    {
      type: 'bar',
      stack: 'one',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: 'DL2',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgb(75, 123, 236)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(75, 123, 236, 0.74)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
    // DL2
    {
      type: 'bar',
      stack: 'one',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: 'DL1',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgb(61, 167, 238)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(61, 167, 238, 0.74)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
    // 模切
    {
      type: 'bar',
      stack: 'two',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: '模切',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: '#EFC66D', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(242, 204, 121, 0.53)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
    // 模切2
    {
      type: 'bar',
      stack: 'two',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: '手工',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: '#42B947', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(157, 228, 155, 0.75)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
  ],
  barGap: '100%',
};

export const baseOptions2 = {
  tooltip: {
    trigger: 'item',
    confine: true,
    appendToBody: true,
    formatter: getTooltipHtmlStr,
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 18,
    containLabel: false,
  },
  xAxis: {
    data: ['IDL'],
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      margin: 8, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
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
  series: [
    {
      // 最低下的圆片
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: [0, 1],
      z: 12,
      tooltip: {
        show: false,
      },
      itemStyle: {
        opacity: 1,
        color: '#6385d6',
      },
      data: [1],
    },
    // 2层
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: [0, -1],
      z: 12,
      symbolPosition: 'end',
      itemStyle: {
        color: '#3da4eb',
        opacity: 1,
      },
      tooltip: {
        show: false,
      },
      data: [20],
    },
    // 3层
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: [0, -2],
      z: 12,
      itemStyle: {
        opacity: 1,
        color: '#4ec0ac',
      },
      tooltip: {
        show: false,
      },
      symbolPosition: 'end',
      data: [40],
    },
    // 4层
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: [0, -2],
      z: 12,
      itemStyle: {
        opacity: 1,
        color: '#9ef8e7',
      },
      tooltip: {
        show: false,
      },
      symbolPosition: 'end',
      data: [40],
    },
    // IDL1
    {
      type: 'bar',
      stack: 'one',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: 'IDL1',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgb(75, 123, 236)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(75, 123, 236, 0.74)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
    // IDL2
    {
      type: 'bar',
      stack: 'one',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: 'IDL2',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgb(61, 167, 238)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(61, 167, 238, 0.74)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
    // DL3
    {
      type: 'bar',
      stack: 'one',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: '1',
        borderRadius: 50,
      },
      data: [
        {
          value: 20,
          name: 'IDL3',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgb(78, 192, 172, 0.74)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(78, 192, 172, 0.74)', // 100% 处的颜色
                },
              ],
              false,
            ),
          },
        },
      ],
    },
  ],
  barGap: '100%',
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
    followPointer: false,
    headerFormat: '',
    pointFormat: getPieTooltipHtmlStr(),
    // pointFormat: '{point.percentage:.2f}%',
    footerFormat: '',
    useHTML: true,
    hideDelay: 200,
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      depth: 20,
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
              [0, '#009CE5'], // start
              [1, '#00D8D1 '], // end
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
              [0, '#00D6D0'], // start
              [1, '#00AAE2 '], // end
            ],
          },
        },
      ],
    },
  ],
};
