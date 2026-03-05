import type { EChartsOption } from 'echarts';

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
      margin: 16, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: {
    show: true,
    nameGap: 12,
    // min: 0,
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
      // dashArrayY: [6, 0],
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
