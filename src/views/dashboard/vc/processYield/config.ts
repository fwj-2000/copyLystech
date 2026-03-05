import { EChartsOption } from 'echarts';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dashboard/utils';
import { getProjectParam, getProcesseparam } from '/@/api/dashbord/operate';

enum ETimeDimension {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
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
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    default: true,
    label: '是否关键工序',
    key: 'isCriticalProcess',
    attrs: {
      placeholder: '请选择',
      allowClear: false,
    },
    options: [
      { text: '是', value: true },
      { text: '否', value: false },
    ],
    getParam: value => {
      return { isCriticalProcess: value };
    },
  },
  {
    label: '项目',
    type: EFormItemType.SELECT,
    default: [],
    key: 'project',
    attrs: {
      mode: 'multiple',
      placeholder: '请选择',
    },
    options: [],
    getOptions: async () => {
      const { data } = await getProjectParam({});
      // debugger;
      const handleList = Object.keys(data).map(key => {
        return {
          text: data[key],
          value: data[key],
        };
      });
      return handleList;
    },
    getParam: value => {
      return { project: value.length > 0 ? value.join(';') : '' };
    },
  },
  {
    label: '工序',
    type: EFormItemType.SELECT,
    default: [],
    key: 'processe',
    attrs: {
      mode: 'multiple',
      placeholder: '请选择',
      showSearch: true,
    },
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getProcesseparam({ IsCriticalProcess: '1' });
      // 将结果处理成下拉菜单的属性
      const handleList = Object.keys(data).map(key => {
        return {
          text: data[key],
          value: data[key],
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
    getParam: value => {
      return { processe: value.length > 0 ? value.join(';') : '' };
    },
  },
];

export function getProcessesChart(): EChartsOption {
  return {
    // 图表类型设置为柱状图
    grid: {
      top: 40,
      right: 40,
      bottom: 65,
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
        min: 0,
        max: 100,
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
          },
        },
        // position: 'right',
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
          position: 'top', // 标签位置在柱子上方
          formatter: '{c}%', // 格式化显示为 "数值%"
          color: '#000000', // 字体颜色
          fontSize: 12, // 字体大小
          fontWeight: 'bold', // 字体加粗（可选）
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        bottom: 5,
        startValue: 0,
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
