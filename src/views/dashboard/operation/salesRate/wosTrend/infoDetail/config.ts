import { EColumnsType, IColumnOptions } from '/@/views/dashboard/types';

export const ALL_COLUMNS_OPTIONS = {
  // 主要报表
  category: { width: 80, title: '类型', isRowSpan: true },
  metric: { width: 120, title: '指标' },
  vlist: { width: 80, type: EColumnsType.DATE_VALUE_LIST },
  // 分组表格
  prodline: { width: 80, title: '产品线', isRowSpan: true },
  item: { width: 80, title: '项目', isRowSpan: true },
};

// 首页-所有字段
const columns = [
  {
    dataIndex: 'prodline',
    width: 80,
    resize: false,
  },
  {
    dataIndex: 'item',
    width: 80,
    resize: false,
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
    dataIndex: 'vlist',
    width: 90,
    resize: false,
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex],
  ...item,
}));
