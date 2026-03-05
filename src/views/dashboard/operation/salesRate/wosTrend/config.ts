import dayjs from 'dayjs';
import { objectToQueryParams } from '../../../operate/metricsCenter/utils';
import { ECellType, EColumnsType, IColumnOptions } from '/@/views/dashboard/types';
// import { objectToQueryParams } from '/@views/dashboard/operate/metricsCenter/utils';

export const ALL_COLUMNS_OPTIONS = {
  // 主要报表
  category: { width: 80, title: '类型', isRowSpan: true },
  metric: { width: 120, title: '指标' },
  vlist: { width: 80, type: EColumnsType.DATE_VALUE_LIST },
  // 分组表格
  prodline: { width: 80, title: '产品线', isRowSpan: true, rowSpanProps: 'combine' },
  item: { width: 80, title: '项目', isRowSpan: true, rowSpanProps: 'combine' },
};

// 首页-所有字段
const columns = [
  {
    dataIndex: 'prodline',
    width: 80,
    hideBG: true,
    resize: false,
  },
  {
    dataIndex: 'item',
    width: 80,
    hideBG: true,
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
    cellType: ECellType.LINK,
    getCustomCellStyle: record => {
      const { metric } = record;
      return {
        ...(['量产呆滞', 'NPI呆滞'].includes(metric) ? { color: 'red !important' } : {}),
        ...(['量产汇总'].includes(metric) ? { 'font-weight': 'bold !important' } : {}),
      };
    },
    getPathUrl: ({ record, searchFormValue, column }) => {
      const { dataIndex } = column;
      const { category, metric } = record;
      const year = dataIndex.slice(0, 4);
      const weekNumber = dataIndex.substr(4).replace('WK', '');
      const startOfWeek = dayjs().year(year).week(weekNumber).startOf('week');
      const categoryType = category.includes('+在制') ? 'zzType' : 'cpType';
      const orgCode = record.orgcode || 'MQ';
      const query = {
        orgCode,
        prodline: record.prodline === 'all' ? '' : record.prodline,
        item: record.item === 'all' ? '' : record.item,
        newOldProject: searchFormValue.newOldProject === 'all' ? '' : searchFormValue.newOldProject,
        startDate: startOfWeek.format('YYYY-MM-DD'),
        endDate: startOfWeek.format('YYYY-MM-DD'),
        timeDimension: searchFormValue.timeDimension,
        status: metric,
        categoryType,
      };
      // 构造路由参数
      const url = `/dashboard/operation/salesRate/wosTrend/detail?${objectToQueryParams(query)}`;
      return url;
    },
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex],
  ...item,
}));
