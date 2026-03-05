import echarts from 'echarts';
import { getColumns } from '/@/views/dashboard/customerService/config';

import { VxeGridPropTypes } from 'vxe-table';

// 柱状图覆盖封装series配置
export const selfSeriesOption: echarts.SeriesOption = {
  label: {
    show: true,
    position: 'top',
    distance: 2,
  },
};
// 柱状图配置
export const barChartOptions: echarts.EChartsOption = {
  tooltip: {
    show: true,
    appendToBody: true,
  },
  grid: {
    left: 0,
    right: 0,
    top: 16,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        width: 1,
        color: 'rgba(230, 230, 230, 1)',
      },
    },
    axisLabel: {
      show: true,
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },
  yAxis: {
    show: true,
    name: '',
    nameGap: 12,
    min: 0,
    nameTextStyle: {
      align: 'right',
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'dashed',
      },
    },
    axisLabel: {
      show: true,
    },
  },
  barGap: '100%',
};

// 饼图颜色
export const colors = ['#EFC56C', '#588DB9', '#E08D73', '#58A7B9', '#9346F2', '#20B787', '#46AAF2', '#EFC56C', '#588DB9', '#E08D73', '#EFC56C'];

// 饼图配置
export const basePieOptions = {
  credits: {
    enabled: false, // 设置为false以禁用版权信息
  },
  accessibility: {
    enabled: false,
  },
  legend: {
    // 图例配置
    enabled: false,
  },
  chart: {
    type: 'pie3d',
    margin: [0, 0, 0, 0], // 顶部边距设为0
    // sapcing: [0, 0, 0, 0], // 顶部边距设为0
    options3d: {
      enabled: true,
      alpha: 60,
      beta: 0,
    },
  },
  title: {
    text: '',
  },
  tooltip: {
    enabled: true,
    outside: true,
    followPointer: false,
    headerFormat: '',
    // pointFormat: getPieTooltipHtmlStr(),
    // pointFormat: '{point.percentage:.2f}%',
    pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%',
    footerFormat: '',
    useHTML: true,
    hideDelay: 200,
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      depth: 15,
      dataLabels: {
        enabled: false,
        softConnector: true,
        distance: 1,
        allowOverlap: true,
        connectorPadding: 0,
        format: '{point.name}: {point.y}',
      },
    },
  },
  series: [
    {
      type: 'pie',
      startAngle: 30,
      data: [],
    },
  ],
};

// 明细表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    { field: 'seq' },
    {
      field: 'CustomerPerson',
    },
    {
      field: 'CustomerCode',
    },
    {
      field: 'CauseAnalysis',
    },
    {
      field: 'OrgName',
    },
    {
      field: 'Project',
    },
    {
      field: 'ProjectPhase',
    },
    {
      field: 'ProductCategory',
    },
    {
      field: 'Custprodno',
    },
    {
      field: 'InnerMaterialNumber',
    },
    {
      field: 'VmiOrJit',
    },
    {
      field: 'TradeCurrency',
    },
  ];
  return getColumns(columns);
};
