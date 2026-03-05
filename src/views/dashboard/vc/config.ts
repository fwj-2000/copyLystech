import { EChartsOption } from 'echarts';
enum ETimeDimension {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const timeDimensionOptions = [
  { text: t('component.time.days'), value: ETimeDimension.DAY },
  { text: t('component.time.weeks'), value: ETimeDimension.WEEK },
  { text: t('component.time.months'), value: ETimeDimension.MONTH },
  { text: t('component.time.quarters'), value: ETimeDimension.QUARTER },
  { text: t('component.time.years'), value: ETimeDimension.YEAR },
];

//关键工序和良率总览公用 柱状图和折线图
export const getBarAndLineChart = (): EChartsOption => {
  return {
    grid: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      axisPointer: {
        show: true,
      },
      axisLabel: {
        interval: 0,
      },
      axisTick: {
        show: false,
      },
      boundaryGap: true,
    },
    yAxis: [
      {
        position: 'left',
        type: 'value',
        splitNumber: 1,
        // interval: 500,
        axisLabel: {
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
          margin: 10,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed', // 虚线样式
            color: '#E0E0E0', // 分隔线颜色（浅灰色）
            width: 1, // 分隔线粗细
            dashOffset: 0, // 虚线起始偏移（可选）
          },
        },
      },
      {
        position: 'right',
        type: 'value',
        interval: 50,
        splitNumber: 1,
        axisLabel: {
          formatter: '{value}%',
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
          margin: 10,
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed', // 虚线样式
            color: '#E0E0E0', // 分隔线颜色（浅灰色）
            width: 1, // 分隔线粗细
            dashOffset: 0, // 虚线起始偏移（可选）
          },
        },
      },
    ],
    series: [
      {
        name: '不良数',
        type: 'bar',
        barWidth: 28,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#C3D5FF' },
              { offset: 1, color: '#3874FF' },
            ],
          },
          borderWidth: 1,
          borderColor: '#3874FF',
        },
        label: {
          show: true, // 显示标签
          position: 'insideBottom', // 标签位置在柱子上方
          color: '#000000', // 字体颜色
          fontSize: 10, // 字体大小
        },
      },
      {
        name: '累计不良占比',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'emptyCircle',
        smooth: true,
        symbolSize: 6,
        itemStyle: {
          color: '#FF7B00',
          borderWidth: 1,
        },
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#FF7B00' },
              { offset: 1, color: '#FFD04E' },
            ],
          },
          cap: 'round',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + '%';
          },
        },
        animationDelay: function (idx) {
          return idx * 100; // 每个数据点动画延迟（实现依次弹入）
        },
        label: {
          show: true,
          formatter: '{c}%',
          color: '#000000', // 字体颜色
          fontSize: 10, // 字体大小
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        bottom: 5,
        startValue: 0,
        endValue: 5,
        dataBackground: {
          areaStyle: {
            color: 'rgba(0,0,0,0.03)',
          },
        },
        // 底部缩放配置
        selectedDataBackground: {
          areaStyle: {
            color: 'rgba(0,0,0,0.1)',
          },
          lineStyle: {
            color: 'rgba(0,0,0,0.1)',
          },
        },
        borderColor: '#FFF',
        fillerColor: 'rgba(33,33,33, 0.01)',
        moveHandleStyle: {
          opacity: 0,
        },
        handleIcon:
          'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
        handleStyle: {
          borderWidth: 0,
        },
      },
    ],
  };
};
