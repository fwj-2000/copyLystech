import { EChartsOption } from 'echarts';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// tooltip html字符串
export const getTooltipHtmlStr = params => {
  let start = 0;
  return `
  <div class="uptime-trend-tooltips">
    <div class="head-container flex ct-between mb-4px">
      <p>${params[0].axisValue}</p>
      <p style="font-size: 16px;">${params[0].value || 0}%</p>
    </div>
    <div class="content-container flex row ct-between">
    ${params[0].dimensionNames.reduce((pre, cur) => {
      let res = pre;
      if (cur) {
        res = `${pre}${getItemHtmlStr(cur, start, params)}`;
        start = start + 2;
      }
      return res;
    }, '')}
    </div>
  </div>
  `;
};
const getItemHtmlStr = (title, idx, params) => {
  if (!params[idx + 1]) return '';
  return `
  <div class="item-container mb-6px">
    <div>${title}</div>
    <div class="item flex ct-between style1">
      <p>开机率</p>
      <p>${params[idx + 1].value || 0}%</p>
    </div>
    <div class="item flex ct-between style1">
      <p>空闲率</p>
      <p>${params[idx + 2].value || 0}%</p>
    </div>
  </div>
  `;
};

// 通用样式
export const commonSeriesDataSyle = {
  normal: {
    type: 'bar',
    showBackground: true,
    backgroundStyle: {
      color: 'none',
      borderWidth: 1,
      borderRadius: [50, 50, 0, 0],
      borderColor: '#DBDBDB',
    },
    itemStyle: {
      borderRadius: [50, 50, 0, 0],
    },
  },
  empty: {
    type: 'bar',
    name: t('views.dashboard.operate.uptimeDetail.idleMachines'),
    itemStyle: {
      color: 'none',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.0)',
    },
  },
};

export const cirqueChartOption: EChartsOption = {
  color: ['#4B7BEC', '#5EBEFF', '#72DDCA'],
  title: {
    left: 8,
    top: 8,
    textStyle: {
      fontSize: 11,
    },
  },
  tooltip: {
    show: false,
  },
  legend: {
    top: 'center',
    left: '40%',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      rich: {
        boldRed: {
          width: 30,
          height: 100,
          fontSize: 11,
          padding: 2,
        },
        boldRed2: {
          width: 40,
          fontSize: 11,
          padding: 2,
        },
        boldRed3: {
          fontSize: 11,
          padding: 2,
        },
      },
    },
    formatter: function (name) {
      return name;
      // console.log('name, value: ', name);
      // // 使用 ECharts 富文本样式规则
      // return `{boldRed|${name}}{boldRed2| }{boldRed3| 44 50%}`;
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['55%', '70%'],
      left: '5%',
      right: '60%',
      top: 24,
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
