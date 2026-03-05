import { getClassName, getFormatter } from '../../config';
import { commonMediumTextOption, commonValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

// 首页-所有字段
export const columns: BaseVxeTableTypes.Columns = [
  {
    ...commonMediumTextOption,
    title: '维度类型',
    field: 'dimesionType',
    columnType: EColumnType.KEYS_VALUES,
    className: 'bg-white',
    mergeConfig: {
      needMergeRow: true,
    },
  },
  {
    ...commonMediumTextOption,
    field: 'category',
    title: '指标',
    mergeConfig: {
      needMergeRow: true,
    },
  },
  {
    ...commonMediumTextOption,
    field: 'metric',
    title: '类目',
  },
  {
    ...commonValueOption,
    field: 'vList',
    columnType: EColumnType.KEYS_VALUES,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
];
