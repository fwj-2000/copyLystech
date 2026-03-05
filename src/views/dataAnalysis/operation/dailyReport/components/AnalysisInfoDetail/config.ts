import { commonMediumTextOption, commonTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

// 时间稼动率-所有字段
export const timeUtilizationRateColumns: BaseVxeTableTypes.Columns = [
  {
    ...commonTextOption,
    title: '厂区',
    field: 'DataSource',
  },
  {
    ...commonMediumTextOption,
    title: '日期',
    field: 'EntDate',
  },
  {
    ...commonTextOption,
    title: '班次',
    field: 'Shift',
  },
  {
    ...commonTextOption,
    title: '机台',
    field: 'Machine',
  },
  {
    ...commonTextOption,
    title: '工单号',
    field: 'Fmanuorder',
  },
  {
    ...commonTextOption,
    title: '产品名',
    field: 'Product',
  },
  {
    ...commonTextOption,
    title: '状态',
    field: 'Empno',
  },
  {
    headerAlign: 'left',
    title: '问题分析',
    field: 'Cause',
  },
];

// 其他-所有字段
export const commonColumns: BaseVxeTableTypes.Columns = [
  {
    ...commonTextOption,
    title: '厂区',
    field: 'DataSource',
  },
  {
    ...commonMediumTextOption,
    title: '日期',
    field: 'EntDate',
  },
  {
    ...commonTextOption,
    title: '工号',
    field: 'Empno',
  },
  {
    headerAlign: 'left',
    title: '问题分析',
    field: 'Cause',
  },
];
