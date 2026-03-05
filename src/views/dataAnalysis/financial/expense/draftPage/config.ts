import dayjs from 'dayjs';
import { cloneDeep, merge } from 'lodash-es';
import { commonFyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonLargeTextOption, commonMediumTextOption, commonTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';

import { VxeGridPropTypes } from 'vxe-table';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

// 表单
export const filterOptions: TFormItemOption[] = [
  {
    label: '成本中心',
    type: EFormItemType.INPUT,
    default: '',
    key: 'cbzx',
  },
  {
    label: '成本中心描述',
    type: EFormItemType.INPUT,
    default: '',
    key: 'cbzxms',
  },
];
export const formOptions: TFormItemOption[] = [
  commonFyOrgCodeFormOptions,
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.MONTH,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.MONTH, value);
      return { startTime: startDim, endTime: endDim };
    },
  },
];

// 通用字段配置
export const allColumns = {
  Year: {
    ...commonTextOption,
    title: '财年',
  },
  Month: {
    ...commonTextOption,
    title: '月',
  },
  Factory: {
    ...commonTextOption,
    title: '厂区',
  },
  Bu: {
    ...commonTextOption,
    title: 'Bu',
  },
  Sbu: {
    ...commonMediumTextOption,
    title: 'Sbu',
  },
  ImportDate: {
    ...commonTextOption,
    title: '导入时间',
  },
  Ywfw: {
    ...commonMediumTextOption,
    title: '业务范围',
    formatter: ({ cellValue }) => {
      return `${cellValue}⠀`;
    },
  },
  YwfwMs: {
    ...commonLargeTextOption,
    title: '业务范围描述',
  },
  YwfwYs: {
    ...commonLargeTextOption,
    title: '分摊前业务范围',
    formatter: ({ cellValue }) => {
      return `${cellValue}⠀`;
    },
  },
  YwfwMsYs: {
    ...commonLargeTextOption,
    title: '分摊前业务范围描述',
  },
  Department: {
    ...commonMediumTextOption,
    title: '部门',
  },
  Dygbsywd: {
    ...commonLargeTextOption,
    title: '对应管报损益维度',
  },
  Fysx: {
    ...commonMediumTextOption,
    title: '费用属性',
  },
  Fyxz: {
    ...commonMediumTextOption,
    title: '费用性质',
  },
  Sjfl: {
    ...commonMediumTextOption,
    title: '数据分类',
  },
  DataSource: {
    ...commonMediumTextOption,
    title: '数据来源',
  },
  Gnfw: {
    ...commonMediumTextOption,
    title: '功能范围',
  },
  Gnfwms: {
    ...commonLargeTextOption,
    title: '功能范围描述',
  },
  Km: {
    ...commonMediumTextOption,
    title: '科目',
  },
  Kmms: {
    ...commonMediumTextOption,
    title: '科目描述',
  },
  Mjkm: {
    ...commonMediumTextOption,
    title: '末级科目',
  },
  Yskm: {
    ...commonMediumTextOption,
    title: '预算科目',
  },
  Fylb: {
    ...commonMediumTextOption,
    title: '费用类别',
  },
  Cbzx: {
    ...commonMediumTextOption,
    title: '成本中心',
  },
  Cbzxms: {
    ...commonLargeTextOption,
    title: '成本中心描述',
  },
  Cbysz: {
    ...commonLargeTextOption,
    title: '成本元素组',
  },
  Cbyszms: {
    ...commonLargeTextOption,
    title: '成本元素组描述',
  },
  Jthbje: {
    ...commonLargeTextOption,
    title: '集团货币金额',
  },
  Ejkm: {
    ...commonLargeTextOption,
    title: ' 二级科目',
  },
};
// 获取表头配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    { field: 'Year' },
    { field: 'Month' },
    { field: 'Factory' },
    // { field: 'Bu' },
    // { field: 'Sbu' },
    { field: 'Ywfw' },
    { field: 'YwfwMs' },
    { field: 'YwfwYs' },
    { field: 'YwfwMsYs' },
    { field: 'Department' },
    { field: 'Dygbsywd' },
    { field: 'Fysx' },
    { field: 'Fyxz' },
    { field: 'Sjfl' },
    { field: 'DataSource' },
    { field: 'Gnfw' },
    { field: 'Gnfwms' },
    { field: 'Km' },
    { field: 'Kmms' },
    { field: 'Mjkm' },
    { field: 'Ejkm' },
    { field: 'Yskm' },
    { field: 'Fylb' },
    { field: 'Cbzx' },
    { field: 'Cbzxms' },
    { field: 'Cbysz' },
    { field: 'Cbyszms' },
    { field: 'Jthbje' },
  ];
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field]), item);
  });
};
