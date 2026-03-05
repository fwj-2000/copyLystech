import { commonTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
// import dayjs from 'dayjs';
// import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
// import { ETimeDimension } from '/@/views/dataAnalysis/types';
import { commonDateRangeFormOptions, commonDayWeekMonthFormOptions } from '/@/views/dataAnalysis/config';
import xeUtils from 'xe-utils';

export const formOptions: TFormItemOption[] = [
  commonDayWeekMonthFormOptions,
  commonDateRangeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: '2',
    label: '统计分组',
    key: 'deptid',
    attrs: {
      style: {
        width: '100px',
      },
    },
    options: [
      { text: '汇总', value: '1' },
      { text: '仓库分类', value: '2' },
    ],
  },
  // {
  //   type: EFormItemType.RANGE_PICKER,
  //   default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
  //   key: 'dateRange',
  //   pickerKey: 'dimension',
  //   attrs: {
  //     picker: 'day',
  //   },
  //   getParam: value => {
  //     const { startDim, endDim } = getDateRangeDim(ETimeDimension.DAY, value);
  //     return { startDim, endDim };
  //   },
  // },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      title: '仓库分类',
      field: 'title1',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      title: '指标',
      field: 'title2',
    },
    {
      ...commonMediumValueOption,
      columnType: EColumnType.KEYS_VALUES,
      field: 'list',
      formatter: ({ cellValue }) => {
        if (!cellValue && cellValue !== 0) return '';
        if (xeUtils.isString(cellValue)) return cellValue;
        return xeUtils.commafy(cellValue, { digits: 0 });
      },
    },
  ];
  return columns;
};
