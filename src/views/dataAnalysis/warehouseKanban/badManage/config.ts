import {
  commonMiniTextOption,
  commonTextOption,
  commonMediumTextOption,
  commonLargeTextOption,
  commonValueOption,
  commonMediumFormatValueOptionShowZero as ShowZeroType,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';

import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';

export const formOptions: TFormItemOption[] = [
  commonOrgCodeSelectFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'budat',
    getParam: value => {
      return {
        budat: value.format('YYYY-MM-DD'),
      };
    },
  },
];

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '产品类型',
    key: 'types',
  },
  // 产品类型	是否良品	料号	工厂代码	库存地点	批次 是否保税
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '是否良品',
    key: 'isGoodProduct',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '料号',
    key: 'matnr',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '工厂代码',
    key: 'werks',
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
    label: '批次',
    key: 'charg',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '是否保税',
    key: 'isBonded',
  },
];

const commonMediumFormatValueOptionShowZero: Partial<BaseVxeTableTypes.Column> = {
  ...ShowZeroType,
  width: 70,
};
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    { ...commonMiniTextOption, title: '厂区', field: 'factory' },
    { ...commonMiniTextOption, title: '公司', field: 'company' },
    { ...commonMiniTextOption, title: '公司代码', field: 'companyCode' },
    { ...commonMiniTextOption, title: '数据来源', field: 'datasource' },
    // { ...commonValueOption, title: '周数', field: 'week' },
    // { ...commonTextOption, title: '产品类型缩写', field: 'typeName' },
    // { ...commonTextOption, title: '产品类型中文', field: 'typeNameCn' },
    { ...commonMiniTextOption, title: '产品类型', field: 'types' },
    { ...commonMiniTextOption, title: '是否良品', field: 'isGoodProduct' },
    { ...commonMiniTextOption, title: '物料', field: 'matnr' },
    { ...commonMiniTextOption, title: ' 工厂代码', field: 'werks' },
    { ...commonMiniTextOption, title: '库存地点', field: 'lgort' },
    { ...commonMiniTextOption, title: '批次', field: 'charg' },
    { ...commonMediumFormatValueOptionShowZero, title: '数量', field: 'menge' },
    { ...commonMediumFormatValueOptionShowZero, title: '总金额', field: 'zdmbtr' },
    { ...commonMediumFormatValueOptionShowZero, title: '业务范围', field: 'gsber' },
    { ...commonLargeTextOption, title: '仓储地点描述列', field: 'name1' },
    { ...commonMiniTextOption, title: '来源', field: 'source' },
    { ...commonMiniTextOption, title: '地址', field: 'address' },
    { ...commonMediumTextOption, title: '是否保税', field: 'isBonded' },
    { ...commonMediumTextOption, title: '收货日期', field: 'budatStr' },
    { ...commonLargeTextOption, title: '数据处理日期', field: 'etlDateStr' },
    // { ...commonMediumTextOption, title: '产品类别', field: 'cplb' },
    // { ...commonMediumTextOption, title: '类别2', field: 'lb2' },
    { ...commonMediumTextOption, title: '库龄', field: 'zDays' },
    // { ...commonMediumTextOption, title: '内部项目', field: 'ownProjectName' },
    // { ...commonMediumTextOption, title: '外部项目', field: 'custProjectName' },
    // { ...commonMediumFormatValueOptionShowZero, title: '已计提', field: 'yjtValue' },
    // { ...commonMediumFormatValueOptionShowZero, title: '未计提', field: 'wjtValue' },
    { ...commonMiniTextOption, title: '计量单位', field: 'meins' },
    { ...commonMediumFormatValueOptionShowZero, title: '平米数', field: 'mmMenge' },
  ];
};
