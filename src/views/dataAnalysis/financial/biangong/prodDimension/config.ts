import type { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import type { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { timeDimensionOptions } from '/@/views/dataAnalysis/financial/config';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import dayjs from 'dayjs';

import { EFormItemType, ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      field: 'year',
      title: '年',
    },
    {
      ...commonTextOption,
      field: 'gsber',
      title: '业务范围',
    },
    {
      ...commonTextOption,
      field: 'matnr',
      title: '成品编号',
      width: 200,
    },
    {
      ...commonTextOption,
      field: 'zzdkh',
      title: '客户类型',
    },
    {
      ...commonTextOption,
      field: 'cpx',
      title: '产品线',
    },
    {
      ...commonTextOption,
      field: 'xxm',
      title: '小项目',
    },
    {
      ...commonTextOption,
      field: 'zxlxm',
      title: '新老项目',
    },
    {
      ...commonTextOption,
      field: 'other1',
      title: '通用1',
    },
    {
      ...commonTextOption,
      field: 'other2',
      title: '通用2',
    },
    {
      ...commonTextOption,
      field: 'other3',
      title: '通用3',
    },
    {
      ...commonTextOption,
      field: 'other4',
      title: '通用4',
    },
    {
      ...commonTextOption,
      field: 'other5',
      title: '通用5',
    },
  ];

  return columns;
};

export const formOptions: TFormItemOption[] = [
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
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];

export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '业务范围',
    default: '',
    key: 'businessScope',
  },
  {
    type: EFormItemType.INPUT,
    label: '成品编号',
    default: '',
    key: 'productNo',
  },
  {
    type: EFormItemType.INPUT,
    label: '客户类型',
    default: '',
    key: 'customerType',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品线',
    default: '',
    key: 'productLine',
  },
  {
    type: EFormItemType.INPUT,
    label: '小项目',
    default: '',
    key: 'smallProject',
  },
  {
    type: EFormItemType.INPUT,
    label: '新老项目',
    default: '',
    key: 'newOldProject',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用1',
    default: '',
    key: 'general1',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用2',
    default: '',
    key: 'general2',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用3',
    default: '',
    key: 'general3',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用4',
    default: '',
    key: 'general4',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用5',
    default: '',
    key: 'general5',
  },
];
