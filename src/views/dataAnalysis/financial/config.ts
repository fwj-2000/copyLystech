import dayjs from 'dayjs';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';

import { EFormItemType, ETimeDimension, ISelectOption, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { Dayjs } from 'dayjs';

// 维度分组和底稿维度通用表单配置
export const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '季度', value: ETimeDimension.QUARTER },
  { text: '年', value: ETimeDimension.YEAR },
];
export const timeDimensionOptionsAll = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '季度', value: ETimeDimension.QUARTER },
  { text: '年', value: ETimeDimension.YEAR },
];
// 纳入边贡配置
export const isBainOptions: ISelectOption[] = [
  { text: '全部', value: '' },
  { text: '是', value: '1' },
  { text: '否', value: '0' },
];
export const dimensionCommonFormOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '纳入边贡',
    default: '1',
    key: 'isBian',
    attrs: {
      allowClear: false,
    },
    options: isBainOptions,
  },
];
export let timeRangeClosures: Dayjs[] = [];
export const dimensionCommonFormOptions_8Week: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(56, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
    },
    getParam: (value, searchFormValue) => {
      timeRangeClosures = value;
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, timeRangeClosures);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '纳入边贡',
    default: '1',
    key: 'isBian',
    attrs: {
      allowClear: false,
    },
    options: isBainOptions,
  },
];

export const dimensionCommonFormOptionsSimple: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.MONTH,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptionsAll,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(4, 'month'), dayjs().subtract(0, 'month')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];

export const predictType: TFormItemOption = {
  type: EFormItemType.SELECT,
  default: '0',
  key: 'predictType',
  isHide: true,
  label: '预测',
  attrs: {
    allowClear: false,
  },
  options: [
    { text: '集团版', value: '0' },
    { text: '运营版', value: '1' },
  ],
};
