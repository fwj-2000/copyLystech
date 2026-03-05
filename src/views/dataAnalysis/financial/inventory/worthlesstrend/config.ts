import { commonDateRangeFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonSeqOption,
  commonTextOption,
  commonMediumFormatValueOption,
  getClassName,
  commonMediumTextOption,
  commonMediumValueOption,
  getFormatter,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import dayjs from 'dayjs';

// 通用搜索组件配置
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
    type: EFormItemType.SELECT,
    label: '仓位参数',
    default: [],
    key: 'position',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { position: value.join(';') };
    },
  },
];

const centerHeaderAlign = {
  ...commonMediumFormatValueOption,
  width: 100,
};

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    { ...commonSeqOption },
    {
      ...commonMediumTextOption,
      field: 'Factory',
      title: '厂区',
    },

    {
      ...commonMediumValueOption,
      field: 'List',
      columnType: EColumnType.KEYS_VALUES,
      sortable: true,
      className: getClassName(),
      formatter: getFormatter(),
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/factoryDetail';
        },
        getPathParams: ({ row, column }) => {
          const { OrgCode } = row;
          const { title } = column;
          console.log(dayjs(title), OrgCode);

          return {
            date: dayjs(title),
            orgCode: OrgCode,
          };
        },
      },
      exportMethod: ({ row, column }) => {
        return transThouIntEx(row[column.field], '', 2);
      },
    },
    // {
    //   ...commonTextOption,
    //   field: 'LibraryAge',
    //   title: '最高库龄',
    // },
    {
      ...centerHeaderAlign,
      field: 'Env',
      title: '环比',
      width: 70,
      className: getClassName(),
      exportMethod: ({ column, row }) => transThouIntEx(row[column.field], '', 2),
    },
  ];
  return columns;
};
