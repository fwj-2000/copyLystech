import {
  commonMiniTextOption,
  commonMediumTextOption,
  commonTextOption,
  commonLargeTextOption,
  commonMiniValueOption,
  commonDateTimeSecondOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonDayFormOptions } from '/@/views/dataAnalysis/config';
import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';

export const formOptions: TFormItemOption[] = [commonOrgCodeSelectFormOptions, commonDayFormOptions];

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  // 工厂代码	工厂名称	库存地点	库存地点描述	库存状态	物料凭证	物料	数量	单位	单位描述	检验批号	物料名称
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '工厂代码',
    key: 'werks',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '工厂名称',
    key: 'name1',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '库存地点',
    key: 'lgort',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '库存地点描述',
    key: 'lgobe',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料凭证',
    key: 'mblnr',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料',
    key: 'matnr',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '数量',
    key: 'menge',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '单位',
    key: 'meins',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '单位描述',
    key: 'msehl2',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '检验批号',
    key: 'prueflos',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料名称',
    key: 'maktx',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '库存状态',
    key: 'insmk1',
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    { ...commonMediumTextOption, title: '过账日期', field: 'budatMkpfStr' },
    { ...commonMiniTextOption, title: '厂区', field: 'factory' },
    { ...commonMiniTextOption, title: '仓库类型', field: 'ckType' },
    { ...commonMiniTextOption, title: '工厂代码', field: 'werks' },
    { ...commonMiniTextOption, title: '工厂名称', field: 'name1' },
    { ...commonMiniTextOption, title: '库存地点', field: 'lgort' },
    { ...commonLargeTextOption, title: '库存地点描述', field: 'lgobe' },
    { ...commonMiniTextOption, title: '库存状态', field: 'insmk1' },
    { ...commonLargeTextOption, title: '物料凭证', field: 'mblnr' },
    { ...commonMiniTextOption, title: '物料', field: 'matnr' },
    // { ...commonMiniTextOption, title: '过账人', field: 'usnamMkpf' },
    // { ...commonMiniTextOption, title: '单号', field: 'mblnr' },
    { ...commonMiniValueOption, title: '数量', field: 'menge' },
    { ...commonMiniTextOption, title: '单位', field: 'meins' },
    { ...commonMiniTextOption, title: '单位描述', field: 'msehl2' },
    { ...commonMiniTextOption, title: '检验批号', field: 'prueflos' },
    { ...commonMiniTextOption, title: '物料名称', field: 'maktx' },
    { ...commonTextOption, title: '整支日期', field: 'vezeiterfTimeStr' },
    { ...commonLargeTextOption, title: '质检日期', field: 'vdatumStr' },
    { ...commonMediumTextOption, title: '质检时间', field: 'vezeiterf' },
    { ...commonMediumTextOption, title: '质检耗时时间', field: 'diffHours' },
    // { ...commonMediumTextOption, title: '入库时间', field: 'vezeitaen' },
    // { ...commonMediumTextOption, title: '凭证录入日期', field: 'cpudt' },
    // { ...commonMediumTextOption, title: '入库日期', field: 'vaedatum' },
    // { ...commonMiniTextOption, title: '发料', field: 'name1' },
    { ...commonDateTimeSecondOption, title: '数据同步时间', field: 'datasourceTime' },
  ];
};
