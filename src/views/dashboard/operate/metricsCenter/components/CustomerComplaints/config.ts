import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 圆饼图的基本配置项
const emptyTooltip = {
  trigger: 'item',
  formatter: function (params) {
    if (params.name === 'placeholder') {
      return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
    }
    return params.name + ': ' + params.value;
  }
};
// 基本的配置项
export const baseOptions = {
  tooltip: {
    trigger: 'item',
    formatter: '{d}',
  },
  grid: {
    left: '14',
    right: '14',
    top: '14',
    bottom: '14',
    containLabel: true,
  },
  series: [
    {
      type: 'pie',
      radius: ['60%', '70%'],
      center: ['48%', '58%'],
      startAngle: 180,
      endAngle: 540,
      // adjust the start and end angle
      data: [
        {
          value: 49,
          itemStyle: { color: '#45b5ff' },
          label: {
            show: false,
          }
        },
        {
          value: 51,
          name: 'placeholder',
          itemStyle: { color: 'transparent' },
          emphasis: { disabled: true },
          label: { show: false },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
      ]
    },
    {
      type: 'pie',
      radius: ['75%', '85%'],
      center: ['48%', '58%'],
      startAngle: 180,
      endAngle: 540,
      // adjust the start and end angle
      data: [
        {
          value: 69,
          itemStyle: { color: '#3c78f5' },
          label: {
            show: false,
          }
        },
        {
          value: 31,
          name: 'placeholder',
          itemStyle: { color: 'transparent' },
          emphasis: { disabled: true },
          label: { show: false },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
      ]
    },
  ]
};

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: '客诉',
    content: ['当周发生客诉件数'],
  },
  {
    title: '关闭率',
    content: ['已关闭客诉数/发生客诉数*100%'],
  },
];
