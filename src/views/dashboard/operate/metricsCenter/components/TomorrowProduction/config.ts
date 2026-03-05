// 圆饼图的基本配置项
const dataLabelFormatter = (params) => {
  const firstPart = `{style|${params.value}}`;
  const secondPart = `${params.name}`;
  return `${firstPart}\n${secondPart}`;
};

// 占位数据tooltip格式
const emptyTooltip = {
  show: false,
  trigger: 'item',
  formatter: function (params) {
    if (params.name === 'placeholder') {
      return ''; // 或者返回null，这样在鼠标悬停时不会显示任何内容
    }
    return params.name + ': ' + params.value;
  }
};

// 白晚班标签富文本配置
const labelRichStyle = {
  show: true,
  formatter: function (params) {
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
}

// 饼图图例文字样式
const pieLabelStyle = {
  show: true,
  formatter: dataLabelFormatter,
  rich: {
    style: {
      lineHeight: 24,
      color: '#1a1a1a', // 设置颜色
      fontWeight: 700,
      fontSize: 14 // 可以设置其他样式
    }
  }
}

export const basePieOptions = {
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: '24',
    right: '0',
    bottom: '12',
    top: '62',
    containLabel: true,
  },
  series: [
    // 左下数据项
    {
      type: 'pie',
      radius: ['40%', '70%'],
      startAngle: 270,
      endAngle: 450,
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: [
        {
          value: 21,
          name: 'Ongoing',
          itemStyle: { color: '#3d7af8' },
          label: pieLabelStyle,
        },
        {
          value: 17,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
      ]
    },
    // 右下数据项
    {
      type: 'pie',
      radius: ['40%', '70%'],
      startAngle: 90, // 起始角度为90度，即从正上方开始
      endAngle: 270, // 结束角度为270度，形成半圆
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: [
        {
          value: 17,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
        {
          value: 21,
          name: 'Ongoing',
          itemStyle: { color: '#46aaf2' },
          label: pieLabelStyle,
        },
      ]
    },
    // 左上数据
    {
      type: 'pie',
      radius: ['40%', '55%'],
      startAngle: 270,
      endAngle: 450,
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: [
        {
          value: 21,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        },
        {
          value: 14,
          name: 'pending',
          label: pieLabelStyle,
          itemStyle: { color: '#fe7b00' },
        },
        {
          value: 3,
          name: 'Ok',
          label: pieLabelStyle,
          itemStyle: { color: '#ececec' },
        },
      ]
    },
    // 右上数据
    {
      type: 'pie',
      radius: ['40%', '55%'],
      startAngle: 90,
      endAngle: 270,
      avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: [
        {
          value: 3,
          name: 'Ok',
          label: pieLabelStyle,
          itemStyle: { color: '#ececec' },
        },
        {
          value: 14,
          name: 'pending',
          label: pieLabelStyle,
          itemStyle: { color: '#fe7b00' },
        },
        {
          value: 21,
          name: 'placeholder',
          label: { show: false },
          itemStyle: { color: 'transparent' },
          // 为占位符添加 tooltip 配置，使其在鼠标悬停时不显示提示
          tooltip: emptyTooltip,
        }
      ]
    },
    // 白班晚班数据
    {
      type: 'pie',
      radius: ['0%', '40%'],
      startAngle: 270,
      endAngle: 450,
      label: {
        position: 'inside'
      },
      data: [
        {
          value: 11,
          name: '晚班',

          itemStyle: {
            color: '#eceff5'
          },
          label: labelRichStyle,
        }
      ]
    },
    {
      type: 'pie',
      radius: ['0%', '40%'],
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
          value: 6,
          name: '白班',

          itemStyle: {
            color: '#f5fafe'
          },
          label: labelRichStyle
        },
      ]
    },
  ],
};

// 基本的配置项
export const baseOptions = {
  color: ['#3e7bf9', '#F7B531', '#cdcdcd'],
  grid: {
    left: '12',
    right: '12',
    bottom: '12',
    top: '62',
    containLabel: true,
  },
  legend: {
    show: true,
    orient: 'horizontal',
    width: '100%',
    height: 44,
    itemWidth: 12,
    itemHeight: 12,
    borderRadius: 0,
    top: 0,
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
    data: ['仓库', '模具', '分切', '模切'], // 分类项数据
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
      stack: 'oneStack',
      name: 'Ongoing',
      data: [64, 24, 0, 88], // 每个分类的百分比数据
      label: {
        show: false, // 显示柱状图顶部的百分比标签
      },
    },
    {
      type: 'bar',
      stack: 'oneStack',
      name: 'pending',
      data: [26, 0, 66, 4], // 每个分类的百分比数据
      label: {
        show: false, // 显示柱状图顶部的百分比标签
      },
    },
    {
      type: 'bar',
      stack: 'oneStack',
      name: 'Ok',
      data: [20, 76, 34, 8], // 每个分类的百分比数据
      label: {
        show: false, // 显示柱状图顶部的百分比标签
      },
      itemStyle: {
        borderRadius: [50, 50, 0, 0]
      },
    },
  ],
  barWidth: 8, // 或者 '20%'
};
