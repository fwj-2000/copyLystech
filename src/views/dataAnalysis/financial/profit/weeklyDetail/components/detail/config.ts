import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { VxeGridPropTypes } from 'vxe-table';
import { commonMediumTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import XEUtils from 'xe-utils';
import { EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
    key: 'dateRange',
    attrs: {
      picker: 'week',
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, value);
      return { startTime: startDim, endTime: endDim };
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'metric',
    attrs: {
      placeholder: '请输入指标',
    },
  },
];

// 获取表头配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    {
      ...commonMediumTextOption,
      field: 'factory',
      title: '厂区',
    },
    {
      ...commonMediumTextOption,
      field: 'metric',
      title: '指标',
    },
    {
      ...commonMediumValueOption,
      columnType: EColumnType.KEYS_VALUES,
      field: 'list',
      formatter: ({ cellValue }) => {
        if (!cellValue) {
          return '';
        }
        return XEUtils.commafy(cellValue, { digits: 2 });
      },
    },
  ];
  return columns;
};
