import echarts from 'echarts';
import { getMountainPeakData } from '/@/views/dashboard/chartSeriesDataConfig';
import { isEmpty, merge } from 'lodash-es';

// 基本的配置项
export const chartOptions: echarts.EChartsOption = {
  grid: {
    left: 0,
    right: 0,
    top: 12,
    bottom: 0,
    containLabel: true,
  },
  tooltip: {
    show: true,
    appendTo: 'body',
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      interval: 0,
      show: true,
    },
  },
  yAxis: {
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
      show: true,
    },
  },
};

export const getChartOptions = ({
  data = [],
  options = {},
  colors = [],
}: {
  data: any[];
  options?: echarts.EChartsOption;
  colors?: echarts.Color[];
}): echarts.EChartsOption => {
  const seriesData = getMountainPeakData({
    data: data.map(value => ({ value })),
    ...(isEmpty(colors) ? {} : { colors }),
  });
  return merge(
    {
      ...chartOptions,
      series: [seriesData],
    },
    options,
  );
};
