import { ALL_COLUMNS_OPTIONS } from '../config';
import { ECellType, IColumnOptions } from '/@/views/dashboard/types';
import { objectToQueryParams } from '../../../operate/metricsCenter/utils';
import dayjs from 'dayjs';

const getPathUrlMth = ({ record, column, searchFormValue }) => {
  const { dataIndex } = column;
  const year = dataIndex.slice(0, 4);
  const weekNumber = dataIndex.substr(4).replace('WK', '');
  const startOfWeek = dayjs().tz().year(year).week(weekNumber).startOf('week');
  const endOfWeek = dayjs().tz().year(year).week(weekNumber).endOf('week');
  const orgCode = record.orgcode || searchFormValue.orgCode || 'MQ';
  const query = {
    orgCode,
    startDate: startOfWeek.format('YYYY-MM-DD'),
    endDate: endOfWeek.format('YYYY-MM-DD'),
    timeDimension: searchFormValue.timeDimension,
    prodline: record.prodline === 'all' ? '' : record.prodline,
    item: record.item === 'all' ? '' : record.item,
  };
  // 构造路由参数
  const url = `/dashboard/operation/salesRate/detail?${objectToQueryParams(query)}`;
  return url;
};
// 所有字段
const columns: IColumnOptions[] = [
  {
    dataIndex: 'prodline',
    hideBG: true,
    rowSpanProps: 'groupid',
  },
  {
    dataIndex: 'item',
    hideBG: true,
    rowSpanProps: 'groupid',
  },
  {
    dataIndex: 'category',
    hideBG: true,
    filterable: true,
    width: 100,
  },
  {
    dataIndex: 'metric',
    filterable: true,
    width: 120,
  },
  {
    dataIndex: 'vlist',
    cellType: ECellType.LINK,
    getPathUrl: getPathUrlMth,
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex as string],
  ...item,
}));

export const defaultOptionValue = {
  prodline: '',
  item: '',
};
