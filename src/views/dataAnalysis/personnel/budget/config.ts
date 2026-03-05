import { commonMediumTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import dayjs from 'dayjs';
import { getDateDim } from '../../utils';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import XEUtils from 'xe-utils';

// 表单配置
export const formOptions: TFormItemOption[] = [
  commonOrgCodeFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'week'),
    key: 'timeIndex',
    attrs: {
      picker: ETimeDimension.WEEK,
    },
    getParam: value => {
      const dateDim = getDateDim(value);
      return { timeIndex: dateDim };
    },
  },
];

// 导出表格字段配置
// 格式化显示
export const getFormatter = () => {
  return ({ row, cellValue: value }) => {
    if (!value) {
      return '';
    }
    const { IldtypeNames } = row;
    const isRate = IldtypeNames === '派遣工占比';
    if (isRate) {
      const percentageValue = Number.parseFloat(value);
      return `${percentageValue * 100}%`;
    }
    return XEUtils.commafy(value);
  };
};
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [
    {
      ...commonMediumTextOption,
      title: '厂区',
      field: 'OrgName',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonMediumTextOption,
      title: '部门',
      field: 'Dept',
    },
    {
      ...commonMediumTextOption,
      title: '直/间接分类',
      field: 'IldtypeNames',
    },
    {
      ...commonMediumTextOption,
      title: '岗位',
      field: 'HandMQ',
    },
    {
      ...commonMediumTextOption,
      title: '用工性质',
      field: 'EnterTypeName',
    },
    {
      ...commonMediumValueOption,
      title: '预算人力',
      field: 'MonthYsPeopleNum',
      formatter: getFormatter(),
    },
    {
      ...commonMediumValueOption,
      title: '上周实际',
      field: 'LastWeekSjPeopleNumZb',
      formatter: getFormatter(),
    },
    {
      ...commonMediumValueOption,
      title: '当周实际',
      field: 'CurrentWeekSjPeopleNumZb',
      formatter: getFormatter(),
    },
    {
      ...commonMediumValueOption,
      title: '环比',
      field: 'Huanbi',
      formatter: getFormatter(),
    },
    {
      ...commonMediumValueOption,
      title: '预算比',
      field: 'Yusuanbi',
      formatter: getFormatter(),
    },
  ];
  return columns;
};
