import { EChartsOption } from 'echarts';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
// import { getOrganization } from '/@/api/dashbord/operate';
// import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dashboard/utils';

enum ETimeDimension {
  WEEK = 'week',
  MONTH = 'month',
  DAY = 'date',
  QUARTER = 'quarter',
  YEAR = 'year',
}

// 基础配置信息
export function getBaseProjectDailyYieldOptions(): EChartsOption {
  return {
    // 图表类型设置为柱状图
    grid: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 40,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
      // valueSuffix: '%',
      valueFormatter: value => value + '%',
    },
    legend: {
      bottom: 10,
      borderWidth: 0,
      itemStyle: {
        borderWidth: 0, // 可选：确保图例图标无边框
      },
      textStyle: {
        fontSize: 12, // 调整图例文字大小（可选）
        padding: [0, 0, 0, 0], // 调整文字与图标的间距（左填充 2px）
        lineHeight: 8,
        verticalAlign: 'bottom',
      },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 8,
      icon: 'circle', // 统一使用圆形图标
    },
    xAxis: {
      type: 'category',
      // data: ['XTM601', 'XTG601', 'XTG602', 'UFF602', 'NZKG618', 'NTP639', 'XFV601', 'XVN601', 'XTJ601'],
      axisPointer: {
        show: true,
      },
      axisLabel: {
        interval: 0,
      },
      boundaryGap: true,
    },
    yAxis: [
      {
        type: 'value',
        // min: 0,
        // max: 100,
        // interval: 10,
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
            dashArray: [4, 4], // 虚线模式：[实线长度, 间隔长度]（可选）
          },
        },
      },
      {
        type: 'value',
        min: 0,
        max: 100,
        // interval: 10,
        axisLabel: {
          formatter: '{value}%',
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
            dashArray: [4, 4], // 虚线模式：[实线长度, 间隔长度]（可选）
          },
        },
        position: 'right',
      },
    ],

    series: [
      {
        name: '直通良率',
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
          formatter: '{c}%', // 格式化显示为 "数值%"
          color: '#000000', // 字体颜色
          fontSize: 12, // 字体大小
          fontWeight: 'bold', // 字体加粗（可选）
        },
        // data: [45, 55, 65, 78, 85, 70, 55, 40, 30], // 可以取消注释添加数据
      },
      {
        name: '目标良率',
        type: 'line',
        symbol: 'emptyCircle',
        smooth: true,
        symbolSize: 6,
        lineStyle: {
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
          type: 'solid',
          width: 3,
        },
        // itemStyle: {
        //   color: '#FFA500' // 节点颜色设为橙色
        // },
        itemStyle: {
          color: '#FFA500',
          // borderColor: '#FF7B00',
          borderWidth: 2,
        },
        z: 5,
        silent: true,
        label: {
          show: true,
          formatter: '{c}%',
          color: '#fe7310',
          fontWeight: 'bold', // 字体加粗（可选）
        },
        // data: [1, 55, 65, 78, 85, 70, 55, 40, 30], // 可以取消注释添加数据
        // markLine: {
        //   symbol: 'circle',
        //   lineStyle: {
        //     color: '#FF7b00',
        //     type: 'solid',
        //   },
        //   label: {
        //     show: true, // 不显示数值标签
        //     formatter: '{c}%', // 格式化显示为 "数值%"
        //     position: 'top',
        //   },
        // },
      },
    ],
  };
}

export function getKeyProcessesYield(): EChartsOption {
  return {
    title: null,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
    },
    grid: {
      left: '3%',
      right: '6%', // 为右侧百分比标签留出空间
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    yAxis: [
      {
        type: 'category',
        // data: ['AOI', '表面处理', '外观全检', '预焊', '性能测试', '测漏', '擦拭', '切头', '上下盖焊接'],
        axisLabel: {
          interval: 0,
          margin: 8,
          color: '#000000',
          fontSize: 12,
          opacity: 0.6,
        },
        axisLine: {
          show: false, // 隐藏轴线
        },
        axisTick: {
          show: false, // 隐藏刻度线
        },
        splitLine: {
          show: false, // 隐藏刻度线
        },
      },
      // 右侧副yAxis（显示百分比标签）
      {
        type: 'category',
        // data: ['AOI', '表面处理', '外观全检', '预焊', '性能测试', '测漏', '擦拭', '切头', '上下盖焊接'], // 必须提供相同的分类数据
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
          padding: [0, 0, 0, 0], // 去除标签内边距
          // formatter: function (value, index) {
          //   return [99, 97, 96, 94, 90, 89, 88, 87, 86][index] + '%';
          // },
        },
        offset: 10,
        position: 'right',
      },
    ],
    xAxis: {
      type: 'value',
      // min: 80,
      max: 100,
      axisLabel: {
        show: false,
      },
      splitLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        // data: [99, 97, 96, 94, 90, 89, 88, 87, 86],
        yAxisIndex: 0,
        barWidth: 28,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#FF993A' },
              { offset: 1, color: 'rgba(255, 123, 0, 0.09)' },
            ],
          },
          borderColor: '#FF7B00',
          borderWidth: 1,
          borderType: 'solid',
        },
        showBackground: true,
        backgroundStyle: { color: '#FFF5F0' },
        // 隐藏原有的label（改用右侧yAxis显示）
        label: { show: false },
      },
    ],
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'linear',
    // 添加滚动条配置
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: [0, 1], // 控制两个y轴
        show: false,
        start: 0, // 初始显示0%
        // end: 40, // 初始显示40%的数据（大约显示10-11个项目）
        // end: (9 / 27 * 100).toFixed(2) - 0.01,
        height: 20, // 滚动条高度
        bottom: 30, // 距离底部位置
        fillerColor: '#FF7B00', // 滚动条填充颜色
        borderColor: 'transparent',
        handleIcon:
          'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#FF7B00',
          shadowBlur: 3,
          shadowColor: 'rgba(255, 123, 0, 0.3)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
      {
        type: 'inside', // 内置型数据区域缩放组件（支持鼠标交互）
        yAxisIndex: [0, 1], // 同时控制左右两个Y轴
        zoomOnMouseWheel: false, // 关闭滚轮缩放（避免滚轮改变柱子粗细）
        moveOnMouseWheel: true, // 开启滚轮平移（实现滚轮上下滚动）
        moveOnMouseMove: true, // 开启鼠标拖拽平移
        preventDefaultMouseMove: false, // 防止阻止默认事件（可选）
      },
    ],
  };
}

export function getTopIssuePareto() {
  return {
    // 图表类型设置为柱状图
    grid: {
      top: 40,
      right: 50,
      bottom: '18%',
      left: 60,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
      valueSuffix: '%',
    },
    legend: {
      show: false,
      bottom: 10,
      borderWidth: 0,
      itemStyle: {
        borderWidth: 0, // 可选：确保图例图标无边框
      },
      textStyle: {
        fontSize: 12, // 调整图例文字大小（可选）
        padding: [0, 0, 0, 0], // 调整文字与图标的间距（左填充 2px）
        lineHeight: 8,
        verticalAlign: 'bottom',
      },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 8,
      icon: 'circle', // 统一使用圆形图标
      data: ['不良数', '累计不良占比', '不良占比'], // 添加折线图的图例
    },
    xAxis: {
      type: 'category',
      // data: ['压伤', '划伤', '侧漏不良', '性能不良', '破真空', '变形', '其他'],
      axisPointer: {
        show: true,
      },
      axisLabel: {
        interval: 0,
      },
      boundaryGap: true,
    },
    yAxis: [
      {
        type: 'value',
        // max: 900,
        // interval: 100,
        axisLabel: {
          // formatter: '{value}%',
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
            // dashArray: [4, 4] // 虚线模式：[实线长度, 间隔长度]（可选）
          },
        },
      },
      {
        type: 'value',
        min: 0,
        max: 100,
        interval: 10,
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
            show: false,
            type: 'dashed', // 虚线样式
            color: '#E0E0E0', // 分隔线颜色（浅灰色）
            width: 1, // 分隔线粗细
            dashOffset: 0, // 虚线起始偏移（可选）
            dashArray: [4, 4], // 虚线模式：[实线长度, 间隔长度]（可选）
          },
        },
        position: 'right',
      },
      // {
      //   type: 'value',
      //   min: 0,
      //   max: 100,
      //   interval: 10,
      //   axisLabel: {
      //     formatter: '{value}%',
      //     color: '#000000',
      //     fontSize: 12,
      //     opacity: 0.4,
      //     margin: 10,
      //   },
      //   splitLine: {
      //     show: false,
      //     lineStyle: {
      //       show: false,
      //       type: 'dashed', // 虚线样式
      //       color: '#E0E0E0', // 分隔线颜色（浅灰色）
      //       width: 1, // 分隔线粗细
      //       dashOffset: 0, // 虚线起始偏移（可选）
      //       dashArray: [4, 4], // 虚线模式：[实线长度, 间隔长度]（可选）
      //     },
      //   },
      //   position: 'right',
      // },
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
          position: 'top', // 标签位置在柱子上方
          // formatter: '{c}%',   // 格式化显示为 "数值%"
          color: '#000000', // 字体颜色
          fontSize: 12, // 字体大小
          fontWeight: 'bold', // 字体加粗（可选）
        },
        // data: [380, 510, 680, 860, 600, 500, 320] // 可以取消注释添加数据
      },
      {
        name: '累计不良占比',
        type: 'line',
        yAxisIndex: 1,
        // 节点样式（保持你之前的要求）
        symbol: 'emptyCircle',
        smooth: true,
        symbolSize: 6,
        itemStyle: {
          color: '#FF7B00',
          // borderColor: '#FF7B00',
          borderWidth: 2,
        },
        // 线条样式（保持渐变）
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
        },
        // data: [20, 52, 82, 100, 130, 160, 180]
      },
      // {
      //   name: '不良占比',
      //   type: 'line',
      //   yAxisIndex: 2,
      //   // 节点样式（保持你之前的要求）
      //   symbol: 'emptyCircle',
      //   smooth: true,
      //   symbolSize: 6,
      //   itemStyle: {
      //     color: '#52aeebff',
      //     // borderColor: '#00e1ffff',
      //     borderWidth: 2,
      //   },
      //   // 线条样式（保持渐变）
      //   lineStyle: {
      //     width: 3,
      //     color: {
      //       type: 'linear',
      //       x: 0,
      //       y: 0,
      //       x2: 1,
      //       y2: 0,
      //       colorStops: [
      //         { offset: 0, color: '#1BC2FF' },
      //         { offset: 1, color: '#2B67FF' },
      //       ],
      //     },
      //     cap: 'round',
      //   },
      //   tooltip: {
      //     valueFormatter: function (value) {
      //       return value + '%';
      //     },
      //   },
      //   animationDelay: function (idx) {
      //     return idx * 100; // 每个数据点动画延迟（实现依次弹入）
      //   },
      //   label: {
      //     show: true,
      //     formatter: '{c}%',
      //   },
      //   // data: [20, 52, 82, 100, 130, 160, 180]
      // },
    ],
    dataZoom: [
      {
        type: 'inside',
      },
      {
        type: 'slider',
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
}

const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '季', value: ETimeDimension.QUARTER },
  { text: '年', value: ETimeDimension.YEAR },
];

export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.MONTH,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().tz().subtract(1, 'day'),
    key: 'date',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { endDim } = getDateRangeDim(searchFormValue.dimension, [value, value]);
      return { time: endDim };
    },
  },
];

export function getWeightedYieldOptions(): EChartsOption {
  return {
    // 图表类型设置为柱状图
    grid: {
      top: 40,
      right: 20,
      bottom: 60,
      left: 60,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
      valueFormatter: value => value + '%',
    },
    legend: {
      bottom: 10,
      borderWidth: 0,
      itemStyle: {
        borderWidth: 0, // 可选：确保图例图标无边框
      },
      textStyle: {
        fontSize: 12, // 调整图例文字大小（可选）
        padding: [0, 0, 0, 0], // 调整文字与图标的间距（左填充 2px）
        lineHeight: 8,
        verticalAlign: 'bottom',
      },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 8,
      icon: 'circle', // 统一使用圆形图标
    },
    xAxis: {
      type: 'category',
      axisPointer: {
        show: true,
      },
      axisLabel: {
        interval: 0,
      },
      boundaryGap: true,
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
          margin: 10,
        },
        splitLine: {
          show: true,
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
          position: 'top', // 标签位置在柱子上方
          formatter: '{c}%', // 格式化显示为 "数值%"
          color: '#000000', // 字体颜色
          fontSize: 12, // 字体大小
          fontWeight: 'bold', // 字体加粗（可选）
        },
      },
    ],
  };
}
