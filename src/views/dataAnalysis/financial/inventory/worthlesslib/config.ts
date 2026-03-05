import { commonDateRangeFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonTextOption, commonMediumFormatValueOption, getClassName } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import { getZdmbtrRangeValue } from './utils';
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
];

// 提取公共路径常量
const DETAIL_PATH = '/dataAnalysis/financial/inventory/factoryDetail';

// 创建列的通用方法
const createLinkColumn = (field: string, title: string, width: number = 70): BaseVxeTableTypes.Column => {
  return {
    ...commonMediumFormatValueOption,
    field,
    title,
    width,
    slots: {
      default: ESlotDefault.LINK_DEFAULT,
    },
    params: {
      getPathUrl: ({ row }) => {
        const { factory } = row;
        return factory !== 'Total' ? DETAIL_PATH : '';
      },
      getPathParams: ({ row, column }) => {
        const { orgCode, timeDate } = row;
        const { title } = column;
        const date = dayjs(timeDate);
        return {
          date,
          orgCode,
          zdmbtrRange: getZdmbtrRangeValue(title),
        };
      },
    },
    className: getClassName(),
    exportMethod: ({ column, row }) => transThouIntEx(row[column.field], '', 2),
  };
};

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      mergeConfig: {
        needMergeRow: true,
      },
      field: 'factory',
      title: '厂区',
    },
    {
      ...commonTextOption,
      field: 'timeDate',
      title: '日期',
    },
    createLinkColumn('tenw', '10W'),
    createLinkColumn('tenToTwenty', '20W'),
    createLinkColumn('twentyToForty', '30W'),
    createLinkColumn('thirtyToForty', '40W'),
    createLinkColumn('fortyTofifty', '50W'),
    createLinkColumn('fiftyToSixty', '60W'),
    createLinkColumn('sixtyToSeventy', '70W'),
    createLinkColumn('seventyToEighty', '80W'),
    createLinkColumn('eightyToninety', '90W'),
    createLinkColumn('ninetyToHundred', '100W'),
    createLinkColumn('hundred', '100W以上', 90),
  ];
  return columns;
};
