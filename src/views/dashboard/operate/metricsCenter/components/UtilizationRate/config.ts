import type { EChartsOption } from 'echarts';
import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 基本的配置项
export const baseOptions: EChartsOption = {
  color: ['#4B7BEC', '#ededed'],
  grid: {
    left: '-48',
    right: '12',
    bottom: '12',
    top: '12',
    containLabel: true,
  },
  xAxis: {
    type: 'value', // x轴设为数值轴，用于显示百分比
    min: 0,
    max: 100, // 设定最大值为100%，根据需要调整
    splitLine: {
      // 移除x轴的分割线
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    type: 'category', // y轴设为分类轴，用于显示分类项
    data: ['机台稼动率', '产品稼动率', '开机率'], // 分类项数据
    axisTick: {
      // 可选：移除y轴刻度线
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      align: 'left',
      margin: 84,
    },
  },
  series: [
    // {
    //   type: 'pictorialBar',
    //   stack: 'oneStack',
    //   symbol: 'roundRect',
    //   z: 3,
    //   symbolRepeat: true,
    //   symbolSize: [3, 12],
    //   symbolMargin: 1,
    //   symbolOffset: [3, 0],
    //   data: [0, 0, 0], // 每个分类的百分比数据
    //   itemStyle: {
    //     color: {
    //       type: "linear",
    //       x: 0,
    //       x2: 1,
    //       y: 0,
    //       y2: 0,
    //       colorStops: [{
    //         offset: 0,
    //         color: 'rgba(75, 123, 236, 0.1)',
    //       },
    //       {
    //         offset: 1,
    //         color: 'rgba(57, 105, 216, 0.8)',
    //       }],
    //     },
    //   },
    //   label: {
    //     show: true, // 显示柱状图顶部的百分比标签
    //     position: 'top', // 设置标签位置在顶部
    //     formatter: '{c}%', // 格式化标签文本为百分比形式
    //     fontSize: 12,
    //   }
    // },
    // {
    //   type: 'pictorialBar',
    //   symbol: 'react',
    //   symbolSize: [3, 12],
    //   symbolMargin: 1.5,
    //   symbolOffset: [0, 0],
    //   symbolRepeat: true,
    //   barGap: '-100%',
    //   z: 2,
    //   data: [100, 100, 100], // 每个分类的百分比数据
    //   itemStyle: {
    //     color: '#e7edfa',
    //   },
    //   label: {
    //     show: false, // 显示柱状图顶部的百分比标签
    //     position: 'top', // 设置标签位置在顶部
    //     formatter: '{c}%', // 格式化标签文本为百分比形式
    //     fontSize: 12,
    //   }
    // },
    {
      type: 'bar',
      barGap: '-100%',
      z: 1,
      data: [100, 100, 100], // 每个分类的百分比数据
      itemStyle: {
        color: 'none',
        borderWidth: 1,
        borderColor: 'rgb(204, 218, 249)',
      },

      label: {
        show: false, // 显示柱状图顶部的百分比标签
        position: 'top', // 设置标签位置在顶部
        formatter: '{c}%', // 格式化标签文本为百分比形式
        fontSize: 12,
      },
    },
  ],
  barWidth: 18,
};

// popover 提示信息
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '开机',
    content: ['AOI过检产品并正常上传数据机台，按班次统计'],
  },
  {
    title: '开机率',
    content: ['开机班次数/(总机台数*2)*100%'],
  },
  {
    title: '产品稼动率',
    content: ['排除待料时间，Σ机台运行时间/Σ每卷产品过机时长*100%'],
  },
  {
    title: '机台稼动率',
    content: ['设定每班10H排产时间，Σ机台运行时间/(600min*开机班次数*100%)'],
  },
];

export enum EAOIMark {
  ALL = 'A',
  GENERAL = 'T',
  SPECIAL = 'Z',
}
export const AOI_MARK_OPTIONS = [
  {
    label: '汇总',
    value: EAOIMark.ALL,
  },
  {
    label: '通用',
    value: EAOIMark.GENERAL,
  },
  {
    label: '专用',
    value: EAOIMark.SPECIAL,
  },
];

export const DEFAULT_AOI_MARK = EAOIMark.ALL;
