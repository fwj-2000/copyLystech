import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
import {
  commonMediumTextOption,
  commonMediumValueOption,
  commonSeqOption,
  commonTextOption,
  commonValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim, getCustomDefaultRange } from '/@/views/dataAnalysis/utils';
import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { IJumpButtonOption } from '/@/views/dataAnalysis/components/TableLayout/types';
// 跳转按钮配置
export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: '制程边贡',
    getPathUrl: () => {
      return '/dataAnalysis/financial/biangong/rank';
    },
    getPathParams: (_, searchFormValue) => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dateRange: searchFormValue.dateRange,
      };
      return query;
    },
  },
  {
    title: '费用分析',
    getPathUrl: (_, searchFormValue) => {
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
      const url = `/dataAnalysis/financial/profit/manualData`;
      return url;
    },
    getPathParams: (_, searchFormValue) => {
      const query = {
        dateRange: searchFormValue.dateRange,
      };
      return query;
    },
  },
];

// 表单配置
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '周', value: ETimeDimension.WEEK },
      { text: '月', value: ETimeDimension.MONTH },
    ],
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: getCustomDefaultRange(),
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];

// 获取表头配置
const weekColumnsOptions: Partial<BaseVxeTableTypes.Column>[] = [
  { field: 'seq' },
  { field: 'factory' },
  { field: 'metric' },
  { field: 'thisAmountList' },
  { field: 'envScale' },
  { field: 'envRate' },
  { field: 'block' },
  { field: 'lastAmountList' },
  { field: 'lastYearTotalAmount' },
  { field: 'thisYearTotalAmount' },
  { field: 'sameScale' },
  { field: 'sameRate' },
]; // 周维度字段
const monthColumnsOptions: Partial<BaseVxeTableTypes.Column>[] = [
  { field: 'seq' },
  { field: 'factory' },
  { field: 'metric' },
  { field: 'thisAmountList' },
  { field: 'envScale' },
  { field: 'envRate' },
  { field: 'block' },
  { field: 'lastAmountList' },
  { field: 'lastYearTotalAmount' },
  { field: 'thisYearTotalAmount' },
  // { field: 'samePeriod' },
  { field: 'sameScale' },
  { field: 'sameRate' },
]; // 月维度
const oneDecimalPlace = ['人均产值(万)', '人均MVA(万)', '直间比', '人均产值(万元)']; // 需要保留一位小数的字段列表
const getFormatter = ({ cellValue, row, column }) => {
  const { title = '' } = column as any;
  const { metric } = row;
  const decimal = oneDecimalPlace.includes(metric) ? 1 : 0;
  const value = `${cellValue ?? ''}`;
  // 结单率要*100
  if (metric === '结单率' && !['同比率%', '环比率%'].includes(title)) {
    const percentageValue = Number.parseFloat(value) * 100;
    return `${percentageValue.toFixed(1)}%`;
  }
  if (value.endsWith('%') || metric.includes('%') || metric.includes('率') || title.includes('%')) {
    return Number.parseFloat(value).toFixed(1) + '%';
  }
  return XEUtils.commafy(Number.parseFloat(value), { digits: decimal });
};
export const getAllColumns = (formParams: Record<string, any> = {}): BaseVxeTableTypes.Columns => {
  const { dimension = ETimeDimension.WEEK } = formParams;
  const columns: Record<string, BaseVxeTableTypes.Column> = {
    seq: {
      ...commonSeqOption,
    },
    factory: {
      ...commonTextOption,
      title: '厂区',
      field: 'factory',
      fixed: 'left',
    },
    metric: {
      ...commonMediumTextOption,
      title: '指标',
      field: 'metric',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/mqkpi/detail';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const query = {
            orgCode: [searchFormValue.orgCode],
            metric: row.metricKey,
            ...searchFormValue,
          };
          return query;
        },
      },
    },
    thisAmountList: {
      ...commonMediumValueOption,
      width: 105,
      field: 'thisAmountList',
      columnType: EColumnType.KEYS_VALUES,
      formatter: getFormatter,
    },
    envScale: {
      ...commonValueOption,
      title: '环比额',
      field: 'envScale',
      formatter: getFormatter,
    },
    envRate: {
      ...commonMediumValueOption,
      title: '环比率%',
      field: 'envRate',
      formatter: getFormatter,
    },
    lastAmountList: {
      ...commonMediumValueOption,
      width: 105,
      field: 'lastAmountList',
      columnType: EColumnType.KEYS_VALUES,
      formatter: getFormatter,
    },
    lastYearTotalAmount: {
      ...commonMediumValueOption,
      title: '上年合计',
      field: 'lastYearTotalAmount',
      formatter: getFormatter,
    },
    thisYearTotalAmount: {
      ...commonMediumValueOption,
      title: '当年合计',
      field: 'thisYearTotalAmount',
      formatter: getFormatter,
    },
    sameScale: {
      ...commonValueOption,
      title: '同比额',
      field: 'sameScale',
      formatter: getFormatter,
    },
    // samePeriod: {
    //   ...commonValueOption,
    //   title: '本期',
    //   field: 'samePeriod',
    //   formatter: getFormatter,
    // },
    sameRate: {
      ...commonMediumValueOption,
      title: '同比率%',
      field: 'sameRate',
      formatter: getFormatter,
    },
    block: {
      width: 10,
      field: 'block',
      mergeConfig: {
        needMergeRow: true,
      },
    },
  };
  const options = dimension === ETimeDimension.MONTH ? monthColumnsOptions : weekColumnsOptions; // 月维度和周维度的表头配置不同，所以需要根据dimension来获取表头配置
  return options.reduce((pre, cur) => {
    if (cur.field) {
      return pre.concat([
        {
          ...(columns[cur.field] ?? {}),
          ...cur,
        },
      ]);
    }
    return pre;
  }, [] as BaseVxeTableTypes.Columns);
};
