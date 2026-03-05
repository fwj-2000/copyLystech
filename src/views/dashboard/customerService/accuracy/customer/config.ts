import echarts from 'echarts';
import { getColumns } from '/@/views/dashboard/customerService/config';
import { getDimensionName, getLastDimensionNum, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

import { ETimeDimension } from '/@/views/dashboard/customerService/types';
import type { VxeGridPropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';

// 趋势图chart配置
export const trendChartOptions: echarts.EChartsOption = {
  title: {
    left: 0,
    top: 0,
    text: '料件：个',
    textStyle: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.4)',
    },
  },
  legend: {
    show: true,
    left: 64,
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
    top: 46,
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
      color: 'rgba(0,0,0,0.4)',
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
        formatter: '{value}%',
        align: 'right',
      },
    },
  ],
  dataZoom: {
    type: 'inside',
    zoomLock: true,
    startValue: 0,
    endValue: 15,
  },
  barWidth: 12,
  barGap: '100%',
};

// 表格字段配置
export const getAllColumns = (
  {
    currentNum,
    dimension,
  }: {
    currentNum: string | number;
    dimension: ETimeDimension;
  } = {
    currentNum: 2,
    dimension: ETimeDimension.WEEK,
  },
): VxeGridPropTypes.Columns => {
  const last = getLastDimensionNum({
    dimension,
    currentNum,
  });
  const lastMetricName = getMetricNameByDimension({
    dimension,
    value: last,
  });
  const currentMetricName = getMetricNameByDimension({
    dimension,
    value: currentNum,
  });
  const currentName = getDimensionName({
    type: 'current',
    dimension,
  });
  const columns = [
    { field: 'seq' },
    { field: 'CustomerPerson' },
    { field: 'CustomerCode' },
    {
      field: 'FourWeekFC',
      title: '数量',
      align: 'center',
      headerClassName: 'last-predict-header',
      children: [
        {
          field: 'LastQuantity',
          title: `${lastMetricName}预测${currentMetricName}`,
          headerClassName: 'last-predict-header',
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'CurrentQuantity',
          title: `${currentMetricName}${currentName}`,
          headerClassName: 'last-predict-header',
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'ChangeRateQuantity',
          title: '变化率',
          formatter({ cellValue }) {
            return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
          },
          headerClassName: 'last-predict-header',
        },
      ],
    },
    { field: 'CauseAnalysis' },
    { field: 'OrgName' },
    { field: 'Project' },
    { field: 'ProjectPhase' },
    { field: 'ProductCategory' },
    { field: 'Custprodno' },
    { field: 'InnerMaterialNumber' },
    { field: 'VmiOrJit' },
    { field: 'TradeCurrency' },
  ];
  return getColumns(columns);
};
