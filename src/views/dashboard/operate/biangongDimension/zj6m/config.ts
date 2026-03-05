// 前端显示配置
import dayjs from 'dayjs';
import { objectToQueryParams } from '../../metricsCenter/utils';
import { BasicColumn } from '/@/components/Table';

// 是否纳入边贡
export const DEFAULT_IS_BAIN = '1';
export const isBainOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
];

// 表头动态配置类型
export enum EColumnsType {
  NORAML = 'noraml',
  MONTH_LIST = 'monthList', // 动态生成的数据列表
}

// 表头颜色配置
export const ALLCustomBaseHeaderCellColor = ['rgba(250, 173, 20, 0.2)', 'rgba(250, 173, 20, 0.1)'];
export const ALLCustomActualHeaderCellColor = ['rgba(24, 144, 255, 0.2)', 'rgba(24, 144, 255, 0.1)'];

// 自定义表格单元格
export const customValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { dataIndex } = column as any;
    const value = record[dataIndex as string];
    if (!value) return '';
    const percentageValue = Number.parseFloat(value.toString());
    return percentageValue.toFixed(1) + '%';
  },
  customCell: (record, _, column) => {
    const value = record[column?.dataIndex as string];
    const percentageValue = Number.parseFloat(value);
    return {
      style: `${percentageValue < 0 ? 'color: red' : ''};`,
    };
  },
};

// 数值类型
export const customNumberValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { dataIndex } = column as any;
    const value = record[dataIndex as string];
    if (!value) return '';
    const percentageValue = Number.parseFloat(value.toString());
    return percentageValue.toFixed(1);
  },
  customCell: (record, _, column) => {
    const value = record[column?.dataIndex as string];
    const percentageValue = Number.parseFloat(value);
    return {
      style: `${percentageValue < 0 ? 'color: red' : ''};`,
    };
  },
};

// 表格项插槽类型
export enum ETableCellSlotType {
  LINK = 'link',
  NORMAL = 'normal',
}
interface IBaseInfo extends BasicColumn {
  cellType?: ETableCellSlotType; // 表格项插槽类型
  getPathUrl?: (params: { searchFormValue: any; record: Record<string, any>; column: IBaseInfo }) => string; // 点击单元格跳转的方法
}
// 表头动态配置项
export interface IColumnsOption {
  type?: EColumnsType; // 类型
  title?: string; // 标题
  baseInfo: IBaseInfo;
  dataIndex: string;
  sortable?: boolean; // 是否可排序
  filterable?: boolean; // 是否可筛选
  isRowSpan?: boolean; // 是否开启合并单元格
}

export const allColumnsOptions: Record<string, IColumnsOption> = {
  factory: {
    dataIndex: 'factory',
    baseInfo: {
      width: 100,
      title: '厂区',
      fixed: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: () => {
        return `/dashboard/operate/biangongDimension/ranking`;
      },
    },
  },
  workShop: {
    dataIndex: 'workShop',
    baseInfo: {
      width: 80,
      title: '车间',
      fixed: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: () => {
        return `/dashboard/operate/biangongDimension/ranking`;
      },
    },
  },
  customer: {
    dataIndex: 'customer',
    baseInfo: {
      width: 60,
      title: '客户',
      fixed: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: () => {
        return `/dashboard/operate/biangongDimension/ranking`;
      },
    },
  },
  product: {
    dataIndex: 'product',
    baseInfo: {
      width: 80,
      title: '产品类别',
      fixed: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: () => {
        return `/dashboard/operate/biangongDimension/ranking`;
      },
    },
  },
  code3: {
    dataIndex: 'code3',
    baseInfo: {
      width: 60,
      title: '内部3码',
      fixed: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: () => {
        return `/dashboard/operate/biangongDimension/ranking`;
      },
    },
  },
  code6: {
    dataIndex: 'code6',
    baseInfo: {
      width: 80,
      title: '中间6码',
      fixed: 'left',
      cellType: ETableCellSlotType.LINK,
      getPathUrl: ({ record, searchFormValue }) => {
        const [startDate, endDate] = searchFormValue.dateRange;
        const query = {
          sixCodes: record.code6,
          orgCode: record.sbuCode,
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
        };
        // 构造路由参数
        const url = `/dashboard/operate/biangongDimension/ticket?${objectToQueryParams(query)}`;
        return url;
      },
    },
  },
  total: {
    dataIndex: 'total',
    baseInfo: {
      title: '累计',
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
        },
      }),
    },
  },
  standardList: {
    type: EColumnsType.MONTH_LIST,
    dataIndex: 'standardList',
    baseInfo: {
      ...customValueCell,
      width: 60,
    },
  },
  actualList: {
    type: EColumnsType.MONTH_LIST,
    title: '实际指标',
    dataIndex: 'actualList',
    baseInfo: {
      ...customValueCell,
      width: 60,
    },
  },
};

// 周维度字段
const getSorter = dataIndex => (a, b) => {
  const aValue = Number.parseFloat(a[dataIndex as string]) || 0;
  const bValue = Number.parseFloat(b[dataIndex as string]) || 0;
  return aValue - bValue;
};
export const columnsOptions: BasicColumn[] = [
  {
    dataIndex: 'factory',
  },
  {
    dataIndex: 'workShop',
  },
  {
    dataIndex: 'customer',
  },
  {
    dataIndex: 'product',
  },
  {
    dataIndex: 'code3',
  },
  {
    dataIndex: 'code6',
  },
  {
    dataIndex: 'total',
    children: [
      {
        dataIndex: 'totalOutputValue',
        width: 60,
        title: '产值权重',
        ...customValueCell,
        sorter: getSorter('totalOutputValue'),
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalStandardBg',
        width: 60,
        title: '标准边贡',
        ...customValueCell,
        sorter: getSorter('totalStandardBg'),
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalStandardClzb',
        width: 80,
        title: '标准含损耗材料占比',
        ...customValueCell,
        sorter: getSorter('totalStandardClzb'),
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalStandardRgzb',
        width: 60,
        title: '标准人工占比',
        ...customValueCell,
        sorter: getSorter('totalStandardRgzb'),
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalStandardShl',
        width: 60,
        title: '标准损耗率',
        sorter: getSorter('totalStandardShl'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalStandardSgxl',
        width: 60,
        title: '标准手工效率',
        sorter: getSorter('totalStandardSgxl'),
        ...customNumberValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualBg',
        width: 60,
        title: '实际边贡',
        sorter: getSorter('totalActualBg'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualClzb',
        width: 60,
        title: '实际材料占比',
        sorter: getSorter('totalActualClzb'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualRgzb',
        width: 60,
        title: '实际人工占比',
        sorter: getSorter('totalActualRgzb'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualShl',
        width: 60,
        title: '实际损耗率',
        sorter: getSorter('totalActualShl'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualSgxl',
        width: 60,
        title: '实际手工效率',
        sorter: getSorter('totalActualSgxl'),
        ...customNumberValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualBgcy',
        width: 60,
        title: '实际边贡差异',
        sorter: getSorter('totalActualBgcy'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualClcy',
        width: 60,
        title: '实际材料差异',
        sorter: getSorter('totalActualClcy'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualRgcy',
        width: 60,
        title: '实际人工差异',
        sorter: getSorter('totalActualRgcy'),
        ...customValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
      {
        dataIndex: 'totalActualRgxlcy',
        width: 60,
        title: '实际手工效率差异',
        sorter: getSorter('totalActualRgxlcy'),
        ...customNumberValueCell,
        customHeaderCell: () => ({
          style: {
            backgroundColor: 'rgba(82, 196, 26, 0.2)',
          },
        }),
      },
    ],
  },
  // {
  //   "dataIndex": "totalOutputValue"
  // },
  // {
  //   "dataIndex": "totalStandardBg"
  // },
  // {
  //   "dataIndex": "totalStandardClzb"
  // },
  // {
  //   "dataIndex": "totalStandardRgzb"
  // },
  // {
  //   "dataIndex": "totalStandardShl"
  // },
  // {
  //   "dataIndex": "totalActualBg"
  // },
  // {
  //   "dataIndex": "totalActualClzb"
  // },
  // {
  //   "dataIndex": "totalActualShl"
  // },
  // {
  //   "dataIndex": "totalActualBgcy"
  // },
  // {
  //   "dataIndex": "totalActualClcy"
  // },
  // {
  //   "dataIndex": "totalActualRgcy"
  // },
  {
    dataIndex: 'standardList',
  },
  {
    dataIndex: 'actualList',
  },
];
