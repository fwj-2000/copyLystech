// 前端显示配置

import { objectToQueryParams } from '../../metricsCenter/utils';
import { BasicColumn } from '/@/components/Table';
import { thousandsFormat } from '/@/utils/lydc';

// 表格项插槽类型
export enum ETableCellSlotType {
  LINK = 'link',
}
// 表头动态配置类型
export enum EColumnsType {
  NORAML = 'noraml',
  BLOCK = 'block',
  MONTH_LIST = 'monthList', // 动态生成的数据列表
}

interface IBaseInfo extends BasicColumn {
  cellType?: ETableCellSlotType; // 表格项插槽类型
  getPathUrl?: (params: { searchFormValue: any; record: Record<string, any>; column: IBaseInfo }) => string; // 点击单元格跳转的方法
}
// 表头动态配置项
export interface IColumnsOption {
  type?: EColumnsType; // 类型
  baseInfo: IBaseInfo;
  dataIndex: string;
  sortable?: boolean; // 是否可排序
  filterable?: boolean; // 是否可筛选
  isRowSpan?: boolean; // 是否开启合并单元格
}

export const ALLCustomHeaderCellColor = ['rgba(250, 173, 20, 0.2)', 'rgba(24, 144, 255, 0.2)'];

const customValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { title, dataIndex } = column;
    const value = record[dataIndex as string] || 0;
    // const { metric } = record;
    // const rateMetric = [
    //   '边际贡献率', '毛利率', '营运利润率',
    //   '销售毛利率', '税后利润率',
    // ];
    // if (title.includes('占比') || title === '集团' || rateMetric.includes(metric)) {
    //   return `${value.toFixed(1)}%`;
    // }
    // return thousandsFormat(value.toFixed(0));
    return value;
  },
  customCell: (record, _, column) => {
    const { dataIndex } = column?.__originColumn__ || {};
    const value = record[dataIndex as string].replace(',', '').replace('%', '');
    const { sort } = record;
    return {
      style: `${value < 0 ? 'color: red' : ''};${sort.toString().includes('.') ? '' : 'font-weight: bold;background-color: rgba(211,211,211,0.5)'}`,
    };
  },
};
export const allColumnsOptions: Record<string, IColumnsOption> = {
  factory: {
    dataIndex: 'factory',
    baseInfo: {
      title: '厂区',
      width: 80,
      align: 'left',
      customCell: () => {
        return {
          style: { 'font-weight': 'bolder' },
        };
      },
    },
  },
  sort: {
    dataIndex: 'sort',
    baseInfo: {
      title: '序号',
      width: 40,
      // @ts-ignore 这里设为auto才能响应后续的配置
      align: 'auto',
      customCell: (record, _, column) => {
        const value = record[column?.dataIndex as string].toString();
        const { sort } = record;
        return {
          style: {
            'text-align': value.includes('.') ? 'center' : 'left',
            'font-weight': 'bolder',
            ...(!sort.toString().includes('.') ? { 'background-color': 'rgba(211,211,211,0.5)' } : {}),
          },
        };
      },
    },
  },
  metric: {
    dataIndex: 'metric',
    baseInfo: {
      title: '指标',
      width: 80,
      align: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: ({ record, searchFormValue }) => {
        const [startDate, endDate] = searchFormValue.dateRange;
        const query = {
          orgCode: searchFormValue.orgCode,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          timeDimension: searchFormValue.timeDimension,
          metric: record.metricKey,
        };
        // 构造路由参数
        const url = `/dashboard/operate/profitKpi/detail?${objectToQueryParams(query)}`;
        return url;
      },
      customCell: record => {
        const { sort } = record;
        return {
          style: {
            'font-weight': 'bolder',
            ...(!sort.toString().includes('.') ? { 'background-color': 'rgba(211,211,211,0.5)' } : {}),
          },
        };
      },
    },
  },
  monthList: {
    dataIndex: 'monthList',
    type: EColumnsType.MONTH_LIST,
    baseInfo: {
      width: 60,
      align: 'right',
      ...customValueCell,
    },
  },
};

// 周维度字段
export const columnsOptions: BasicColumn[] = [
  // { dataIndex: 'sort' },
  { dataIndex: 'factory' },
  { dataIndex: 'metric' },
  { dataIndex: 'monthList' },
];
