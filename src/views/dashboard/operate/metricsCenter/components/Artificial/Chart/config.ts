import type { EChartsOption } from 'echarts';

// 基本的配置项
export const baseNumOptions: EChartsOption = {
  tooltip: {
    trigger: 'item',
    confine: true,
    show: false,
    appendToBody: true,
  },
  grid: {
    left: 16,
    right: 16,
    top: 36,
    bottom: 12,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      width: 24,
      overflow: 'break',
      margin: 8, //刻度标签与轴线之间的距离。
      interval: 0,
    },
  },
  yAxis: {
    show: true,
    nameGap: 12,
    nameTextStyle: {
      align: 'left',
      padding: [6, 0, 0, 0],
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
      formatter: '{value}%',
    },
  },
  series: [
    {
      type: 'pictorialBar',
      barGap: 0,
      barCategoryGap: 0,
      symbolPosition: 'start',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
      symbolSize: ['200%', '100%'],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(75, 123, 236, 1)',
            },
            {
              offset: 1,
              color: 'rgba(189, 206, 245, 0.12)',
            },
          ],
        },
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
      },
      data: [],
    },
  ],
};

// 总览
export const chartOptions: EChartsOption = {
  tooltip: {
    show: false,
    enterable: false,
  },
  grid: {
    left: 12,
    right: 8,
    top: 18,
    bottom: 6,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      width: 36,
      overflow: 'break',
      margin: 16, //刻度标签与轴线之间的距离。
      interval: 0,
    },
  },
  yAxis: {
    show: true,
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
    axisLabel: {
      show: true,
      formatter: '{value}%',
    },
  },
  series: [
    {
      type: 'pictorialBar',
      stack: 'one',
      barWidth: 15,
      symbolRepeat: true,
      symbolMargin: 0,
      symbolSize: [15, 6],
      symbol:
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAENSURBVHgBNZBBTsMwEEX/OE7V0NKmERIsusgCiSUs2XEDrkBZcgR23ABuwFV6AzhCyw5amoQAokntz6RpRx756Y+/5W/hJI2xiW7g6nN4dwEiBjnSjtEUSRhTQJDBBHPlGaQzRddPhXdXK4TdWIeA8YBQ961N0BZb1uWUvQ6pTDcXXp8Qx6fAaAx0B4CN1Gx33uYQW6Re7CvgdwV8vRNvL2KpovwsCNkA/QQ4TAS9hFseaHs1FR9A+QlkS0G5JMsFEISw9dnlg496EwQ2NRJonFBTUqReQ8pc0SlXqhiwPwSiA/BoXATf2dM+F7Lnx9RapLSd1AThkLL7sObxZO5dVWjOPFz/vUa397NG/wedh3R5HHlt4AAAAABJRU5ErkJggg==',
      itemStyle: {
        color: 'none',
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
      },
      data: [],
    },
  ],
};
