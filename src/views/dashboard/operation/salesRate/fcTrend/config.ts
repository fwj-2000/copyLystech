import dayjs from 'dayjs';
import { objectToQueryParams } from '../../../operate/metricsCenter/utils';
import { ECellType, EColumnsType, IColumnOptions } from '/@/views/dashboard/types';
// import { objectToQueryParams } from '/@views/dashboard/operate/metricsCenter/utils';
import InfoDetail from './infoDetail/index.vue';
import weekOfYear from 'dayjs/plugin/weekOfYear'; // 引入周数插件
dayjs.extend(weekOfYear);
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
    cellType: ECellType.DIALOG,
    dialogCompo: InfoDetail,
    getQuery: ({ record, searchFormValue }) => {
      // console.log('🚀 ~ record, searchFormValue:', record, searchFormValue);
      const orgCode = record.orgcode || searchFormValue.orgCode || 'MQ';
      const { dateRange } = searchFormValue;
      const startDim = dayjs(dateRange[1]).subtract(14, 'week').format('YYYY[WK]ww');
      const endDim = dayjs(dateRange[1]).format('YYYY[WK]ww');
      const query = {
        orgCode,
        prodLine: record.prodline || '',
        item: record.item || '',
        startDim,
        endDim,
      };
      return query;
    },
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
    getCustomCellStyle: (record, _, column) => {
      const { metric } = record;
      const { dataIndex } = column;
      const value = record[dataIndex] ?? '';
      if (metric.includes('变化幅度')) {
        return {
          ...(Number.parseInt(value, 10) < 0 ? { color: 'red !important' } : {}),
        };
      }
      return {};
    },
    getPathUrl: ({ record, searchFormValue, column }) => {
      const { dataIndex } = column;
      const year = dataIndex.slice(0, 4);
      const weekNumber = dataIndex.substr(4).replace('WK', '');
      const startOfWeek = dayjs().tz().year(year).week(weekNumber).startOf('week');
      const { metric = '' } = record;
      const orgCode = record.orgcode || searchFormValue.orgCode || 'MQ';
      const query = {
        orgCode,
        prodline: record.prodline === 'all' ? '' : record.prodline,
        item: record.item === 'all' ? '' : record.item,
        newOldProject: searchFormValue.newOldProject === 'all' ? '' : searchFormValue.newOldProject,
        startDate: startOfWeek.format('YYYY-MM-DD'),
        endDate: startOfWeek.format('YYYY-MM-DD'),
        ...(metric === '变化超30%料件数' ? { rangeUp30: true } : {}),
        timeDimension: searchFormValue.timeDimension,
      };
      // 构造路由参数
      const url = `/dashboard/operation/salesRate/fcTrend/detail?${objectToQueryParams(query)}`;
      return url;
    },
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex],
  ...item,
}));
