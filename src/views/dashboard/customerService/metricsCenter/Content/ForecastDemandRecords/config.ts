import echarts from 'echarts';
import { getSquareCylindersData } from '/@/views/dashboard/chartSeriesDataConfig';
import { merge } from 'lodash-es';

// 柱状图配置
export const barChartOptions: echarts.EChartsOption = {
  tooltip: {
    show: true,
    enterable: false,
  },
  legend: {
    show: true,
    selectedMode: false,
    left: 0,
    top: 0,
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },
  grid: {
    left: 0,
    right: 0,
    top: 36,
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
      show: true,
      interval: 0,
      fontSize: 12,
      color: 'rgba(0,0,0,0.6)',
      margin: 8, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    show: true,
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
      show: true,
    },
  },
  dataZoom: {
    type: 'inside',
    zoomLock: true,
  },
  barGap: '100%',
};

export const getBarChartOptions = ({
  barWidth = 14,
  dataList = [],
  legends = [],
  options = {},
}: {
  barWidth?: number;
  dataList: any[][];
  legends?: string[];
  options?: echarts.EChartsOption;
}): echarts.EChartsOption => {
  const seriesData = getSquareCylindersData({
    barWidth,
    dataList,
    barNames: legends,
  });
  return merge(
    {
      ...barChartOptions,
      barWidth,
      series: [...seriesData],
    },
    {
      legend: {
        data: legends,
      },
      ...options,
    },
  );
};
