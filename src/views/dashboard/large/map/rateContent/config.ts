import type { EChartsOption } from 'echarts';
import { ERateSvgType } from '/@/views/dashboard/operate/metricsCenter/components/DieCuttingUtilizationRate/chart/types';
import XEUtils from 'xe-utils';

export const dataList = [
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph1.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph2.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph3.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph5.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph6.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph7.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/ph9.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/cd.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/dt2.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/sz.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/zz.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/yn.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/dt3.json',
  'https://lydc.lstech.com/minioapi/lydcpub/tabledata/yd.json',
];

// 主题颜色配置
export const mainColorMap = {
  综合: '#ff7b00',
  圆刀: '#5abcfe',
  平板: '#4b7bec',
};

// 达成率颜色类型配置
export const achievementRateTypeMap: Record<string, ERateSvgType> = {
  综合: ERateSvgType.DAILY_ACHIEVEMENT_RATE,
  圆刀: ERateSvgType.NUD,
  平板: ERateSvgType.NON_NUD,
};

export const sectionValOptions = [
  { label: '全部', value: '' },
  { label: '低于30%', value: '30' },
  { label: '30%-60%', value: '60' },
  { label: '60%-80%', value: '80' },
  { label: '80%以上', value: '80+' },
];

// 柱形图配置
export const barOptions: EChartsOption = {
  color: ['#4b7bec'],
  title: {
    show: true,
    top: 6,
    left: 6,
    textStyle: {
      color: '#fff',
      fontSize: 18,
    },
  },
  grid: {
    left: 12,
    top: 44,
    right: 12,
    bottom: 6,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    showContent: false,
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: false, // 分割线
    },
    axisLine: {
      show: false, // 轴线
    },
    axisTick: {
      show: false, // 刻度线
    },
    axisLabel: {
      show: true,
      color: '#fff',
      width: 68,
      interval: 0,
      hideOverlap: false,
      lineHeight: 16,
      overflow: 'break',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.4)',
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#fff',
    },
  },
  series: [
    {
      data: [],
      type: 'bar',
      itemStyle: {
        borderRadius: [50, 50, 0, 0],
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 12, // 字体大小
        color: '#fff', // 字体颜色
      },
    },
  ],
  barWidth: 12,
};

// 停机原因分析图表配置
export const ringPieOptions: EChartsOption = {
  title: {
    show: true,
    top: 6,
    left: 0,
    text: '停机原因分析',
    textStyle: {
      color: '#fff',
      fontSize: 18,
    },
  },
  legend: {
    show: true,
    itemWidth: 14,
    width: '30%',
    left: 0,
    top: 44,
    textStyle: {
      color: '#fff',
      fontSize: 15,
    },
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
        color: '#fff',
        fontSize: 15,
      },
      data: [],
    },
  ],
};

// 停机原因分析表格
export const allColumnsOptions = {
  keys: {
    title: '停机原因',
  },
  values: {
    title: '停机时长',
    sortable: true,
  },
  rate: {
    title: '停机占比',
    sortable: true,
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 2 })}%`;
    },
  },
};
export const columns = [{ field: 'keys' }, { field: 'values' }, { field: 'rate' }];
