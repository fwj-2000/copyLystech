import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { commonDateRangeFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

// // 通用搜索组件配置
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
