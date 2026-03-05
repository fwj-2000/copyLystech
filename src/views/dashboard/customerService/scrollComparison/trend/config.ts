import dayjs from 'dayjs';
import echarts from 'echarts';
import { getColumns } from '/@/views/dashboard/customerService/config';

import type { VxeGridPropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';

// 趋势图chart配置
export const trendChartOptions: echarts.EChartsOption = {
  color: ['#4b7bec', '#984cc7', '#efc56c', '#12b081', '#38a7d6', '#957ff6'],
  legend: {
    show: true,
    left: 0,
    top: 0,
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      fontSize: 12,
      color: 'rgba(26, 26, 26, 0.7)',
    },
  },
  tooltip: {
    show: true,
    appendTo: 'body',
  },
  grid: {
    left: 0,
    right: 0,
    top: 36,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    data: [],
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      interval: 0,
      fontSize: 12,
      color: 'rgba(0,0,0,0.6)',
      margin: 12, //刻度标签与轴线之间的距离。
    },
  },
  yAxis: [
    {
      show: true,
      name: '',
      type: 'value',
      min: 0,
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'dashed',
        },
      },
      axisLabel: {
        show: true,
        align: 'right',
      },
    },
    {
      show: true,
      name: '',
      type: 'value',
      nameGap: 12,
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'dashed',
        },
      },
      axisLabel: {
        show: true,
        align: 'right',
      },
    },
  ],
  barWidth: 12,
  barGap: '100%',
};

// 表格字段配置
export const getAllColumns = (
  { currentWeek } = {
    currentWeek: 0,
  },
): VxeGridPropTypes.Columns => {
  const current = dayjs().tz().week(Number.parseInt(currentWeek, 10));
  const lastWeek = current.subtract(1, 'week').week();
  const columns = [
    { field: 'seq' },
    {
      field: 'FourWeekFC',
      title: '四周FC量',
      align: 'center',
      headerClassName: 'last-predict-header',
      children: [
        {
          field: 'LastWeekPredictQuantity',
          title: `WK${lastWeek}四周`,
          headerClassName: 'last-predict-header',
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'CurrentWeekActualQuantity',
          title: `WK${currentWeek}四周`,
          headerClassName: 'last-predict-header',
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'ChangeRate',
          title: '变化率',
          formatter({ cellValue }) {
            return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
          },
          headerClassName: 'last-predict-header',
        },
      ],
    },
    { field: 'CauseAnalysis' },
    { field: 'ProductCategory' },
    { field: 'CustomerCode' },
    { field: 'CustomerPerson' },
    { field: 'OrgName' },
    { field: 'Project' },
    { field: 'ProjectPhase' },
    { field: 'Custprodno' },
    { field: 'InnerMaterialNumber' },
    { field: 'VmiOrJit' },
    { field: 'TradeCurrency' },
  ];
  return getColumns(columns);
};
