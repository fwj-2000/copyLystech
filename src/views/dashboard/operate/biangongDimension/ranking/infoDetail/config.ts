import { EColumnsType, IColumnOptions } from '/@/views/dashboard/types';
import { thousandsFormat } from '/@/utils/lydc';
import { BasicColumn } from '/@/components/Table';

const customValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { dataIndex } = column;
    const { metric } = record;
    const valueStr = record[dataIndex as string];
    if (!valueStr && valueStr !== 0) {
      return valueStr;
    }
    const value = Number.parseFloat(record[dataIndex as string] || 0);
    // return value;
    if (['成品产值(万)', '损失额(万)'].includes(metric)) {
      return `${thousandsFormat(value.toFixed(2))}`;
    }
    return `${value.toFixed(1)}%`;
  },
  customCell: (record, _, column) => {
    const { metric } = record;
    const value = record[column?.dataIndex as string];
    const percentageValue = Number.parseFloat(value);
    let style = '';
    if (['损失额', '差异'].includes(metric)) {
      style = 'background-color: #e9e9e9;';
    }
    return {
      style: `${style}${percentageValue < 0 ? 'color: red' : ''};`,
    };
  },
};

// 周维度字段
export const weekColumnsOptions: BasicColumn[] = [
  { dataIndex: 'dimesionType' },
  { dataIndex: 'category' },
  {
    dataIndex: 'metric',
  },
  { dataIndex: 'vList' },
];

export const ALL_COLUMNS_OPTIONS = {
  dimesionType: {
    type: EColumnsType.DIMENTION_LIST,
    width: 80,
    isRowSpan: true,
  },
  category: {
    title: '指标',
    width: 80,
    align: 'center',
    isRowSpan: true,
  },
  metric: {
    title: '类目',
    width: 80,
    align: 'center',
    isRowSpan: true,
  },
  vList: {
    type: EColumnsType.WEEK_VALUE_LIST,
    width: 80,
    align: 'right',
    ...customValueCell,
    sortable: true,
  },
};

// 首页-所有字段
const columns = [
  {
    dataIndex: 'dimesionType',
    width: 100,
    resize: false,
    filterable: true,
    hideBG: true, // 是否隐藏背景色
  },
  {
    dataIndex: 'category',
    width: 100,
    resize: false,
    filterable: true,
  },
  {
    dataIndex: 'metric',
    width: 140,
    resize: false,
    filterable: true,
  },
  {
    dataIndex: 'vList',
    width: 90,
    resize: false,
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex],
  ...item,
}));
