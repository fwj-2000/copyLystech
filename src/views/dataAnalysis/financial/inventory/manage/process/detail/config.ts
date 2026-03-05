import { commonValueOption, commonMediumTextOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { EFormItemType, TFormItemOption, ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';

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
  {
    type: EFormItemType.SELECT,
    default: [],
    label: '工单类型代码',
    key: 'auartDm',
    attrs: {
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { auartDm: Array.isArray(value) ? value.join(';') : [] };
    },
  },
];
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '工单号',
    key: 'aufnr',
  },
  // {
  //   type: EFormItemType.INPUT,
  //   label: '工单类型代码',
  //   key: 'auartDm',
  // },
  {
    type: EFormItemType.INPUT,
    label: '车间代码',
    key: 'dispo',
  },
  {
    type: EFormItemType.INPUT,
    label: '物料编码',
    key: 'matnr',
  },
];
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'factory',
      title: '工厂',
    },
    {
      ...commonMediumTextOption,
      field: 'month',
      title: '月',
    },
    {
      ...commonMediumTextOption,
      field: 'week',
      title: '周',
    },
    {
      ...commonMediumTextOption,
      field: 'budatStr',
      title: '结单日期',
    },
    {
      ...commonMediumTextOption,
      field: 'aufnr',
      title: '工单号',
    },
    {
      ...commonMediumTextOption,
      field: 'auartDm',
      title: '工单类型代码',
    },

    {
      ...commonMediumTextOption,
      field: 'auart',
      title: '工单类型描述',
    },
    {
      ...commonMediumTextOption,
      field: 'dispo',
      title: '车间代码',
    },
    {
      ...commonMediumTextOption,
      field: 'workShop',
      title: '车间代码描述',
    },

    {
      ...commonMediumTextOption,
      field: 'matnr',
      title: '物料编码',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'gamng',
      title: '工单数量',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'wemnga',
      title: '入库数量',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'milbl',
      title: 'MIL不良数',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'milblzb',
      title: 'MIL不良占比',
      formatter: getFormatter({ decimal: 2, isRate: true, isH: true }),
    },
  ];

  return columns;
};
const commonFormatValueDecimal_2 = {
  ...commonValueOption,
  formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 2, true),
  // exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 2),
};
