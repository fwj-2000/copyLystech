import { commonValueOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { EFormItemType, TFormItemOption, ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, getDateRangeDim, parseDateByDimension } from '/@/views/dataAnalysis/utils';

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
    label: '工单类型',
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

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'factory',
      title: '厂区',
    },
    {
      ...commonMediumTextOption,
      field: 'list',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: {
        ...commonValueOption,
        slots: {
          default: ESlotDefault.LINK_DEFAULT,
        },
        params: {
          getPathUrl: ({ column }) => {
            const { field } = column;
            return ['环比', '累计'].some(item => field.includes(item)) ? '' : '/dataAnalysis/financial/inventory/manage/process/detail';
          },
          getPathParams: ({ row, column, searchFormValue }) => {
            const { field } = column;
            const { orgCode } = row;
            const { dimension, auartDm } = searchFormValue;
            // console.log('auartDm.split ', auartDm); //2025WK35 NaN
            return {
              orgCode: orgCode ?? searchFormValue.orgCode,
              dimension,
              auartDm,
              // auartDm: Array.isArray(auartDm) ? auartDm.join(';') : '',
              dateRange: parseDateByDimension(field.split('_')[0], dimension),
            };
          },
        },

        formatter: ({ cellValue, column }) => {
          const { title } = column;
          return ['占比'].includes(title as string) ? transThouIntEx(cellValue, '%', 1) : transThouIntEx(cellValue, '', 0, true);
        },
        exportMethod: ({ row, column }) => {
          const { title } = column;
          return ['占比'].includes(title as string) ? transThouIntEx(row[column.field], '%', 1) : transThouIntEx(row[column.field], '', 4);
        },
      },
    },
  ];

  return columns;
};
