import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    ...commonSyOrgCodeFormOptions,
    default: [],
    attrs: {
      multiple: true,
    },
    getParam: value => {
      return { orgCode: Array.isArray(value) ? value.join(';') : value };
    },
    setDefault: options => {
      const option: any = options[0] ?? {
        value: 'MQ',
      };
      return [option.value];
    },
  },
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
    default: [dayjs().subtract(4, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];
