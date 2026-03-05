import { PopoverInfoList } from '/@/views/dashboard/operate/types';

// 圆饼图的基本配置项
const dataLabelFormatter = params => {
  const firstPart = `{style|${params.value}%}`;
  const secondPart = `${params.name}`;
  return `${firstPart}\n${secondPart}`;
};

const labelRichStyle = {
  lineHeight: 24,
  color: '#1A1A1A', // 设置颜色
  fontSize: 14,
  fontWeight: 700,
};

const emptyTooltip = {
  trigger: 'item',
  formatter: function (params) {
    if (params.name === 'placeholder') {
      return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
    }
    return params.name + ': ' + params.value;
  },
};
// 基本的配置项
export const baseOptions = {
  tooltip: {},
  grid: {
    left: '14',
    right: '14',
    containLabel: true,
  },
  series: [
    {
      type: 'pie',
      radius: ['80%', '88%'],
      center: ['50%', '93%'],
      startAngle: 180,
      endAngle: 360,
      data: [
        {
          value: 98.6,
          name: 'FAI直通率',
          itemStyle: { color: '#4272e2' },
          label: {
            show: true,
            formatter: dataLabelFormatter,
            rich: {
              style: labelRichStyle,
            },
          },
        },
        {
          value: 1.4,
          name: 'placeholder',
          itemStyle: { color: '#ededed' },
          emphasis: { disabled: true },
          label: { show: false },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
      ],
    },
    {
      type: 'pie',
      radius: ['70%', '78%'],
      center: ['50%', '93%'],
      // adjust the start and end angle
      startAngle: 180,
      endAngle: 360,
      data: [
        {
          value: 26.7,
          name: 'FQC直通率',
          itemStyle: { color: '#2bacff' },
          label: {
            show: true,
            formatter: dataLabelFormatter,
            rich: {
              style: labelRichStyle,
            },
          },
        },
        {
          value: 73.3,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: '#ededed' },
          emphasis: { disabled: true },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
      ],
    },
  ],
};

// 悬浮提示
export const POPOVER_TOOLTIP_LIST: PopoverInfoList[] = [
  {
    title: 'FAI直通率',
    content: ['首检OK批次/总送检批次*100%'],
  },
  {
    title: 'FQC直通率',
    content: ['抽检OK批次/总送检批次*100%'],
  },
  {
    title: '常规问题',
    content: ['品质日常稽核到的常规问题点数'],
  },
  {
    title: '低级问题',
    content: ['品质日常稽核到的低级问题点数'],
  },
];
