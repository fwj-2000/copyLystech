// 前端显示配置

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
  DATE_VALUE_LIST = 'dateValueList', // 动态生成的数据列表
}

interface IBaseInfo extends BasicColumn {
  // type?: ETableCellSlotType; // 表格项插槽类型
  // cssStyle?: string;// 额外的css样式
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

const getThisCustomHeaderCellFunc = () => ({
  style: {
    backgroundColor: 'rgba(250, 173, 20, 0.2)',
  },
});
const getLastCustomHeaderCellFunc = () => ({
  style: {
    backgroundColor: 'rgba(24, 144, 255, 0.2)',
  },
});

const oneDecimalPlace = ['人均产值(万)', '人均MVA(万)', '直间比', '人均产值(万元)']; // 需要保留一位小数的字段列表
// 自定义表格单元格
export const customValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { customTitle = '', dataIndex } = column as any;
    const { metric } = record;
    const value = record[dataIndex as string].toString();
    const numberDecimal = oneDecimalPlace.includes(metric) ? 1 : 0;
    // 结单率要*100
    if (metric === '结单率' && !['同比率%', '环比率%'].includes(customTitle)) {
      const percentageValue = Number.parseFloat(value * 100);
      return `${percentageValue.toFixed(1)}%`;
    }
    if (value.endsWith('%') || metric.includes('%') || metric.includes('率') || customTitle.includes('%') || metric === '结单率') {
      const percentageValue = Number.parseFloat(value);
      return percentageValue.toFixed(1) + '%';
    } else {
      return thousandsFormat(Number.parseFloat(value).toFixed(numberDecimal));
    }
  },
  customCell: (record, _, column) => {
    const value = record[column?.dataIndex as string];
    const percentageValue = Number.parseFloat(value);
    return {
      style: `${percentageValue < 0 ? 'color: red' : ''};`,
    };
  },
};
export const allColumnsOptions: Record<string, IColumnsOption> = {
  factory: {
    dataIndex: 'factory',
    filterable: true,
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
  metric: {
    dataIndex: 'metric',
    baseInfo: {
      title: '指标',
      width: 80,
      align: 'left',
      customCell: () => {
        return {
          style: { 'font-weight': 'bolder' },
        };
      },
    },
  },
  metricKey: {
    dataIndex: 'metricKey',
    baseInfo: {
      title: '',
      width: 80,
      customCell: () => {
        return {
          style: { 'font-weight': 'bolder' },
        };
      },
    },
  },
  thisAmountList: {
    type: EColumnsType.DATE_VALUE_LIST,
    dataIndex: 'thisAmountList',
    baseInfo: {
      width: 60,
      align: 'right',
      customHeaderCell: getThisCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  envScale: {
    dataIndex: 'envScale',
    baseInfo: {
      title: '环比额',
      width: 60,
      align: 'right',
      customHeaderCell: getThisCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  envRate: {
    dataIndex: 'envRate',
    baseInfo: {
      title: '环比率%',
      width: 60,
      align: 'right',
      customHeaderCell: getThisCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  lastAmountList: {
    type: EColumnsType.DATE_VALUE_LIST,
    dataIndex: 'lastAmountList',
    baseInfo: {
      width: 60,
      align: 'right',
      customHeaderCell: getLastCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  lastYearTotalAmount: {
    dataIndex: 'lastYearTotalAmount',
    baseInfo: {
      title: '上年合计',
      width: 80,
      align: 'right',
      customHeaderCell: getLastCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  thisYearTotalAmount: {
    dataIndex: 'thisYearTotalAmount',
    baseInfo: {
      title: '当年合计',
      width: 80,
      align: 'right',
      customHeaderCell: getLastCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  sameScale: {
    dataIndex: 'sameScale',
    baseInfo: {
      title: '同比额',
      width: 60,
      align: 'right',
      customHeaderCell: getLastCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  samePeriod: {
    dataIndex: 'samePeriod',
    baseInfo: {
      title: '本期',
      width: 60,
      align: 'right',
      customHeaderCell: getLastCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  sameRate: {
    dataIndex: 'sameRate',
    baseInfo: {
      title: '同比率%',
      width: 60,
      align: 'right',
      customHeaderCell: getLastCustomHeaderCellFunc,
      ...customValueCell,
    },
  },
  // 空白间隙
  block: {
    type: EColumnsType.BLOCK,
    dataIndex: 'block',
    baseInfo: {
      title: '',
      width: '12px',
    },
  },
};

// 周维度字段
export const weekColumnsOptions: BasicColumn[] = [
  { dataIndex: 'factory' },
  { dataIndex: 'metric' },
  // { dataIndex: 'metricKey' },
  { dataIndex: 'thisAmountList' },
  { dataIndex: 'envScale' },
  { dataIndex: 'envRate' },
  { dataIndex: 'block' },
  { dataIndex: 'lastAmountList' },
  { dataIndex: 'lastYearTotalAmount' },
  { dataIndex: 'thisYearTotalAmount' },
  { dataIndex: 'sameScale' },
  { dataIndex: 'sameRate' },
];

// 月维度字段
export const monthColumnsOptions: BasicColumn[] = [
  { dataIndex: 'factory' },
  { dataIndex: 'metric' },
  { dataIndex: 'thisAmountList' },
  { dataIndex: 'envScale' },
  { dataIndex: 'envRate' },
  { dataIndex: 'block' },
  { dataIndex: 'lastAmountList' },
  { dataIndex: 'samePeriod' },
  { dataIndex: 'sameScale' },
  { dataIndex: 'sameRate' },
];

// 将排序数组中的元素作为键，索引作为值，方便后续查找顺序
export const sortedList = [
  '模切BG',
  '平湖一厂',
  '平湖二厂',
  '平湖三厂',
  '平湖五厂',
  '平湖六厂',
  '平湖七厂',
  '平湖九厂',
  '苏州模切厂',
  '东台模切制二厂',
  '东台模切制三厂',
  '郑州模切厂',
  '成都模切厂',
  '越南模切厂',
  '黄江注塑',
];
