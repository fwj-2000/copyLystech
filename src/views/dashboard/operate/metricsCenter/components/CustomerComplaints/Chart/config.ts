import { EChartsOption } from 'echarts';

// 总览
export const chartOptions: EChartsOption = {
  tooltip: {
    show: false,
    enterable: false,
  },
  grid: {
    left: 0,
    right: 0,
    top: 12,
    bottom: 18,
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
      color: 'rgba(0,0,0,0.6)',
      margin: 8, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
    min: 0,
    max: 100,
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
        color: '#3da4eb',
      },
      data: [1],
    },
    // 2层
    {
      name: '',
      type: 'pictorialBar',
      symbolSize: [12, 6.5],
      symbolOffset: [0, -3],
      z: 12,
      symbolPosition: 'end',
      itemStyle: {
        color: '#98d5ff',
        opacity: 1,
      },
      tooltip: {
        show: false,
      },
      data: [88],
    },
    {
      type: 'bar',
      stack: 'one',
      barWidth: 12,
      showBackground: true,
      backgroundStyle: {
        color: '#F4FBFF',
        opacity: 0.72,
        borderColor: '#E6E6E6',
        borderWidth: 1,
        borderRadius: 50,
      },
      data: [
        {
          value: 88,
          itemStyle: {
            borderRadius: 50,
            color: {
              type: 'linear',
              x: 0,
              x2: 0,
              y: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgb(61, 167, 238)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(61, 167, 238, 0.74)', // 100% 处的颜色
                },
              ],
            },
          },
        },
      ],
    },
  ],
  barGap: '100%',
};
