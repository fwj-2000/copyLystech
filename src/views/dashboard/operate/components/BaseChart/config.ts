import { EChartsOption } from 'echarts';
import XEUtils from 'xe-utils';

// BU1开机率 图例图标
export const iconBase64 =
  'image://data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgMjAgNiIgZmlsbD0ibm9uZSI+CiAgPGxpbmUgeTE9IjMiIHgyPSIyMCIgeTI9IjMiIHN0cm9rZT0iI0ZGN0IwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTTEzIDMuMDAwMUMxMyAzLjUzMDUyIDEyLjc4OTIgNC4wMzkyMSAxMi40MTQyIDQuNDE0MjdDMTIuMDM5MSA0Ljc4OTMyIDExLjUzMDQgNS4wMDAwMSAxMSA1QzEwLjQ2OTUgNC45OTk5OSA5Ljk2MDgzIDQuNzg5MjcgOS41ODU3NyA0LjQxNDJDOS4yMTA3MSA0LjAzOTEyIDkgMy41MzA0MiA5IDNDOSAyLjQ2OTU4IDkuMjEwNzEgMS45NjA4OCA5LjU4NTc3IDEuNTg1OEM5Ljk2MDgzIDEuMjEwNzMgMTAuNDY5NSAxLjAwMDAxIDExIDFDMTEuNTMwNCAwLjk5OTk4NyAxMi4wMzkxIDEuMjEwNjggMTIuNDE0MiAxLjU4NTczQzEyLjc4OTIgMS45NjA3OSAxMyAyLjQ2OTY4IDEzIDMuMDAwMVoiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNGRjdCMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=';

// 柱状图配置
export const barOptions: EChartsOption = {
  color: ['#4b7bec', '#984cc7', '#efc56c', '#12b081', '#38a7d6', '#957ff6'],
  legend: [],
  tooltip: {
    show: true,
    trigger: 'axis',
    appendTo: 'body',
  },
  grid: {
    left: '12',
    right: '12',
    bottom: '24',
    top: '54',
    containLabel: true,
  },
  xAxis: [
    {
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
  ],
  series: [],
  // dataZoom: [
  //   {
  //     type: 'inside',
  //     start: 0,
  //     end: 100
  //   }
  // ],
  barWidth: 12,
  barGap: '100%',
  dataZoom: [
    {
      type: 'slider', // 表示滑动条类型的dataZoom
      show: true, // 显示滚动条
      zoomOnMouseWheel: true, // 开启鼠标滚轮缩放
      moveOnMouseMove: true, // 开启鼠标滑动
      bottom: 15,
      height: 10,
    },
  ],
};

export const commonYAxis = {
  type: 'value', // x轴设为数值轴，用于显示百分比
  nameGap: 35,
  nameTextStyle: {
    align: 'right',
  },
  splitLine: {
    // 移除x轴的分割线
    show: true,
  },
  axisLabel: {
    show: true,
  },
};

// 通用线条样式
export const commonSeriesLineDataSyle = {
  type: 'line',
  smooth: true,
  selected: false,
  lineStyle: {
    color: '#FF7B00',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowBlur: 4,
    shadowOffsetY: 4,
  }, // 添加阴影区域
  data: [],
  label: {
    show: true,
    formatter: '{c}%',
  },
  symbolSize: 8,
  itemStyle: {
    color: '#FF6347', // 数据点的颜色
  },
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
};

/**
 * @description Tooltip自定义配置
 * @param param 配置项
 * @param suffix 单位 默认'%'
 * @param showHead 是否展示头部，默认展示
 */
export const getCommonTooltipHtmlStr = ({ params, suffix = '%', showHead = true }) => {
  // 防止 params 为空（比如鼠标移出图表区域）
  if (!params || !params.length) return '';

  // 过滤掉值为 null 的项，这样 Tooltip 只显示有数据的组，不会出现一堆 "组名: 0%"
  const validParams = params.filter(cur => cur.value !== null && cur.value !== undefined);

  // 如果当前月份没有任何一组有数据，则不显示 tooltip
  if (validParams.length === 0) return '';

  const firstItem = validParams[0];
  // 头部显示的数值：如果有多个组，通常显示第一组的值，或者你可以根据业务修改
  const headValue = firstItem.value ?? '0';

  return `
  <div class="normal-tooltips">
    <div class="head-container flex ct-between mb-4px">
      <p>${firstItem.axisValue}</p>
      ${showHead ? `<p style="font-size: 16px;" class="ml-12px">${headValue}${suffix}</p>` : ''}
    </div>
    <div class="content-container flex column all-start">
      ${validParams.reduce((pre, cur) => {
        return `${pre}${getCommonItemHtmlStr({ item: cur, suffix })}`;
      }, '')}
    </div>
  </div>
  `;
};
const getCommonItemHtmlStr = ({ item, suffix }) => {
  // 1. 基础防护：item 不存在、没有 seriesName 或 value 是 null，直接不返回 HTML
  if (!item || !item.seriesName || item.value === null || item.value === undefined) return '';

  // 2. 安全读取 suffix（防止 item.data 为空）
  const itemData = item.data || {};
  const suffixStr = itemData.suffix || suffix || '';

  const { value, seriesName } = item;

  // 3. 转换数字，防止 value 是非数字字符串导致 commafy 报错
  const numValue = Number.parseFloat(value);
  const displayValue = Number.isNaN(numValue) ? '0' : numValue;

  return `
    <div class="item flex ct-between" style="width: 100%">
      <p>${seriesName}</p>
      ${
        suffixStr.includes('元') || suffixStr.includes('万')
          ? `<p class="ml-8px">${XEUtils.commafy(displayValue, { digits: 1 })}${suffixStr}</p>`
          : `<p class="ml-8px">${displayValue}${suffixStr}</p>`
      }
    </div>
  `;
};
