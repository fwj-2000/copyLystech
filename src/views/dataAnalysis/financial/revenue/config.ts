// revenue 公共的配置
import dayjs from 'dayjs';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { EFormItemType, ETimeDimension, TFormItemOption, ISelectOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

export const timeDimensionOptions: ISelectOption[] = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const dimensionCommonFormOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.MONTH,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(4, 'month'), dayjs().subtract(1, 'month')],
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
];
