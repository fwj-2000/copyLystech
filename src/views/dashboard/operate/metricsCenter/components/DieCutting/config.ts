const RichStyle = {
  lineHeight: 24,
  color: '#1A1A1A', // 设置颜色
  fontWeight: '700',
  fontSize: 14 // 可以设置其他样式
};
const LabelFormatter = (params) => {
  const firstPart = `{style|${params.percent}%}`;
  const secondPart = `${params.name}${params.value}台`;
  return `${firstPart}\n${secondPart}`;
};
// 圆饼图的基本配置项
export const basePieOptions = {
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      type: 'pie',
      radius: ['60%', '100%'],
      startAngle: 270,
      endAngle: 450,
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: [
        {
          value: 17,
          name: '批产',
          itemStyle: { color: '#3e7bfa' },
          label: {
            show: true,
            formatter: LabelFormatter,
            rich: {
              style: RichStyle
            }
          }
        },
        {
          value: 6,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.name === 'placeholder') {
                return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
              }
              return params.name + ': ' + params.value;
            }
          }
        },
      ]
    },
    {
      type: 'pie',
      radius: ['60%', '100%'],
      startAngle: 90, // 起始角度为90度，即从正上方开始
      endAngle: 270, // 结束角度为270度，形成半圆
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: [
        {
          value: 6,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.name === 'placeholder') {
                return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
              }
              return params.name + ': ' + params.value;
            }
          }
        },
        {
          value: 17,
          name: '批产',
          itemStyle: { color: '#46aaf2' },
          label: {
            show: true,
            formatter: LabelFormatter,
            rich: {
              style: RichStyle
            }
          }
        },
      ]
    },
    {
      type: 'pie',
      radius: ['60%', '80%'],
      startAngle: 270,
      endAngle: 450,
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      emphasis: {
        label: {
          show: true
        },
        itemStyle: {
          color: 'inherit',
        },
      },
      data: [
        {
          value: 17,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.name === 'placeholder') {
                return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
              }
              return params.name + ': ' + params.value;
            }
          }
        },
        {
          value: 6,
          name: '空闲',
          label: {
            show: true,
            formatter: LabelFormatter,
            rich: {
              style: RichStyle
            }
          },
          itemStyle: { color: '#f99531' },
        },
      ]
    },
    {
      type: 'pie',
      radius: ['60%', '80%'],
      startAngle: 90,
      endAngle: 270,
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      emphasis: {
        label: {
          show: true
        },
        itemStyle: {
          color: 'inherit',
        },
      },
      data: [
        {
          value: 6,
          name: '空闲',
          label: {
            show: true,
            formatter: LabelFormatter,
            rich: {
              style: RichStyle
            }
          },
          itemStyle: { color: '#f99531' },
        },
        {
          value: 17,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.name === 'placeholder') {
                return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
              }
              return params.name + ': ' + params.value;
            }
          }
        },
      ]
    },
    {
      type: 'pie',
      radius: ['0%', '60%'],
      startAngle: 90,
      endAngle: 270,
      label: {
        position: 'inside'
      },
      emphasis: {
        label: {
          show: true
        },
        itemStyle: {
          color: 'inherit',
        },
      },
      data: [
        {
          value: 23,
          name: '平板',

          itemStyle: {
            color: '#eceff5'
          },
          label: {
            show: true,
            formatter: function (params) {
              // 假设你想让前半部分文字为红色，后半部分为蓝色
              const firstPart = `${params.name}`;
              const secondPart = `{style|${params.value}台}`;
              return `${firstPart}\n${secondPart}`;
            },
            rich: {
              style: {
                lineHeight: 28,
                fontWeight: 'bolder',
                color: '#1a1a1a', // 设置颜色
                fontSize: 14 // 可以设置其他样式
              }
            }
            // 其他label配置...
          }
        },
      ]
    },
    {
      type: 'pie',
      radius: ['0%', '60%'],
      startAngle: 270,
      endAngle: 450,
      label: {
        position: 'inside'
      },
      emphasis: {
        label: {
          show: true
        },
        itemStyle: {
          color: 'inherit',
        },
      },
      data: [
        {
          value: 23,
          name: '圆刀',

          itemStyle: {
            color: '#F5FAFE'
          },
          label: {
            show: true,
            formatter: function (params) {
              // 假设你想让前半部分文字为红色，后半部分为蓝色
              const firstPart = `${params.name}`;
              const secondPart = `{style|${params.value}台}`;
              return `${firstPart}\n${secondPart}`;
            },
            rich: {
              style: {
                lineHeight: 28,
                fontWeight: 'bolder',
                color: '#1a1a1a', // 设置颜色
                fontSize: 14 // 可以设置其他样式
              }
            }
            // 其他label配置...
          }
        }
      ]
    }
  ],
};

// 基本的配置项
export const baseOptions = {
  color: ['#3e7bfa', '#76C6FF'],
  grid: {
    left: '12',
    right: '12',
    bottom: '12',
    top: '32',
    containLabel: true,
  },
  tooltip: {
    trigger: 'item',
  },
  yAxis: {
    type: 'value', // x轴设为数值轴，用于显示百分比
    min: 0,
    max: 100, // 设定最大值为100%，根据需要调整
    splitLine: { // 移除x轴的分割线
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  xAxis: {
    type: 'category', // y轴设为分类轴，用于显示分类项
    data: ['开机率', '稼动率'], // 分类项数据
    interval: 0,
    axisTick: {
      show: false
    },
    axisLine: {
      // 移除x轴的分割线
      show: true
    },
  },
  series: [
    {
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: '#EDEDED',
      },
      data: [{
        value: 95,
        itemStyle: {
          color: '#3e7bfa',
        },
      }, {
        value: 64,
        itemStyle: {
          color: '#76C6FF',
        },
      }], // 每个分类的百分比数据
      label: {
        show: true, // 显示柱状图顶部的百分比标签
        position: 'top', // 设置标签位置在顶部
        formatter: '{c}%', // 格式化标签文本为百分比形式
        fontSize: 12,
      },
      color: '#3e7bfa',
    },
  ],
  itemStyle: {
    borderRadius: [50, 50, 0, 0],
  },
  barWidth: 8, // 或者 '20%'
};
