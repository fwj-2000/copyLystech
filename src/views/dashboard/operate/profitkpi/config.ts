// 前端显示配置
import dayjs from 'dayjs';
import { objectToQueryParams } from '../metricsCenter/utils';
import { BasicColumn } from '/@/components/Table';
import { thousandsFormat } from '/@/utils/lydc';
import { TimeDimension } from '../types';

// 表格项插槽类型
export enum ETableCellSlotType {
  LINK = 'link',
}
// 表头动态配置类型
export enum EColumnsType {
  NORAML = 'noraml',
  BLOCK = 'block',
  MONTH_LIST = 'monthList', // 动态生成的数据列表
  WEEK_LIST = 'weekList', // 动态生成的周数据列表
}

interface IBaseInfo extends BasicColumn {
  cellType?: ETableCellSlotType; // 表格项插槽类型
  getPathUrl?: (params: { searchFormValue: any; record: Record<string, any>; column: IBaseInfo }) => string; // 点击单元格跳转的方法
}
// 表头动态配置项
export interface IColumnsOption {
  type?: EColumnsType; // 类型
  baseInfo: IBaseInfo;
  dataIndex?: string;
  sortable?: boolean; // 是否可排序
  filterable?: boolean; // 是否可筛选
  isRowSpan?: boolean; // 是否开启合并单元格
}

export const ALLCustomHeaderCellColor = ['rgba(250, 173, 20, 0.2)', 'rgba(24, 144, 255, 0.2)'];

export const ALLWEEKCellColor = ['rgba(82, 196, 26, 0.2)', 'rgba(82, 196, 26, 0.3)'];

const customValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { title, customTitle, dataIndex } = column as any;
    const value = record[dataIndex as string] || 0;
    const { metric } = record;
    const rateMetric = ['边际贡献率', '毛利率', '营运利润率', '销售毛利率', '税后利润率'];
    const colTitle = title ?? customTitle;
    if (colTitle.includes('%') || colTitle.includes('占比') || colTitle === '集团' || rateMetric.includes(metric)) {
      return `${value.toFixed(1)}%`;
    }
    return thousandsFormat(value.toFixed(0));
  },
  customCell: (record, _, column) => {
    const { dataIndex } = column?.__originColumn__ || {};
    const value = record[dataIndex as string];
    const { sort } = record;
    return {
      style: `${value < 0 ? 'color: red' : ''};${sort.toString().includes('.') ? '' : 'font-weight: bold;background-color: #e9e9e9'}`,
    };
  },
};
export const allColumnsOptions: Record<string, IColumnsOption> = {
  sort: {
    dataIndex: 'sort',
    baseInfo: {
      title: '序号',
      fixed: 'left',
      width: 60,
      // @ts-ignore 这里设为auto才能响应后续的配置
      align: 'auto',
      customCell: (record, _, column) => {
        const value = record[column?.dataIndex as string].toString();
        const { sort } = record;
        return {
          style: {
            'text-align': value.includes('.') ? 'center' : 'left',
            'font-weight': 'bolder',
            ...(!sort.toString().includes('.') ? { 'background-color': '#e9e9e9' } : {}),
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
      fixed: 'left',
      align: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: ({ record, searchFormValue }) => {
        if (searchFormValue.timeDimension === TimeDimension.WEEK) {
          return ''; // 暂时屏蔽周损益
        }
        // 非bg层无法查看10以下的指标排名
        if (searchFormValue.orgCode !== 'MQ' && record.sort >= 10) {
          return '';
        }
        const [startDate, endDate] = searchFormValue.dateRange;
        const query = {
          orgCode: searchFormValue.orgCode,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          timeDimension: searchFormValue.timeDimension,
          metric: record.metricKey,
          dimension: searchFormValue.dimension,
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
            ...(!sort.toString().includes('.') ? { 'background-color': '#e9e9e9' } : {}),
          },
        };
      },
    },
  },
  monthList: {
    dataIndex: 'monthList',
    type: EColumnsType.MONTH_LIST,
    baseInfo: {
      width: 80,
      align: 'right',
      ...customValueCell,
    },
  },
  // 周维度字段
  bg: {
    baseInfo: {
      width: 80,
      title: '本周环比',
      align: 'left',
      ...customValueCell,
    },
  },
  actualChainThis: {
    baseInfo: {
      width: 80,
      title: '本周环比',
      align: 'left',
      ...customValueCell,
    },
  },
  actualChainThisPropor: {
    baseInfo: {
      width: 80,
      title: '本周占比环比',
      align: 'left',
      ...customValueCell,
    },
  },
  actualChainLast: {
    baseInfo: {
      width: 80,
      title: '上周环比',
      align: 'left',
      ...customValueCell,
    },
  },
  actualChainLastPropor: {
    baseInfo: {
      width: 80,
      title: '上周占比环比',
      align: 'left',
      ...customValueCell,
    },
  },
  actualChainBalance: {
    baseInfo: {
      width: 80,
      title: '环比差额',
      align: 'left',
      ...customValueCell,
    },
  },
  actualChainDifferen: {
    baseInfo: {
      width: 80,
      title: '环比差异',
      align: 'left',
      ...customValueCell,
    },
  },
  weekGoals: {
    baseInfo: {
      width: 80,
      title: '周目标',
      align: 'left',
      ...customValueCell,
    },
  },
  weekGoalsPropor: {
    baseInfo: {
      width: 80,
      title: '周目标占比',
      align: 'left',
      ...customValueCell,
    },
  },
  weekGoalsBalance: {
    baseInfo: {
      width: 80,
      title: '周目标差额',
      align: 'left',
      ...customValueCell,
    },
  },
  weekGoalsDifferen: {
    baseInfo: {
      width: 80,
      title: '周目标差异',
      align: 'left',
      ...customValueCell,
    },
  },
  monthWeekGoalsTotal: {
    baseInfo: {
      width: 80,
      title: '月目标中的周累计',
      align: 'left',
      ...customValueCell,
    },
  },
  monthWeekGoalsTotalPropor: {
    baseInfo: {
      width: 80,
      title: '月目标中的周累计占比',
      align: 'left',
      ...customValueCell,
    },
  },
  monthGoals: {
    baseInfo: {
      width: 80,
      title: '月目标',
      align: 'left',
      ...customValueCell,
    },
  },
  monthGoalsPropor: {
    baseInfo: {
      width: 80,
      title: '月目标占比',
      align: 'left',
      ...customValueCell,
    },
  },
  monthGoalsBalance: {
    baseInfo: {
      width: 80,
      title: '月目标差额',
      align: 'left',
      ...customValueCell,
    },
  },
  monthGoalsDifferen: {
    baseInfo: {
      width: 80,
      title: '月目标差异',
      align: 'left',
      ...customValueCell,
    },
  },
  thisYearOnYear: {
    baseInfo: {
      width: 80,
      title: '本年度同比',
      align: 'left',
      ...customValueCell,
    },
  },
  thisYearOnYearPropor: {
    baseInfo: {
      width: 80,
      title: '本年度占比',
      align: 'left',
      ...customValueCell,
    },
  },
  lastYearOnYear: {
    baseInfo: {
      width: 80,
      title: '去年度同比',
      align: 'left',
      ...customValueCell,
    },
  },
  lastYearOnYearPropor: {
    baseInfo: {
      width: 80,
      title: '去年度占比',
      align: 'left',
      ...customValueCell,
    },
  },
  yearOnYearBalance: {
    baseInfo: {
      width: 80,
      title: '同比差额(本年度-去年度)',
      align: 'left',
      ...customValueCell,
    },
  },
  yearOnYearDifferen: {
    baseInfo: {
      width: 80,
      title: '同比差异',
      align: 'left',
      ...customValueCell,
    },
  },
  weekList: {
    type: EColumnsType.WEEK_LIST,
    baseInfo: {
      width: 80,
      align: 'right',
      ...customValueCell,
    },
  },
};

// 月维度字段
export const monthColumnsOptions: BasicColumn[] = [{ dataIndex: 'sort' }, { dataIndex: 'metric' }, { dataIndex: 'monthList' }];

// 周维度字段
export const getWeekColumnsOptions = (searchFormValue: any, data: any): BasicColumn[] => {
  const [, endDate] = searchFormValue.dateRange;
  const currentYear = endDate.year();
  const lastYear = endDate.subtract(1, 'year').year();
  const endWeekStr = `WK${endDate.week().toString().padStart(2, '0')}`;
  let endLastWeekStr = endWeekStr;
  if (endWeekStr != 'WK01') endLastWeekStr = `WK${endDate.subtract(1, 'week').week().toString().padStart(2, '0')}`;

  const { monthKey } = data[0] || { monthKey: '' };
  return [
    { dataIndex: 'sort' },
    { dataIndex: 'metric' },
    {
      title: `${endWeekStr}实际环比`,
      customHeaderCell: () => ({
        style: {
          backgroundColor: ALLCustomHeaderCellColor[0],
        },
      }),
      children: [
        { title: endWeekStr, dataIndex: 'actualChainThis' },
        { title: '占产值%', dataIndex: 'actualChainThisPropor' },
        { title: endLastWeekStr, dataIndex: 'actualChainLast' },
        { title: '占产值%', dataIndex: 'actualChainLastPropor' },
        { title: '环比差额', dataIndex: 'actualChainBalance' },
        { title: '占比', dataIndex: 'actualChainDifferen' },
      ],
    },
    {
      title: `${endWeekStr}目标达成`,
      customHeaderCell: () => ({
        style: {
          backgroundColor: ALLCustomHeaderCellColor[1],
        },
      }),
      children: [
        { title: endWeekStr, dataIndex: 'actualChainThis' },
        { title: '占产值%', dataIndex: 'actualChainThisPropor' },
        { title: '目标', dataIndex: 'weekGoals' },
        { title: '占产值%', dataIndex: 'weekGoalsPropor' },
        { title: '差额', dataIndex: 'weekGoalsBalance' },
        { title: '占比', dataIndex: 'weekGoalsDifferen' },
      ],
    },
    {
      title: `${monthKey}目标达成`,
      customHeaderCell: () => ({
        style: {
          backgroundColor: ALLCustomHeaderCellColor[0],
        },
      }),
      children: [
        { title: '周累计', dataIndex: 'monthWeekGoalsTotal' },
        { title: '占产值%', dataIndex: 'monthWeekGoalsTotalPropor' },
        { title: '目标', dataIndex: 'monthGoals' },
        { title: '占产值%', dataIndex: 'monthGoalsPropor' },
        { title: '差额', dataIndex: 'monthGoalsBalance' },
        { title: '占比', dataIndex: 'monthGoalsDifferen' },
      ],
    },
    {
      title: `WK01-${endWeekStr}累计同比`,
      customHeaderCell: () => ({
        style: {
          backgroundColor: ALLCustomHeaderCellColor[1],
        },
      }),
      children: [
        { title: `${currentYear}年累计`, dataIndex: 'thisYearOnYear' },
        { title: '占产值%', dataIndex: 'thisYearOnYearPropor' },
        { title: `${lastYear}年累计`, dataIndex: 'lastYearOnYear' },
        { title: '占产值%', dataIndex: 'lastYearOnYearPropor' },
        { title: `${currentYear}年-${lastYear}`, dataIndex: 'yearOnYearBalance' },
        { title: '占比', dataIndex: 'yearOnYearDifferen' },
      ],
    },
    { dataIndex: 'weekList' },
  ];
};

// 跳转按钮配置
interface IJumpButtonOption {
  title: string;
  getPathUrl: (searchFormValue: Record<string, any>) => string;
}
export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: '周KPI',
    getPathUrl: searchFormValue => {
      const [, endDate = dayjs().tz()] = searchFormValue.dateRange;
      const query = {
        orgCode: searchFormValue.orgCode,
        startDate: dayjs(endDate).tz().startOf('month').format('YYYY-MM-DD'),
        endDate: endDate.endOf('month').format('YYYY-MM-DD'),
        dimension: TimeDimension.WEEK,
      };
      // 构造路由参数
      const url = `/dashboard/operate/mqkpi?${objectToQueryParams(query)}`;
      return url;
    },
  },
  {
    title: '月KPI',
    getPathUrl: searchFormValue => {
      const [startDate = dayjs().tz(), endDate = dayjs().tz()] = searchFormValue.dateRange;
      const query = {
        orgCode: searchFormValue.orgCode,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        timeDimension: TimeDimension.MONTH,
      };
      // 构造路由参数
      const url = `/dashboard/operate/mqkpi?${objectToQueryParams(query)}`;
      return url;
    },
  },
  {
    title: '制程边贡',
    getPathUrl: searchFormValue => {
      const [, endDate = dayjs().tz()] = searchFormValue.dateRange;
      const query = {
        orgCode: searchFormValue.orgCode,
        date: endDate.format('YYYY-MM-DD'),
        dimension: TimeDimension.WEEK,
      };
      // 构造路由参数
      const url = `/dashboard/operate/biangongDimension/ranking?${objectToQueryParams(query)}`;
      return url;
    },
  },
  {
    title: '费用分析',
    getPathUrl: searchFormValue => {
      const [, endDate = dayjs().tz()] = searchFormValue.dateRange;
      const query = {
        orgCode: searchFormValue.orgCode,
        date: endDate.format('YYYY-MM-DD'),
      };
      // 构造路由参数
      const url = `/dashboard/operate/expense?${objectToQueryParams(query)}`;
      return url;
    },
  },
  {
    title: '手工数据',
    getPathUrl: () => {
      // 构造路由参数
      const url = `/dashboard/operate/profitkpi/manualData`;
      return url;
    },
  },
];

// 上传按钮配置
export const uploadButtonList = [
  {
    api: '/api/report/profitandlos/ImportWeekGoals',
    buttonText: '周目标导入',
  },
  {
    api: '/api/report/profitandlos/importManualData',
    buttonText: '手工数据导入',
  },
];
// 模版下载配置
export const templateDownloadList = [
  {
    fileName: '周目标导入模板',
  },
  {
    fileName: '手工数据导入模板',
  },
];
