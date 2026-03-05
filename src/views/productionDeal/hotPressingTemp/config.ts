import { EChartsOption } from 'echarts';
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';

import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const dates = ref<[Dayjs, Dayjs]>();

export const getFormConfig = () => {
  return [
    {
      fieldName: 'pickerVal',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        // allowClear: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: {
          defaultValue: [dayjs('08:00:00', 'HH:mm:ss'), dayjs('08:00:00', 'HH:mm:ss')],
        },
        disabledDate: (current: Dayjs) => {
          if (!dates.value || (dates.value as any).length === 0) {
            return false;
          }

          // 获取当前选择的开始日期和结束日期
          const startDate = dates.value[0];
          const endDate = dates.value[1];

          // 计算天数差时忽略时间部分，只比较日期
          const getDayStart = (date: Dayjs) => dayjs(date).hour(0).minute(0).second(0);
          const currentDayStart = getDayStart(current);

          // 场景1: 已经选择了开始日期，但未选择结束日期
          // 结束日期只能是开始日期当天或后一天
          if (startDate && !endDate) {
            const startDayStart = getDayStart(startDate);
            const daysDiff = currentDayStart.diff(startDayStart, 'days');
            // 禁用开始日期前的所有日期和开始日期后超过1天的日期
            return daysDiff < 0 || daysDiff > 1;
          }

          // 场景2: 已经选择了结束日期，但未选择开始日期
          // 开始日期只能是结束日期当天或前一天
          if (!startDate && endDate) {
            const endDayStart = getDayStart(endDate);
            const daysDiff = endDayStart.diff(currentDayStart, 'days');
            // 禁用结束日期前超过1天的日期和结束日期后的所有日期
            return daysDiff < 0 || daysDiff > 1;
          }

          // 场景3: 开始日期和结束日期都已选择
          // 禁用除了已选日期范围内的所有日期
          if (startDate && endDate) {
            const startDayStart = getDayStart(startDate);
            const endDayStart = getDayStart(endDate);
            // 禁用开始日期之前和结束日期之后的所有日期
            return currentDayStart.isBefore(startDayStart) || currentDayStart.isAfter(endDayStart);
          }
          return false;
        },
        onCalendarChange: (val: [Dayjs, Dayjs]) => {
          dates.value = val;
        },
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      },
    },
    {
      label: '',
      fieldName: 'addr',
      i18nField: 'machineNo',
      component: 'Select',
      componentProps: {
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'classes',
      i18nField: 'classesName',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: t('dict.ClassesName.1'), value: '1' },
          { label: t('dict.ClassesName.2'), value: '2' },
        ],
      },
    },
    {
      label: '',
      fieldName: 'isAbnormal', //是否异常
      component: 'Select',
      componentProps: {
        options: [
          { label: t('dict.isAssembleName.1'), value: '1' },
          { label: t('dict.isAssembleName.2'), value: '0' },
        ],
        allowClear: true,
      },
    },
  ];
};

// 主页表格column配置
export const getPageColumns = () => {
  return [
    {
      width: 100,
      title: '机台号',
      field: 'machineNo',
    },
    {
      width: 100,
      title: '班次',
      field: 'classesName',
    },
    {
      width: 100,
      title: '最高温',
      field: 'maxTemperature',
    },
    {
      width: 100,
      title: '最低温',
      field: 'minTemperature',
    },
    {
      width: 104,
      title: '保压时间（秒）',
      field: 'dwellTime',
    },
    {
      width: 140,
      title: '数据记录时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      sortable: true,
    },
    {
      width: 140,
      title: '数据上传编号',
      field: 'dataNo',
    },
    {
      title: '备注',
      field: 'remark',
    },
  ];
};

export const lineChartOptions = (): EChartsOption => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    grid: {
      top: 40,
      right: 100,
      left: 100,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        color: '#333',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#333',
        fontSize: 12,
        formatter: '{value}°C',
      },
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '实际温度',
        type: 'line',
        symbol: 'emptyCircle',
        symbolSize: 6,

        // 注： 修改 lineStyle 中的颜色不会影响图例颜色，如果需要图例颜色和折线图颜色一致，需修改 itemStyle.color，线条颜色默认也会取该颜色。
        lineStyle: {
          width: 4,
        },
        // 拐点 样式。
        itemStyle: {
          color: '#ff7b00',
        },

        markLine: {
          symbol: 'none',

          data: [
            {
              // type: 'max', //min max
              name: '温度上限',
              lineStyle: {
                width: 1.5,
                type: 'dashed',
                color: 'red',
              },
              label: {
                position: 'end',
                formatter: '{b}: {c}°C',
              },
            },
          ],
        },
      },
    ],
  };
};

export const dataMock = {
  temperatureData: [
    30.1447,

    30.3317,

    30.2817,

    30.5764,

    30.4403,

    30.5519,

    30.5262,

    30.5925,

    30.5582,

    30.6392,

    30.559,

    30.5258,

    30.4857,

    30.4825,

    30.5247,

    30.4668,

    30.466,

    30.5286,

    30.4528,

    30.5522,

    30.4248,

    30.3656,

    30.3362,

    30.3185,

    30.2941,

    30.2749,

    30.2687,

    30.325,

    30.2206,

    30.5695,

    30.1781,

    30.2322,

    30.2744,

    30.2719,

    30.418,

    30.4179,

    30.3084,

    30.3672,

    30.3577,

    30.3747,

    30.3847,

    30.1721,

    30.1682,

    30.2602,

    30.3002,

    30.0488,

    30.0266,

    30.0818,

    30.1225,

    30.0578,

    29.9955,

    30.0456,
  ],

  categories: [
    '2025-10-29 15:54:39',

    '2025-10-29 15:54:49',

    '2025-10-29 15:55:10',

    '2025-10-29 16:02:17',

    '2025-10-29 16:03:15',

    '2025-10-29 16:04:03',

    '2025-10-29 16:05:04',

    '2025-10-29 16:05:55',

    '2025-10-29 16:06:56',

    '2025-10-29 16:08:45',

    '2025-10-29 16:09:41',

    '2025-10-29 16:11:17',

    '2025-10-29 16:12:24',

    '2025-10-29 16:13:16',

    '2025-10-29 16:14:06',

    '2025-10-29 16:16:52',

    '2025-10-29 16:17:39',

    '2025-10-29 16:18:31',

    '2025-10-29 16:19:21',

    '2025-10-29 16:20:12',

    '2025-10-29 16:21:02',

    '2025-10-29 16:21:55',

    '2025-10-29 16:22:44',

    '2025-10-29 16:23:37',

    '2025-10-29 16:24:32',

    '2025-10-29 16:25:27',

    '2025-10-29 16:26:22',

    '2025-10-29 16:27:19',

    '2025-10-29 16:28:14',

    '2025-10-29 16:29:15',

    '2025-10-29 16:30:05',

    '2025-10-29 16:31:52',

    '2025-10-29 16:32:45',

    '2025-10-29 16:33:35',

    '2025-10-29 16:34:28',

    '2025-10-29 16:35:17',

    '2025-10-29 16:36:08',

    '2025-10-29 16:37:07',

    '2025-10-29 16:38:00',

    '2025-10-29 16:38:51',

    '2025-10-29 16:40:00',

    '2025-10-29 16:40:51',

    '2025-10-29 16:41:42',

    '2025-10-29 16:42:43',

    '2025-10-29 16:43:36',

    '2025-10-29 16:44:40',

    '2025-10-29 16:45:44',

    '2025-10-29 16:46:40',

    '2025-10-29 16:47:44',

    '2025-10-29 16:48:44',

    '2025-10-29 16:49:36',

    '2025-10-29 16:50:30',
  ],

  upperLimit: 68,
};
