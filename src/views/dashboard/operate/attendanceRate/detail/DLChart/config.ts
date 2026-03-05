import { EChartsOption } from 'echarts';

// BU1开机率 图例图标
const iconBase64 =
  'image://data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgMjAgNiIgZmlsbD0ibm9uZSI+CiAgPGxpbmUgeTE9IjMiIHgyPSIyMCIgeTI9IjMiIHN0cm9rZT0iI0ZGN0IwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTTEzIDMuMDAwMUMxMyAzLjUzMDUyIDEyLjc4OTIgNC4wMzkyMSAxMi40MTQyIDQuNDE0MjdDMTIuMDM5MSA0Ljc4OTMyIDExLjUzMDQgNS4wMDAwMSAxMSA1QzEwLjQ2OTUgNC45OTk5OSA5Ljk2MDgzIDQuNzg5MjcgOS41ODU3NyA0LjQxNDJDOS4yMTA3MSA0LjAzOTEyIDkgMy41MzA0MiA5IDNDOSAyLjQ2OTU4IDkuMjEwNzEgMS45NjA4OCA5LjU4NTc3IDEuNTg1OEM5Ljk2MDgzIDEuMjEwNzMgMTAuNDY5NSAxLjAwMDAxIDExIDFDMTEuNTMwNCAwLjk5OTk4NyAxMi4wMzkxIDEuMjEwNjggMTIuNDE0MiAxLjU4NTczQzEyLjc4OTIgMS45NjA3OSAxMyAyLjQ2OTY4IDEzIDMuMDAwMVoiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNGRjdCMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=';

// tooltip html字符串
const getTooltipHtmlStr = params => {
  let start = 0;
  return `
  <div class="dlchart-tooltips">
    <div class="header-container flex ct-between mb-12px">
      <p>${params[0].axisValue}</p>
      <p style="font-size: 16px;">总出勤率：${params[0].value}%</p>
    </div>
    <div class="content-container flex column ct-between wrap">
      ${params[0].dimensionNames.reduce((pre, cur) => {
        const str = `${pre}${getItemHtmlStr(cur, start, params)}`;
        start += 3;
        return str;
      }, '')}
    </div>
  </div>
  `;
};

const getItemHtmlStr = (title, idx, params) => {
  if (!params[idx + 1]) return '';
  return `
    <div style="width: 100%">
      <div class="head-container flex ct-between">
        <div>${title}</div>
      </div>
      <div class="item-container">
        <div class="flex ct-between">
          <div class="item flex ct-between style1">
            <p>DL1出勤人数：</p>
            <p>${params[idx + 1].data.cq}</p>
          </div>
          <div class="item flex ct-between style1">
            <p>DL1缺勤人数：</p>
            <p>${params[idx + 1].data.qq}</p>
          </div>
        </div>
        <div class="flex ct-between">
          <div class="item flex ct-between style1">
            <p>DL2出勤人数：</p>
            <p>${params[idx + 2].data.cq}</p>
          </div>
          <div class="item flex ct-between style1">
            <p>DL2缺勤人数：</p>
            <p>${params[idx + 2].data.qq}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};
// 柱状图配置
export const barOptions: EChartsOption = {
  color: ['#4272e3', '#4bb7ff', '#00cfd3'],
  legend: [
    {
      show: true,
      orient: 'horizontal',
      data: [
        {
          name: '出勤率',
          icon: iconBase64,
        },
      ],
      left: '0',
      top: '0',
      itemWidth: 20,
      itemHeight: 4,
      borderRadius: 0,
    },
    {
      show: true,
      selectedMode: false,
      orient: 'horizontal',
      data: ['DL1', 'DL2'],
      left: '78',
      top: '0',
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: 0,
    },
    {
      show: true,
      orient: 'horizontal',
      selectedMode: false,
      data: ['缺勤'],
      left: '168',
      top: '-2',
      itemWidth: 8,
      itemHeight: 8,
      itemStyle: {
        borderWidth: 1,
        borderColor: '#4272e3',
      },
    },
  ],
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter: getTooltipHtmlStr,
    appendTo: 'body',
  },
  grid: {
    left: '12',
    right: '12',
    bottom: '24',
    top: '54',
    containLabel: true,
  },
  yAxis: [
    {
      type: 'value', // x轴设为数值轴，用于显示百分比
      min: 0,
      max: 100, // 设定最大值为100%，根据需要调整
      splitLine: {
        // 移除x轴的分割线
        show: true,
      },
      axisLabel: {
        show: true,
      },
    },
  ],
  xAxis: {
    type: 'category', // y轴设为分类轴，用于显示分类项
    data: [], // 分类项数据
    axisTick: {
      show: false,
    },
    axisLine: {
      // 移除x轴的分割线
      show: false,
    },
  },
  series: [
    {
      name: '出勤率',
      type: 'line',
      dimensions: [],
      smooth: true,
      lineStyle: {
        color: '#FF7B00',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowBlur: 4,
        shadowOffsetY: 4,
      }, // 添加阴影区域
      data: [],
      label: {
        show: true, // 显示标签
        formatter: '{c}%',
      },
      symbolSize: 8,
      itemStyle: {
        color: '#FF6347', // 数据点的颜色
      },
    },
    // {
    //   type: 'bar',
    //   name: 'DL1',
    //   stack: 'one',
    //   data: [64, 24, 10, 28, 64, 24, 10],
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //   },
    //   showBackground: true,
    //   backgroundStyle: {
    //     color: 'none',
    //     borderWidth: 1,
    //     borderRadius: [50, 50, 0, 0],
    //     borderColor: '#4272e3',
    //   },
    //   itemStyle: {
    //     color: '#4272e3',
    //   },
    // },
    // {
    //   type: 'bar',
    //   name: 'DL2',
    //   stack: 'one',
    //   data: [12, 10, 10, 10, 10, 10, 10],
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //   },
    //   itemStyle: {
    //     color: '#4bb7ff',
    //   },
    // },
    // {
    //   type: 'bar',
    //   name: '缺勤',
    //   stack: 'one',
    //   data: [36, 76, 90, 72, 36, 76, 90],
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //   },
    //   itemStyle: {
    //     color: 'none',
    //     borderWidth: 1,
    //     borderColor: 'rgba(0,0,0,0.0)',
    //   },
    // },
    // {
    //   type: 'bar',
    //   name: 'DL1',
    //   stack: 'two',
    //   data: [26, 2, 66, 4, 26, 2, 66],
    //   showBackground: true,
    //   backgroundStyle: {
    //     color: 'none',
    //     borderWidth: 1,
    //     borderRadius: [50, 50, 0, 0],
    //     borderColor: '#4bb7ff',
    //   },
    //   itemStyle: {
    //     color: '#4272e3',
    //   },
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //   },
    // },
    // {
    //   type: 'bar',
    //   name: 'DL2',
    //   stack: 'two',
    //   data: [12, 10, 10, 10, 10, 10, 10],
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //   },
    //   showBackground: false,
    //   itemStyle: {
    //     color: '#4bb7ff',
    //   },
    // },
    // {
    //   type: 'bar',
    //   name: '缺勤',
    //   stack: 'two',
    //   data: [74, 98, 34, 96, 74, 98, 34],
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //   },
    //   itemStyle: {
    //     color: 'none',
    //     borderWidth: 1,
    //     borderColor: 'rgba(0,0,0,0.0)',
    //   },
    // },
  ],
  // dataZoom: [
  //   {
  //     type: 'inside',
  //     start: 0,
  //     end: 100
  //   }
  // ],
  barWidth: 6,
  barGap: '100%',
};
