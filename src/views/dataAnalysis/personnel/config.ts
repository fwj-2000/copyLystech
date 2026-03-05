import dayjs from 'dayjs';
import { cloneDeep, merge } from 'lodash-es';
import { commonMediumTextOption, commonSeqOption, commonColumnOptions } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';

import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

// 表单配置
export const commonOptions: TFormItemOption[] = [
  commonOrgCodeFormOptions,
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateDim',
    attrs: {
      picker: ETimeDimension.WEEK,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, value);
      return { startDim, endDim };
    },
  },
];

// 通用字段配置
export const allColumns: Record<string, BaseVxeTableTypes.Column> = {
  seq: {
    ...commonSeqOption,
    fixed: 'left',
  },
  Factory: {
    ...commonColumnOptions,
    title: '厂区',
    fixed: 'left',
  },
  DeptNameLevel51: {
    ...commonMediumTextOption,
    title: '厂区',
    fixed: 'left',
  },
  DeptNameLevel5: {
    ...commonMediumTextOption,
    title: '部门',
    fixed: 'left',
  },
  Nationality: {
    ...commonMediumTextOption,
    title: '中方/越方',
    fixed: 'left',
  },
  MarkType: {
    ...commonMediumTextOption,
    title: '直间接分类',
    fixed: 'left',
  },
  PostName: {
    ...commonMediumTextOption,
    title: '岗位类型',
    fixed: 'left',
  },
};

// 获取表头配置
type TGetColumnsParams = Omit<BaseVxeTableTypes.Columns, 'field'> & { field: string }[];
export const getColumns = (columns: TGetColumnsParams) => {
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field as string]), item);
  });
};
