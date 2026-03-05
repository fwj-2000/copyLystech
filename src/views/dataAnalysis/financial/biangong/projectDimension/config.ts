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
      field: 'gsber',
      title: '业务范围',
    },
    {
      ...commonTextOption,
      field: 'factory',
      title: '工厂名',
      width: 110,
    },
    {
      ...commonTextOption,
      field: 'largeProject',
      title: '大项目',
    },
    {
      ...commonTextOption,
      field: 'productType',
      title: '产品类别',
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
    label: '工厂',
    default: '',
    key: 'factory',
  },
  {
    type: EFormItemType.INPUT,
    label: '订单号',
    default: '',
    key: 'largeProject',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品类型',
    default: '',
    key: 'productType',
  },
];
