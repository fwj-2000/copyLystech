import { commonSyOrgCodeFormOptions, commonDateRangeFormOptions } from '/@/views/dataAnalysis/config';
import { commonMediumValueOption, commonSeqOption, commonValueOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import dayjs from 'dayjs';

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
      title: '厂区',
      field: 'Factory',
      headerAlign: 'center',
      width: 100,
    },
    {
      ...commonMediumValueOption,
      field: 'List',
      columnType: EColumnType.KEYS_VALUES,
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: getFormatter(),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4),
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/cutmaterialDetail';
        },
        getPathParams: ({ row, column, searchFormValue }) => {
          const { OrgCode } = row;
          const { title: date } = column;
          const { dateRange, orgCode, ...res } = searchFormValue;
          return {
            orgCode: OrgCode ?? orgCode,
            dateRange: [dayjs(date), dayjs(date)],
            ...res,
          };
        },
      },
    },
    {
      ...commonValueOption,
      title: '原材料占比',
      field: 'RawProport',
      width: 100,
      formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    },
    {
      ...commonValueOption,
      title: '环比',
      field: 'Env',
      formatter: getFormatter(),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 0),
    },
    {
      ...commonValueOption,
      title: '降幅',
      field: 'Drop',
      formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    },
  ];
  return columns;
};
