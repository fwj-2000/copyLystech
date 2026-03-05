import {
  commonTextOption,
  commonMediumTextOption,
  commonValueOption,
  commonMediumFormatValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { dimensionCommonFormOptions } from '../config';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
// 表单配置
export const formOptions: TFormItemOption[] = [...dimensionCommonFormOptions];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    { type: 'seq', title: '序号', width: 50, fixed: 'left' },
    {
      ...commonTextOption,
      title: '厂区',
      field: 'factory',
    },
    {
      ...commonMediumTextOption,
      title: '类型',
      field: 'metric',
    },
    {
      ...commonMediumFormatValueOption,
      columnType: EColumnType.KEYS_VALUES,
      field: 'list',
    },
  ];
  return columns;
};
