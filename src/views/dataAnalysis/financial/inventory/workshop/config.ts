import dayjs from 'dayjs';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { ETimeDimension } from '/@/views/dataAnalysis/types';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { commonLargeTextOption, commonTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

// 表单配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '年', value: ETimeDimension.YEAR },
];
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.DAY,
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

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonLargeTextOption,
      title: '工厂',
      field: 'Factory',
      mergeConfig: {
        needMergeRow: true,
        mergeRowField: 'WorkShop',
      },
    },
    {
      ...commonTextOption,
      title: '车间',
      field: 'WorkShop',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonLargeTextOption,
      title: '类型',
      field: 'Title',
    },
    {
      ...commonLargeTextOption,
      field: 'List',
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        if (typeof cellValue === 'number') return cellValue.toLocaleString();
        return cellValue;
      },
      exportMethod: ({ row, column }) => {
        if (!row[column.field]) return '';
        return row[column.field];
      },
    },
  ];
  return columns;
};
