import { useI18n } from '/@/hooks/web/useI18n';
import { EChartsOption } from 'echarts';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { timeDimensionOptions } from '/@/views/dashboard/vc/config';
import { getDateRangeDim } from '/@/views/dashboard/utils';
import { getProjectParam } from '/@/api/dashbord/operate';
import dayjs from 'dayjs';
import { getDateDim } from '/@/views/dashboard/utils';
import XEUtils from 'xe-utils';
const { t } = useI18n();
export const commonOptions: TFormItemOption[] = [
  {
    label: '',
    type: EFormItemType.SELECT,
    default: '',
    key: 'project',
    attrs: {
      placeholder: t('dict.keyProcess.project'),
    },
    options: [],
    getOptions: async () => {
      const { data } = await getProjectParam({});
      const handleList = Object.keys(data).map(key => {
        return {
          text: data[key],
          value: data[key],
        };
      });
      return handleList;
    },
    isOverrideDefault: true,
    setDefault: options => {
      return options[0] ? options[0].value : '';
    },
    // getParam: value => {
    //   return { project: value.length > 0 ? value.join(';') : '' };
    // },
  },
  // {
  //   type: EFormItemType.DATE_PICKER,
  //   default: dayjs().subtract(1, 'week'),
  //   key: 'week',
  //   attrs: {
  //     picker: 'week',
  //   },
  //   getParam: value => {
  //     // console.log(value, 'value');
  //     const dateDim = getDateDim(value);
  //     return { week: dateDim };
  //   },
  // },
  {
    type: EFormItemType.SELECT,
    default: null,
    key: 'dimension',
    attrs: {
      // placeholder: '请选择时间维度',
      placeholder: t('dict.IdgeneratorRule.dateType'),
      style: {
        width: '150px',
      },
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startTime: startDim, endTime: endDim };
    },
  },
];
export function getColumns() {
  return [
    {
      title: t('mILManage.badItem'),
      field: 'badItem',
      minWidth: 120,
    },
    {
      title: t('dict.MoldRepairApplyColumn.defectRate'),
      field: 'badRate',
      minWidth: 70,
      formatter: ({ cellValue }) => {
        return `${XEUtils.toFixed(cellValue * 100, 1)}%`;
      },
    },
    {
      title: '不良趋势',
      field: 'yield',
      width: 500,
      slots: { default: 'yield' },
    },
    {
      title: t('dict.MoldRepairApplyColumn.causeAnalysis'),
      field: 'analysis',
      showOverflow: false,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 3, maxRows: 3 },
        },
      },
    },
    {
      title: t('component.upload.imgUpload'),
      field: 'imageList',
      width: 300,
      slots: { default: 'imageList' },
    },
    {
      title: t('mILManage.interimMeasures'),
      field: 'interimAction',
      showOverflow: false,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 3, maxRows: 3 },
        },
      },
    },
    {
      title: t('mILManage.correctiveAction'),
      field: 'correctiveAction',
      showOverflow: false,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 3, maxRows: 3 },
        },
      },
    },
    {
      title: t('mILManage.preventiveMeasures'),
      field: 'preventive',
      showOverflow: false,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 3, maxRows: 3 },
        },
      },
    },
    {
      title: t('dict.ProblemReleaseColumn.dutyUserName'),
      field: 'person',
      editRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.CommonCol.successTime'),
      field: 'completionTime',
      editRender: {
        name: 'DatePicker',
        props: { valueFormat: 'YYYY-MM-DD' },
      },
    },
  ];
}

export function getLineOptions(): EChartsOption {
  return {
    grid: {
      top: 30,
      right: 40,
      bottom: 20,
      left: 40,
    },
    tooltip: {
      // position: ['30%', '10%'],
      confine: true, //是否将 tooltip 框限制在图表的区域内。
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
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
        show: false,
        type: 'value',
        interval: 500,
        axisLabel: {
          color: '#000000',
          fontSize: 12,
          opacity: 0.4,
        },
        splitLine: {
          show: false,
          lineStyle: {
            show: false,
            type: 'dashed', // 虚线样式
            color: '#E0E0E0', // 分隔线颜色（浅灰色）
            width: 1, // 分隔线粗细
            dashOffset: 0, // 虚线起始偏移（可选）
          },
        },
      },
      {
        show: false,
        type: 'value',
        interval: 50,
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
          color: '#000000', // 字体颜色
          fontSize: 10, // 字体大小
        },
      },
      {
        name: '不良率',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'emptyCircle',
        smooth: true,
        symbolSize: 6,
        itemStyle: {
          color: '#FF7B00',
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
        label: {
          show: true, // 显示标签
          position: 'top', // 标签位置在柱子上方
          color: '#000000', // 字体颜色
          fontSize: 10, // 字体大小
          formatter: '{c}%',
        },
        animationDelay: function (idx) {
          return idx * 100; // 每个数据点动画延迟（实现依次弹入）
        },
      },
    ],
  };
}
