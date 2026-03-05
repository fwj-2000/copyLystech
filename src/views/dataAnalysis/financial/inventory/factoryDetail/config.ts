import type { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import dayjs from 'dayjs';
import {
  textOptionEasy,
  commonDateOption,
  commonSeqOption,
  commonLargeValueOption,
  commonMediumValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import { BaseVxeTableTypes, EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'date',
    getParam: value => {
      return { buDat: value.format('YYYY-MM-DD') };
    },
  },
];

const textOptionEasyModified = {
  ...textOptionEasy,
  filters: [{ data: [] }],
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT,
  },
  width: 80,
};
const commonLargeValueOptionModified = {
  ...commonLargeValueOption,
  formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 2, true),
};
const commonMediumValueOptionModified = {
  ...commonMediumValueOption,
  formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 2, true),
};

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    commonSeqOption,
    {
      ...textOptionEasyModified,
      title: '公司',
      width: 175,
      field: 'company',
    },
    {
      ...textOptionEasyModified,
      title: '公司代码',
      width: 80,
      field: 'companyCode',
    },
    {
      ...textOptionEasyModified,
      title: '库存分类',
      width: 80,
      field: 'datasource',
    },
    {
      ...textOptionEasyModified,
      title: '厂区名称',
      field: 'factory',
    },

    {
      ...textOptionEasyModified,
      title: '周别',
      field: 'week',
    },
    {
      ...textOptionEasyModified,
      title: '料号',
      field: 'matnr',
    },

    {
      ...textOptionEasyModified,
      title: '工厂代码',
      field: 'werks',
    },
    {
      ...textOptionEasyModified,
      title: '库存地点',
      field: 'lgort',
    },
    {
      ...textOptionEasyModified,
      title: '库存地点描述',
      width: 100,
      field: 'address',
    },
    {
      ...textOptionEasyModified,
      title: '批次',
      field: 'charg',
    },
    {
      ...commonLargeValueOptionModified,
      width: 80,
      title: '成本单价', //单价
      field: 'stprs',
    },

    // 收货数量
    {
      ...commonLargeValueOptionModified,
      title: '收货数量',
      field: 'menge',
    },
    {
      ...commonLargeValueOptionModified,
      title: '总金额',
      width: 75,
      field: 'zdmbtr',
    },
    {
      ...textOptionEasyModified,
      title: '金额区间',
      field: 'zdmbtrRange',
    },
    {
      ...textOptionEasyModified,
      title: '业务范围',
      field: 'gsber',
    },
    {
      ...textOptionEasyModified,
      title: '业务范围描述',
      width: 100,
      field: 'source',
    },
    {
      ...textOptionEasyModified,
      title: '是否保税',
      field: 'isBonded',
    },
    {
      ...commonDateOption,
      ...textOptionEasyModified,
      title: '过账日期',
      field: 'budat',
    },

    {
      ...textOptionEasyModified,
      title: '产品类别',
      field: 'cplb',
    },

    {
      ...textOptionEasyModified,
      title: '外部项目',
      field: 'custProjectName',
    },
    {
      ...textOptionEasyModified,
      title: '内部项目',
      field: 'ownProjectName',
    },
  ];
  return columns;
};
// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  { type: EFormItemType.INPUT, label: '公司', default: '', key: 'company' },
  { type: EFormItemType.INPUT, label: '库存分类', default: '', key: 'datasource' },
  { type: EFormItemType.INPUT, label: '公司代码', default: '', key: 'companyCode' },
  { type: EFormItemType.INPUT, label: '是否良品', default: '', key: 'isGoodProduct' },
  { type: EFormItemType.INPUT, label: '料号', default: '', key: 'matnr' },
  { type: EFormItemType.INPUT, label: '工厂代码', default: '', key: 'werks' },
  { type: EFormItemType.INPUT, label: '库存地点', default: '', key: 'lgort' },
  { type: EFormItemType.INPUT, label: '批次', default: '', key: 'charg' },
  { type: EFormItemType.INPUT, label: '金额区间', default: '', key: 'zdmbtrRange' },
  { type: EFormItemType.INPUT, label: '是否保税', default: '', key: 'isBonded' },
  { type: EFormItemType.INPUT, label: '内部项目名称', default: '', key: 'ownProjectName' },
  { type: EFormItemType.INPUT, label: '外部项目', default: '', key: 'custProjectName' },
  // { type: EFormItemType.INPUT, label: '新物料编号', default: '', key: 'matnrNew' },
  { type: EFormItemType.INPUT, label: '业务范围', default: '', key: 'gsber' },
];
