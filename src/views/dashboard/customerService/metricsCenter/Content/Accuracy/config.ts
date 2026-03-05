import echarts from 'echarts';
import { getCylinderSeriesData } from '/@/views/dashboard/chartSeriesDataConfig';

// 柱状图配置
export const barChartOptions: echarts.EChartsOption = {
  tooltip: {
    show: true,
    enterable: false,
    appendToBody: true,
  },
  grid: {
    left: 0,
    right: 0,
    top: 18,
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
      show: false,
    },
  },
};

export const getBarChartOptions = (data: any[]): echarts.EChartsOption => {
  const seriesData = getCylinderSeriesData({
    barWidth: 14,
    data: [
      {
        value: data[0] ?? 0,
        colors: {
          bottom: '#BFBFBF',
          top: '#dcdcdc',
          bar: {
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#BFBFBF', // 100% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF', // 0% 处的颜色
              },
            ],
          },
        },
      },
      {
        value: data[1] ?? 0,
        colors: {
          bottom: '#4B7BEC',
          top: '#a3beff',
          bar: {
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(110, 143, 221, 1)', // 100% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(142, 169, 234, 0.74)', // 0% 处的颜色
              },
            ],
          },
        },
      },
    ],
  });
  return {
    ...barChartOptions,
    series: [...seriesData],
  };
};
