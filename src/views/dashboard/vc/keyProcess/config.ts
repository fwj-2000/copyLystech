import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dashboard/utils';
import { getProjectParam, getProcesseparam } from '/@/api/dashbord/operate';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { getBarAndLineChart, timeDimensionOptions } from '/@/views/dashboard/vc/config';

export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.SELECT,
    default: null,
    key: 'dimension',
    attrs: {
      placeholder: '请选择时间维度',
      style: {
        width: '150px',
      },
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: null,
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      console.log(searchFormValue.dimension, 'searchFormValue.dimension');
      const res = searchFormValue.dimension ? { startTime: startDim, endTime: endDim } : { startTime: '', endTime: '' };
      return res;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: '1',
    label: '是否关键工序',
    key: 'isCriticalProcess',
    attrs: {
      placeholder: '请选择',
      allowClear: false,
    },
    options: [
      { text: '全部', value: '0' },
      { text: '是', value: '1' },
      { text: '否', value: '2' },
    ],
    // getParam: value => {
    //   console.log(value, 'searchFormValue.value');
    //   return { isCriticalProcess: value };
    // },
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
export function getLeftSingleChart() {
  return {
    title: {
      // text: 'XTM601', // 替换为你想要的标题文字
      left: 0, // 左对齐
      top: '10%', // 距离顶部 0px（可调整）
      textStyle: {
        color: '#000000', // 标题颜色
        // fontSize: 6,    // 标题字号
        fontWeight: 'none', // 标题加粗（可选）
        rich: {
          // 使用 rich 强制覆盖样式
          a: { fontSize: 12 },
        },
      },
    },
    grid: {
      top: '3%',
      right: '25%',
      bottom: 0,
      left: 0,
    },
    tooltip: {
      show: true,
      formatter: '{b}: {c}%', // 显示进度百分比
      position: 'right',
    },
    xAxis: {
      type: 'value',
      show: false, // 隐藏 x 轴
      max: 100,
      min: 0,
    },
    yAxis: [
      {
        type: 'category',
        // data: ['XTM601'], // 进度条名称
        axisLabel: {
          show: true,
          color: '#000000',
          fontSize: 14,
          opacity: 0.4,
          padding: [0, 0, 0, 0],
          // formatter: function (value, index) {
          //   return [50][index] + '%';
          // },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: { show: false },
        offset: 0,
        position: 'right',
      },
    ],
    series: [
      {
        type: 'bar',
        // data: [50], // 进度条的数值
        barWidth: 31, // 设置进度条宽度
        itemStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#C3D5FF' },
              { offset: 1, color: '#3874FF' },
            ],
          },
          borderWidth: 1,
          borderColor: '#3874FF',
        },
        showBackground: true,
        backgroundStyle: { color: '#D5DBEB' },
      },
    ],
  };
}

export function getCenterLineOptions() {
  return {
    grid: {
      top: 30,
      right: 40,
      bottom: 30,
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
      valueSuffix: '%',
    },
    axisPointer: {
      link: [{ xAxisIndex: 'all' }],
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      // data: ['压伤', '划伤', '侧漏不良', '性能不良', '破真空', '变形', '其他'],
      axisLabel: {
        interval: 0,
        color: '#666',
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#E6E5E5',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E0E0E0',
          },
        },
      },
      {
        type: 'value',
        // min: 0,
        // max: 100,
        axisLabel: {
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
        },
        splitLine: { show: false },
        position: 'left',
      },
    ],
    series: [
      {
        name: '良率',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        // data: [15, 8, 22, 12, 35, 30, 5], // 模拟数据（百分比值）
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: 'white',
          borderColor: '#FF7B00',
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
              { offset: 0.5, color: '#FFD04E' },
              { offset: 1, color: '#FF7B00' },
            ],
          },
          cap: 'round',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + '%';
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0.28, color: 'rgba(255, 130, 7, 0.29)' }, // 28.49% 位置
              { offset: 0.96, color: 'rgba(255, 123, 0, 0)' }, // 96.71% 位置
            ],
          },
        },
        label: {
          show: true,
          formatter: '{c}%',
        },
      },
    ],
  };
}

export function getRightBarChart() {
  return getBarAndLineChart();
}
