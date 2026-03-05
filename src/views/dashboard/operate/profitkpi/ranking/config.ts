import { getProfitandlosRankingData } from '/@/api/dashbord/ranking';
import { cloneDeep, isEmpty, merge } from 'lodash-es';

import { EOrgCode, SearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';
import { IColumnsOption, EOrgLevel, ETableCellSlotType } from './type';
import dayjs from 'dayjs';
import { getCustomValueCell } from '/@/views/dashboard/operate/biangongDimension/config';
import { BasicColumn } from '/@/components/Table';

// 排行等级配置
export const ORG_LEVEL_OPTIONS = [
  { label: 'SBU', value: EOrgLevel.SBU },
  { label: 'BU', value: EOrgLevel.BU },
];

// 预测
export const DEFAULT_PRE_MADE_DIM = 'ys';
export const preMadeDimOptions = [
  { label: '预算', value: 'ys' },
  { label: '预测', value: 'yc' },
];

// 产值
export const DEFAULT_SALE_OUTPUT_DIM = 'cz';
export const saleOutputDimOptions = [
  { label: '产值', value: 'cz' },
  { label: '销值', value: 'xz' },
];

// 通用的表格头配置
const ALL_COLUMNS_OPTIONS: { [key: string]: IColumnsOption } = {
  rank: {
    baseInfo: {
      title: '排名',
      width: 40,
    },
  },
  buSbu: {
    baseInfo: {
      title: 'BU/SBU',
      width: 80,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/profitkpi',
      getRoutePath: ({ record }) => {
        const buSbu = record.buSbu;
        if (buSbu.includes('BU') || buSbu.includes('海外')) {
          return '/dashboard/operate/profitkpi/ranking';
        }
        return '/dashboard/operate/profitkpi';
      },
      getRouteParams: (searchFormValue, record) => {
        const { key: OrgCode } = record;
        const [startDate, endDate] = searchFormValue.dateRange;
        return {
          orgCode: OrgCode,
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
        };
      },
    },
  },
  gropuAmount: {
    baseInfo: {
      title: '金额',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(250, 173, 20, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  gropuNetProfit: {
    baseInfo: {
      title: '净利额',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(250, 173, 20, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  gropuProfitMargin: {
    baseInfo: {
      title: '净利率',
      align: 'right',
      width: 70,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(250, 173, 20, 0.2)',
        },
      }),
      ...getCustomValueCell(1, true),
    },
    sortable: true,
  },
  actualAmount: {
    baseInfo: {
      title: '金额',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(24, 144, 255, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  actualNetProfit: {
    baseInfo: {
      title: '净利额',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(24, 144, 255, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  actualProfitMargin: {
    baseInfo: {
      title: '净利率',
      align: 'right',
      width: 70,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(24, 144, 255, 0.2)',
        },
      }),
      ...getCustomValueCell(1, true),
    },
    sortable: true,
  },
  samePeriodAmount: {
    baseInfo: {
      title: '金额',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(0, 172, 225, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  samePeriodNetProfit: {
    baseInfo: {
      title: '净利额',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(0, 172, 225, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  samePeriodProfitMargin: {
    baseInfo: {
      title: '净利率',
      align: 'right',
      width: 70,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(0, 172, 225, 0.2)',
        },
      }),
      ...getCustomValueCell(1, true),
    },
    sortable: true,
  },
  gapOutputValue: {
    baseInfo: {
      title: '金额达成',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
        },
      }),
      ...getCustomValueCell(1, true, false, 100),
    },
    sortable: true,
  },
  gapNetProfit: {
    baseInfo: {
      title: '净利达成',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
        },
      }),
      ...getCustomValueCell(1, true, false, 100),
    },
    sortable: true,
  },
  gapActualOutputValue: {
    baseInfo: {
      title: '金额Gap',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  gapActualNetProfit: {
    baseInfo: {
      title: '净利Gap',
      align: 'right',
      width: 80,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
        },
      }),
      ...getCustomValueCell(0),
    },
    sortable: true,
  },
  gapNetProfitMargin: {
    baseInfo: {
      title: '净利率',
      align: 'right',
      width: 70,
      customHeaderCell: () => ({
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
        },
      }),
      ...getCustomValueCell(1, true),
    },
    sortable: true,
  },
};

interface IGetColumnsOptionParams {
  columns: BasicColumn[];
  searchFormValue?: SearchFormValueType;
  dataSource?: Recordable<any>[];
}

// 根据dataIndex列表获取表头配置
const getColumnsOption = ({ columns = [] }: IGetColumnsOptionParams) => {
  return columns.map(item => {
    const { children = [], dataIndex } = item;
    const { baseInfo = {}, sortable = false } = ALL_COLUMNS_OPTIONS[dataIndex as string] || {};
    const getSorter = dataIndex => (a, b) => {
      const aValue = Number.parseFloat(a[dataIndex as string]) || 0;
      const bValue = Number.parseFloat(b[dataIndex as string]) || 0;
      return aValue - bValue;
    };
    if (!isEmpty(children)) {
      item.children = children.map(item => {
        const { dataIndex = '' } = item;
        const { baseInfo = {}, sortable = false } = ALL_COLUMNS_OPTIONS[dataIndex as string] || {};
        return merge(cloneDeep(item), baseInfo, sortable ? { sorter: getSorter(dataIndex) } : {});
      });
    }
    return merge(cloneDeep(item), baseInfo, sortable ? { sorter: getSorter(dataIndex) } : {});
  });
};
// 获取传递额外参数的promise请求
const getPromiseApi = (reqMth: any, query: any) =>
  new Promise((resolve, reject) => {
    reqMth(query)
      .then(res => resolve(res))
      .catch(error_ => reject(error_));
  });
// 获取通用的请求参数
export const getCommonParams = (_, searchFormValue) => {
  const { dateRange, timeDimension } = searchFormValue;
  const [startDate = dayjs(searchFormValue.defaultDate).tz().subtract(6, timeDimension), endDate = dayjs(searchFormValue.defaultDate).tz()] = dateRange || [];
  const orgCodeParams = {};
  // 特殊处理：只有模切bg区分层级等级
  if (searchFormValue.orgCode === EOrgCode.MQ) {
    orgCodeParams['busbuDim'] = searchFormValue.orgLevel;
  } else {
    if (searchFormValue.orgCode.length < 9) {
      orgCodeParams['bu'] = searchFormValue.orgCode;
    } else {
      orgCodeParams['busbuDim'] = 'sbu';
      orgCodeParams['sbu'] = searchFormValue.orgCode;
    }
  }

  return {
    // 特殊处理：只有模切bg区分层级等级
    ...orgCodeParams,
    preMadeDim: searchFormValue.preMadeDim,
    saleOutputDim: searchFormValue.saleOutputDim,
    startDim: startDate.format('YYYY-MM'),
    endDim: endDate.format('YYYY-MM'),
  };
};
// 所有页面配置信息
export const PAGE_CONFIG_INFO = {
  defaultSearchFormValue: {
    timeDimension: TimeDimension.MONTH,
  },
  api: (queryParams, searchFormValue) => getPromiseApi(getProfitandlosRankingData, getCommonParams(queryParams, searchFormValue)),
  getColumnsOptions: ({ dataSource, searchFormValue }) =>
    getColumnsOption({
      dataSource,
      searchFormValue,
      columns: [
        { dataIndex: 'rank' },
        { dataIndex: 'buSbu' },
        {
          title: '达成率/Gap值',
          customHeaderCell: () => ({
            style: {
              backgroundColor: 'rgba(82, 196, 26, 0.2)',
            },
          }),
          children: [
            { dataIndex: 'gapOutputValue' },
            { dataIndex: 'gapNetProfit' },
            { dataIndex: 'gapActualOutputValue' },
            { dataIndex: 'gapActualNetProfit' },
            { dataIndex: 'gapNetProfitMargin' },
          ],
        },
        {
          title: searchFormValue.preMadeDim === 'ys' ? '集团预算' : '集团预测',
          customHeaderCell: () => ({
            style: {
              backgroundColor: 'rgba(250, 173, 20, 0.2)',
            },
          }),
          children: [
            {
              dataIndex: 'gropuAmount',
            },
            {
              dataIndex: 'gropuNetProfit',
            },
            {
              dataIndex: 'gropuProfitMargin',
            },
          ],
        },
        {
          title: '实际达成',
          customHeaderCell: () => ({
            style: {
              backgroundColor: 'rgba(24, 144, 255, 0.2)',
            },
          }),
          children: [{ dataIndex: 'actualAmount' }, { dataIndex: 'actualNetProfit' }, { dataIndex: 'actualProfitMargin' }],
        },
        {
          title: '同期数',
          customHeaderCell: () => ({
            style: {
              backgroundColor: 'rgba(0, 172, 225, 0.2)',
            },
          }),
          children: [{ dataIndex: 'samePeriodAmount' }, { dataIndex: 'samePeriodNetProfit' }, { dataIndex: 'samePeriodProfitMargin' }],
        },
      ],
    }),
};
