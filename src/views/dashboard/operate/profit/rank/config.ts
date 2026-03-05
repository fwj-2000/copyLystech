import { getProfitandlosMetricscenterDetail } from '/@/api/dashbord/operate';
import { cloneDeep, isEmpty, merge } from 'lodash-es';

import { EOrgCode, SearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';
import { IColumnsOption, EOrgLevel } from '../type';
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

// 通用的表格头配置
const ALL_COLUMNS_OPTIONS: { [key: string]: IColumnsOption } = {
  buSbu: {
    baseInfo: {
      title: 'BU/SBU',
      width: 80,
    },
  },
  gropuAmount: {
    baseInfo: {
      title: '产值金额(万元)',
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
      title: '净利额(万元)',
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
      title: '净利率(%)',
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
      title: '产值金额(万元)',
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
      title: '净利额(万元)',
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
      title: '净利率(%)',
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
  gapOutputValue: {
    baseInfo: {
      title: '产值达成',
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
};

interface IGetColumnsOptionParams {
  columns: BasicColumn[];
  searchFormValue?: SearchFormValueType;
  dataSource?: Recordable<any>[];
}

// 根据dataIndex列表获取表头配置
const getColumnsOption = ({ searchFormValue, columns = [] }: IGetColumnsOptionParams) => {
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
        if (['gropuAmount', 'actualAmount'].includes(dataIndex as string)) {
          baseInfo.title = searchFormValue?.saleOutputDim === 'cz' ? '产值金额(万元)' : '产值金额(万元)';
        }
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
  const { date } = searchFormValue;
  const orgCodeParams = {};
  // 特殊处理：只有模切bg区分层级等级
  if (searchFormValue.orgCode === EOrgCode.MQ) {
    orgCodeParams['busbuDim'] = searchFormValue.orgLevel;
  } else {
    orgCodeParams['orgCode'] = searchFormValue.orgCode;
  }

  return {
    // 特殊处理：只有模切bg区分层级等级
    ...orgCodeParams,
    preMadeDim: searchFormValue.preMadeDim,
    startDim: date.format('YYYYMM'),
    endDim: date.format('YYYYMM'),
  };
};
// 所有页面配置信息
export const PAGE_CONFIG_INFO = {
  defaultSearchFormValue: {
    timeDimension: TimeDimension.MONTH,
  },
  api: (queryParams, searchFormValue) => getPromiseApi(getProfitandlosMetricscenterDetail, getCommonParams(queryParams, searchFormValue)),
  getColumnsOptions: ({ dataSource, searchFormValue }) =>
    getColumnsOption({
      dataSource,
      searchFormValue,
      columns: [
        // { dataIndex: 'sort' },
        { dataIndex: 'buSbu' },
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
          title: '达成率',
          customHeaderCell: () => ({
            style: {
              backgroundColor: 'rgba(82, 196, 26, 0.2)',
            },
          }),
          children: [{ dataIndex: 'gapOutputValue' }, { dataIndex: 'gapNetProfit' }],
        },
      ],
    }),
};
