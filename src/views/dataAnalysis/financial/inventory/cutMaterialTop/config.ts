import { commonSyOrgCodeFormOptions, commonDateRangeFormOptions } from '/@/views/dataAnalysis/config';
import { textOptionEasy, commonLargeValueOption, commonSeqOption, commonValueOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

// 表单配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
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
  commonDateRangeFormOptions,
  {
    label: 'Top',
    type: EFormItemType.INPUT,
    default: '100',
    key: 'top',
    attrs: {
      style: {
        width: '80px',
      },
    },
  },
];
export const filterOptions: TFormItemOption[] = [
  {
    label: '物料',
    type: EFormItemType.INPUT,
    default: '',
    key: 'matnr',
  },
  {
    label: '宽幅开始',
    type: EFormItemType.INPUT,
    default: '0',
    key: 'kuanfuStart',
  },
  {
    label: '宽幅结束',
    type: EFormItemType.INPUT,
    default: '30',
    key: 'kuanfuEnd',
  },
];

// 导出表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    commonSeqOption,
    {
      ...textOptionEasy,
      title: '厂区',
      field: 'Factory',
    },
    {
      ...textOptionEasy,
      title: '物料',
      width: 130,
      field: 'Matnr',
    },
    {
      ...commonLargeValueOption,
      field: 'List',
      width: 90,
      columnType: EColumnType.KEYS_VALUES,
      formatter: getFormatter(),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4),
    },
    {
      ...commonValueOption,
      title: '最高库龄',
      field: 'LibraryAge',
    },
    {
      ...commonValueOption,
      width: 60,
      title: '环比',
      field: 'Env',
      formatter: getFormatter(),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 0),
    },
    {
      ...commonValueOption,
      width: 60,
      title: '降幅',
      field: 'Drop',
      formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    },
  ];
  return columns;
};
