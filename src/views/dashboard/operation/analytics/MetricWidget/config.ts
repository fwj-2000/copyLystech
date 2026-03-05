import { EChartsOption } from 'echarts';
import { EColumnsType, IColumnOptions } from '/@/views/dashboard/types';

// 趋势图表配置
export const baseOption: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '0%',
    right: '0%',
    top: '66',
    bottom: '0%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E9E9E9',
          type: 'dashed',
        },
      },
    },
    {
      type: 'value',
    },
  ],
  series: [],
};

// 表格列配置
export const columnOptions: IColumnOptions[] = [
  {
    dataIndex: 'metric',
    title: '指标类型',
    width: 80,
    align: 'left',
    filterable: true,
  },
  {
    dataIndex: 'lastyVlist',
    title: '去年数据',
    width: 60,
    sortable: true,
    type: EColumnsType.DATE_VALUE_LIST,
    headerCellBgColor: '#fcf5ed',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#fcf5ed',
      },
    }),
  },
  {
    dataIndex: 'thisyVlist',
    title: '当年数据',
    sortable: true,
    type: EColumnsType.DATE_VALUE_LIST,
    headerCellBgColor: '#d4e0fb',
    customHeaderCell: () => ({
      style: {
        backgroundColor: '#d4e0fb',
      },
    }),
  },
  {
    dataIndex: 'thisTotal',
    title: '当期',
    width: 60,
    sortable: true,
    // @ts-ignore 设置为auto 取消默认的对齐设置
    align: 'auto',
    customCell: () => {
      return {
        style: 'text-align: right;',
      };
    },
    customHeaderCell: () => ({
      style: {
        'text-align': 'center',
      },
    }),
  },
  {
    dataIndex: 'lastTotal',
    title: '同期',
    width: 60,
    sortable: true,
    // @ts-ignore 设置为auto 取消默认的对齐设置
    align: 'auto',
    customCell: () => {
      return {
        style: 'text-align: right;',
      };
    },
    customHeaderCell: () => ({
      style: {
        'text-align': 'center',
      },
    }),
  },
  {
    dataIndex: 'yearOnyear',
    title: '同比',
    width: 60,
    sortable: true,
    // @ts-ignore 设置为auto 取消默认的对齐设置
    align: 'auto',
    customCell: () => {
      return {
        style: 'text-align: right;',
      };
    },
    customHeaderCell: () => ({
      style: {
        'text-align': 'center',
      },
    }),
  },
  {
    dataIndex: 'yOyRatio',
    title: '同比率',
    width: 60,
    sortable: true,
    // @ts-ignore 设置为auto 取消默认的对齐设置
    align: 'auto',
    customCell: () => {
      return {
        style: 'text-align: right;',
      };
    },
    customHeaderCell: () => ({
      style: {
        'text-align': 'center',
      },
    }),
  },
  {
    dataIndex: 'chainValue',
    title: '环比',
    width: 60,
    sortable: true,
    // @ts-ignore 设置为auto 取消默认的对齐设置
    align: 'auto',
    customCell: () => {
      return {
        style: 'text-align: right;',
      };
    },
    customHeaderCell: () => ({
      style: {
        'text-align': 'center',
      },
    }),
  },
  {
    dataIndex: 'chainRatio',
    title: '环比率',
    width: 60,
    sortable: true,
    // @ts-ignore 设置为auto 取消默认的对齐设置
    align: 'auto',
    customCell: () => {
      return {
        style: 'text-align: right;',
      };
    },
    customHeaderCell: () => ({
      style: {
        'text-align': 'center',
      },
    }),
  },
];
