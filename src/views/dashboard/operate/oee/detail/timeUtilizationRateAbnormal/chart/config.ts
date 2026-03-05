import { EChartsOption } from 'echarts';

// 停机占比图表配置
export const Options: EChartsOption = {
  title: {
    text: '停机占比',
    textAlign: 'left',
    left: 12,
    top: 12,
  },
  legend: {
    itemWidth: 14,
    width: '30%',
    top: 'center',
    left: '20',
  },
  series: [
    {
      type: 'pie',
      radius: ['20%', '60%'],
      center: ['65%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 4,
      },
      label: {
        formatter: '{b}: {d}%',
      },
      data: [
        // { value: 40, name: 'rose 1' },
        // { value: 38, name: 'rose 2' },
        // { value: 32, name: 'rose 3' },
        // { value: 30, name: 'rose 4' },
        // { value: 28, name: 'rose 5' },
        // { value: 26, name: 'rose 6' },
        // { value: 22, name: 'rose 7' },
        // { value: 18, name: 'rose 8' },
      ],
    },
  ],
};

// 停机时长图表配置
export const Options2: EChartsOption = {
  title: {
    text: '停机时长(min)',
    textAlign: 'left',
    left: 12,
    top: 12,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    show: false,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  label: {
    show: true,
    position: 'right',
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: 'category',
    data: [],
  },
  series: [
    {
      type: 'bar',
      itemStyle: {
        color: '#fa8111',
        borderRadius: [0, 50, 50, 0],
      },
      barWidth: 10,
      data: [],
    },
  ],
};
