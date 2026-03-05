import { EChartsOption } from 'echarts';

const pictorialBarSymbol = {
  grey: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBhVA5DoQwEHMg4Si4JFr+/xbeQEcDEg3iEnc2jjbb7kjWSHN47BHXdemu67AsC6Zpwn3fMDWbGVprKKUs4ji2KIoCeZ5D1HWtOSSEwL8gkYsgCCCHYUCeZUjSFFEU2aLv+/A87zf4vi+e57HYtg3ruqJtW0jKm+YZ+3FASQlllp1MEvHaYXqcYz7P04J10TSN7vse+77biw7SENEKwUWCCpjZr6oKQn+NjOMIWqAkEhHOJ58UhiGSJEFZlvZZjA9EVH0wvi6I2AAAAABJRU5ErkJggg==',
  yellow:
    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEPSURBVHgBNVBBTsMwEJx13NBKQNJeoLeIA1e48wJeAU/gCfwAjoiPcO0TeABI7ZE2TRqUkIrEHtapWHnssa3ZnV3hU5Z6hzu43yuhvxb4lJ5TkCmGICGmgkEJRCuaaEkzWkRjWYh/vSkYx6mAgD9AgsZzOPQS1BJW4Ih0C7znymL5NZWzOXg+B05OgfEEjCxgZFBq5SEvnAO6TvBdQvI18fmRWXQ9ZLOm9B2QzIB0JgoOfKpwHijWQL0FtrmgzMlio3kNrLu4fHTx0T2MycRaiFffTSMSqu1/qKYFTU3uW9Coo0THcZxUUVs/H/rSaN8est7ajEYyE5tEh5b+/6nvne9dpR3sRl3zPrl9WYb3PyzbffBiDGw3AAAAAElFTkSuQmCC',
};

// 图标
type PictorialBarSymbolKeys = keyof typeof pictorialBarSymbol;

export interface IMetricKeyListConfig {
  key: string; // 取值的键
  value: number; // 取值
  name: string; // 指标名称
  symbolKey: PictorialBarSymbolKeys; // 图表的图像键
  legendKey?: string; // 图例的键
  color?: string; // 图例的颜色
}

// 特殊柱状图配置
export const getPictorialBarSeriesOptions = (keyListConfig: IMetricKeyListConfig[]): any => ({
  type: 'pictorialBar',
  stack: 'one',
  barWidth: 15,
  symbolRepeat: true,
  symbolMargin: 0,
  symbolSize: [15, 6],
  itemStyle: {
    color: 'none',
  },
  label: {
    show: true,
    position: 'top',
    formatter: '{c}%',
  },
  data: keyListConfig.map(item => ({
    value: item.value,
    label: {
      position: item.value >= 0 ? 'top' : 'bottom',
    },
    symbol: pictorialBarSymbol[item.symbolKey],
  })),
});

// 基础配置信息
export const chartOptions: EChartsOption = {
  title: {
    text: '损耗率',
    top: 3,
    textStyle: {
      fontSize: 12,
      color: '#978b89',
      fontWeight: 500,
    },
  },
  tooltip: {
    show: false,
    enterable: false,
  },
  grid: {
    left: 8,
    right: 8,
    top: 34,
    bottom: 8,
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
      lineHeight: 16,
      interval: 0,
      margin: 8, //刻度标签与轴线之间的距离。
      overflow: 'break',
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
      show: false,
    },
  },
  series: [],
};
