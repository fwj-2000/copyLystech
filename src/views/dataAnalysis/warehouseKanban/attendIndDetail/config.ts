import {
  commonMiniTextOption,
  commonTextOption,
  commonMediumTextOption,
  commonLargeTextOption,
  commonValueOption,
  commonMiniValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonDayFormOptions } from '/@/views/dataAnalysis/config';
import { commonOrgCodeTreeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';

export const formOptions: TFormItemOption[] = [
  commonOrgCodeTreeSelectFormOptions,
  commonDayFormOptions,
  {
    type: EFormItemType.SELECT,
    default: '',
    label: '是否异常',
    key: 'isAbnormal',
    options: [
      {
        text: '全部',
        value: '',
      },
      {
        text: '是',
        value: '1',
      },
      {
        text: '否',
        value: '0',
      },
    ],
  },
];

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  // 员工工号	员工姓名	员工类型	直间分类	仓库分类	科室	最小部门	岗位	状态	工作类型
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '员工工号',
    key: 'workNo',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '员工姓名',
    key: 'cName',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '员工类型',
    key: 'gzclsName',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '直间分类',
    key: 'ildTypeName',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '仓库类型',
    key: 'ckType',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '最小部门',
    key: 'simName',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '岗位',
    key: 'postName',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '状态',
    key: 'empStateCh',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '工作类型',
    key: 'workType',
  },

  // 部门层级5	部门层级6	部门层级7	部门层级8
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '部门层级6',
    key: 'deptNameLevel6',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '部门层级7',
    key: 'deptNameLevel7',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '部门层级8',
    key: 'deptNameLevel8',
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    {
      ...commonTextOption,
      title: '考勤日期',
      field: 'kqDateStr',
    },
    {
      ...commonTextOption,
      title: '员工工号',
      field: 'workNo',
    },
    {
      ...commonTextOption,
      title: '员工姓名',
      field: 'cName',
    },
    {
      ...commonTextOption,
      title: '员工类型',
      field: 'gzclsName',
    },
    {
      ...commonTextOption,
      title: '直间分类',
      field: 'ildTypeName',
    },
    {
      ...commonTextOption,
      title: '仓库类型',
      field: 'ckType',
    },
    {
      ...commonMiniTextOption,
      title: '科室',
      field: 'dataSource',
    },
    {
      ...commonMiniTextOption,
      title: '最小部门',
      field: 'simName',
    },
    {
      ...commonMiniTextOption,
      title: '岗位',
      field: 'postName',
    },
    {
      ...commonTextOption,
      title: '状态',
      field: 'empStateCh',
    },
    // { ...commonMiniTextOption, title: '仓库类型', field: 'ckType' },
    {
      ...commonMediumTextOption,
      title: '工作类型',
      field: 'workType',
    },
    {
      ...commonMediumTextOption,
      title: '排班班次',
      field: 'bcName',
    },
    {
      ...commonValueOption,
      title: '连班天数',
      field: 'cntiWorkDays',
    },
    {
      ...commonMiniValueOption,
      title: '天工时',
      field: 'dayTime',
    },
    {
      ...commonTextOption,
      title: '系统备注',
      field: 'feedback',
    },
    {
      ...commonLargeTextOption,
      title: '第一次刷卡时间',
      field: 'brushTime1',
    },
    {
      ...commonLargeTextOption,
      title: '第二次刷卡时间',
      field: 'brushTime2',
    },
    {
      ...commonTextOption,
      title: '部门层级5',
      field: 'deptNameLevel5',
    },
    {
      ...commonTextOption,
      title: '部门层级6',
      field: 'deptNameLevel6',
    },
    {
      ...commonTextOption,
      title: '部门层级7',
      field: 'deptNameLevel7',
    },
    {
      ...commonTextOption,
      title: '部门层级8',
      field: 'deptNameLevel8',
    },
    {
      ...commonTextOption,
      title: '档案分组',
      field: 'groupName',
    },
    {
      ...commonTextOption,
      title: '族群分组',
      field: 'posClanNames',
    },
    {
      ...commonMediumTextOption,
      title: '考勤异常备注',
      field: 'markName',
    },
  ];
};
