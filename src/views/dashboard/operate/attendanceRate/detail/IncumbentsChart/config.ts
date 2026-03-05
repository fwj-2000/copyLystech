import { EChartsOption } from 'echarts';
// tooltip html字符串
const getTooltipHtmlStr = params => {
  let start = 0;
  return `
  <div class="dlchart-tooltips">
    <div class="header-container flex ct-between mb-12px">
      <p>${params[0].axisValue}</p>
    </div>
    <div class="content-container flex column ct-between wrap">
      ${params[0].dimensionNames.reduce((pre, cur) => {
        const str = `${pre}${getItemHtmlStr(cur, start, params)}`;
        start += 6;
        return str;
      }, '')}
    </div>
  </div>
  `;
};

const getItemHtmlStr = (title, idx, params) => {
  if (!params[idx]) return '';
  return `
    <div style="width: 100%">
      <div class="head-container flex ct-between">
        <div>${title}</div>
      </div>
      <div class="item-container">
        <div class="flex ct-between">
          <div class="item flex ct-between style1">
            <p>正式工出勤人数：</p>
            <p>${params[idx].data.cq}</p>
          </div>
          <div class="item flex ct-between style1">
            <p>正式工缺勤人数：</p>
            <p>${params[idx].data.qq}</p>
          </div>
        </div>
        <div class="flex ct-between">
          <div class="item flex ct-between style1">
            <p>派遣工出勤人数：</p>
            <p>${params[idx + 2].data.cq}</p>
          </div>
          <div class="item flex ct-between style1">
            <p>派遣工缺勤人数：</p>
            <p>${params[idx + 2].data.qq}</p>
          </div>
        </div>
        <div class="flex ct-between">
          <div class="item flex ct-between style1">
            <p>临时工出勤人数：</p>
            <p>${params[idx + 4].data.cq}</p>
          </div>
          <div class="item flex ct-between style1">
            <p>临时工缺勤人数：</p>
            <p>${params[idx + 4].data.qq}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};
// 柱状图配置
export const barOptions: EChartsOption = {
  color: ['#3e7bf9', '#fe7b00', '#78c876'],
  legend: [
    {
      show: true,
      selectedMode: false,
      orient: 'horizontal',
      data: ['正式工', '派遣工', '临时工', '缺勤'],
      left: '0',
      top: '0',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#DBDBDB',
      },
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: 0,
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
  // dataZoom: [
  //   {
  //     type: 'inside',
  //     start: 0,
  //     end: 100
  //   }
  // ],
  series: [],
  barWidth: 6,
  barGap: '100%',
};
