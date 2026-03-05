import { getDimensionRankingData } from '/@/api/dashbord/ranking';
import { EOrgCode, TimeDimension } from '/@/views/dashboard/operate/types';
import { EOrgLevel } from '/@/views/dashboard/operate/ranking/type';
import dayjs from 'dayjs';
import { EFilterSlotType, ECellSlotType, IColumnOption, EColumnsType } from '/@/views/dashboard/operate/components/BaseVxeTable/types';

import InfoDetail from './infoDetail/index.vue';
// 排行等级配置
export const ORG_LEVEL_OPTIONS = [
  { label: 'SBU', value: EOrgLevel.SBU },
  { label: 'BU', value: EOrgLevel.BU },
];

// 维度字段对应的key
const dimensionTypeKeyMap = {
  项目: 'programType',
  车间: 'workShopType',
  客户: 'customerType',
  产品类别: 'productType',
  中间6码: 'sixCodes',
  工程师: 'engineer',
  产品线: 'productLine',
  新老项目: 'newOldProject',
  小项目: 'smallProject',
  通用1: 'generall1',
  通用2: 'generall2',
  通用3: 'generall3',
  通用4: 'generall4',
  通用5: 'generall5',
};
// 通用的表格头配置
export const allColumnsOptions: { [key: string]: IColumnOption } = {
  buSbu: {
    title: 'BU/SBU',
    minWidth: 90,
    slots: { default: ECellSlotType.ROUTE_LINK },
    filterMultiple: true,
    getRoutePath: searchFormValue => {
      const { dimensionType } = searchFormValue;
      return dimensionType.includes('zj6m') ? '/dashboard/operate/biangongDimension/zj6m' : '/dashboard/operate/biangongDimension/ranking';
    },
    getRouteParams: (searchFormValue, record) => {
      const { OrgCode } = record;
      const { timeDimension, isBian, dateRange } = searchFormValue;
      const [startDate, endDate] = dateRange;
      const { dimensionType } = searchFormValue;
      const isIncluded = dimensionType.includes('zj6m');
      return {
        orgCode: OrgCode,
        timeDimension,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        isBian,
        ...(isIncluded ? {} : { dimensionType: 'zj6m' }),
      };
    },
  },
  borderTributeLossAmount: {
    title: '边贡损失额(万元)',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
  },
  finishedProductOutputValue: {
    title: '结单产值(万元)',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 0 },
    },
  },
  outputValueAvege: {
    title: '产值均价',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 4 },
    },
  },
  standardBorderTributeRate: {
    title: '标准边贡率',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  actualBorderTributRate: {
    title: '实际边贡率',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  borderTributGap: {
    title: '边贡率Gap',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  standardLossRate: {
    title: '标准损耗率',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  actualLossRate: {
    title: '实际损耗率',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  lossRateGap: {
    title: '损耗率Gap',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  materialLossAmount: {
    title: '材料损失额(万元)',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      style: { rollback: true },
    },
  },
  standardLaborRate: {
    title: '标准人工率',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  actualLaborRate: {
    title: '实际人工率',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  laborRateGap: {
    title: '人工率Gap',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  standardMaterialPropor: {
    title: '标准材料占比',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  actualMaterialPropor: {
    title: '实际材料占比',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  materialGap: {
    title: '材料Gap',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      format: { decimal: 1, isRate: true },
    },
  },
  artificialLossAmount: {
    title: '人工损失额(万元)',
    align: 'right',
    minWidth: 80,
    sortable: true,
    slots: {
      default: ECellSlotType.FORMAT_VALUE,
      filter: EFilterSlotType.FILTER_VALUE,
    },
    config: {
      style: { rollback: true },
    },
  },
  dimesionType: {
    field: 'dimesionType',
    customColumnType: EColumnsType.DIMENTION_LIST,
    minWidth: 120,
    align: 'left',
    slots: {
      default: ECellSlotType.DIALOG,
      filter: EFilterSlotType.MULTI_SEARCH_FILTER,
    },
    config: {
      dialogCompo: InfoDetail,
    },
    getQuery: ({ row, searchFormValue }) => {
      const orgCodeParams = {};
      if (searchFormValue.orgCode === 'MQ' && searchFormValue.orgLevel === 'bu') {
        orgCodeParams['bu'] = row.buCode;
      } else {
        orgCodeParams['orgCode'] = row.sbuCode;
      }
      const [startDate = dayjs().tz(), endDate = dayjs().tz()] = searchFormValue.dateRange;
      const query = {
        ...orgCodeParams,
        isBian: searchFormValue.isBian,
        item: row.Items || '',
        prodLine: row.ProductLine || '',
        dimension: searchFormValue.timeDimension,
        dimensionType: searchFormValue.dimensionType.join(';'),
        startDim: `${startDate.endOf('week').year()}WK${startDate.endOf('week').week().toString().padStart(2, '0')}`,
        endDim: `${endDate.endOf('week').year()}WK${endDate.endOf('week').week().toString().padStart(2, '0')}`,
        ...Object.keys(dimensionTypeKeyMap).reduce((pre, cur) => {
          if (row[cur]) {
            pre[dimensionTypeKeyMap[cur]] = row[cur];
          }
          return pre;
        }, {}),
      };
      // 构造路由参数
      return query;
    },
  },
};

// 获取传递额外参数的promise请求
const getPromiseApi = (reqMth: any, query: any) =>
  new Promise((resolve, reject) => {
    reqMth(query)
      .then(res => resolve(res))
      .catch(res => reject(res));
  });
// 获取通用的请求参数
export const getCommonParams = (queryParams, searchFormValue) => {
  const { startDim, endDim } = queryParams;
  const orgCodeParams = {};
  // 特殊处理：只有模切bg区分层级等级
  if (searchFormValue.orgCode === EOrgCode.MQ) {
    orgCodeParams['busbuDim'] = searchFormValue.orgLevel === EOrgLevel.BU ? 'bu' : 'sbu';
  } else {
    if (searchFormValue.orgCode.length < 9) {
      orgCodeParams['bu'] = searchFormValue.orgCode;
    } else {
      orgCodeParams['orgCode'] = searchFormValue.orgCode;
    }
  }
  return {
    // 特殊处理：只有模切bg区分层级等级
    ...orgCodeParams,
    workNoType: searchFormValue.workNoType.join(';'),
    isBian: searchFormValue.isBian,
    dimensionType: searchFormValue.dimensionType.join(';'),
    startDim,
    endDim,
  };
};

// 所有页面配置信息
export const PAGE_CONFIG_INFO = {
  defaultSearchFormValue: {
    timeDimension: TimeDimension.WEEK,
  },
  api: (queryParams, searchFormValue) =>
    getPromiseApi(getDimensionRankingData, {
      ...getCommonParams(queryParams, searchFormValue),
    }),
};

export const columns = [
  {
    field: 'sort',
    minWidth: 70,
    title: '排名',
    align: 'center',
  },
  { field: 'buSbu' },
  { field: 'dimesionType' },
  { field: 'borderTributeLossAmount' },
  { field: 'finishedProductOutputValue' },
  { field: 'outputValueAvege' },
  { field: 'standardBorderTributeRate' },
  { field: 'actualBorderTributRate' },
  { field: 'borderTributGap' },
  { field: 'standardLossRate' },
  { field: 'actualLossRate' },
  { field: 'lossRateGap' },
  { field: 'materialLossAmount' },
  { field: 'standardLaborRate' },
  { field: 'actualLaborRate' },
  { field: 'laborRateGap' },
  { field: 'artificialLossAmount' },
  { field: 'standardMaterialPropor' },
  { field: 'actualMaterialPropor' },
  { field: 'materialGap' },
];
