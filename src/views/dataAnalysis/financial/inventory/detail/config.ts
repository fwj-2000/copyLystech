import dayjs from 'dayjs';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonDateOption,
  commonLargeValueOption,
  commonMediumTextOption,
  commonMediumValueOption,
  commonMiniTextOption,
  commonTextOption,
  commonMediumFormatValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '公司',
    default: '',
    key: 'company',
  },
  {
    type: EFormItemType.INPUT,
    label: '公司代码',
    default: '',
    key: 'companyCode',
  },
  {
    type: EFormItemType.INPUT,
    label: '库存分类',
    default: '',
    key: 'dataSource',
  },
  {
    type: EFormItemType.INPUT,
    label: '厂区名称',
    default: '',
    key: 'sbuName',
  },
  {
    type: EFormItemType.INPUT,
    label: '周别',
    default: '',
    key: 'week',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品类型',
    default: '',
    key: 'types',
  },
  {
    type: EFormItemType.INPUT,
    label: '是否良品',
    default: '',
    key: 'isGoodProduct',
  },
  {
    type: EFormItemType.INPUT,
    label: '料号',
    default: '',
    key: 'matnr',
  },
  {
    type: EFormItemType.INPUT,
    label: '工厂代码',
    default: '',
    key: 'werks',
  },
  {
    type: EFormItemType.INPUT,
    label: '库存地点',
    default: '',
    key: 'lgort',
  },
  {
    type: EFormItemType.INPUT,
    label: '库存地点描述',
    default: '',
    key: 'address',
  },
  {
    type: EFormItemType.INPUT,
    label: '批次',
    default: '',
    key: 'charg',
  },
  {
    type: EFormItemType.INPUT,
    label: '业务范围',
    default: '',
    key: 'gsber',
  },
  {
    type: EFormItemType.INPUT,
    label: '是否保税',
    default: '',
    key: 'isBonded',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品类别',
    default: '',
    key: 'cplb',
  },
  {
    type: EFormItemType.INPUT,
    label: '类别2',
    default: '',
    key: 'lb2',
  },
  {
    type: EFormItemType.INPUT,
    label: '外部项目区分',
    default: '',
    key: 'custProjectName',
  },
  {
    type: EFormItemType.INPUT,
    label: '库龄',
    default: '',
    key: 'zdays',
  },
  {
    type: EFormItemType.SELECT,
    label: '是否计提',
    options: [
      {
        text: '已计提',
        value: '1',
      },
      {
        text: '未计提',
        value: '0',
      },
    ],
    default: '',
    key: 'isJt',
  },
];

// 表单配置
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
const priceFormatter = ({ cellValue }) => transThouIntEx(cellValue, '', 2, true);

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMiniTextOption,
      title: '序号',
      type: 'seq',
      field: 'index',
    },
    {
      ...commonTextOption,
      title: '公司',
      field: 'Company',
      width: 220,
    },
    {
      ...commonMediumTextOption,
      title: '公司代码',
      field: 'CompanyCode',
    },
    {
      ...commonMediumTextOption,
      title: '库存分类',
      field: 'DataSource',
    },
    {
      ...commonMediumTextOption,
      title: '厂区名称',
      field: 'SbuName',
    },
    {
      ...commonMediumTextOption,
      title: '周别',
      field: 'Week',
    },
    {
      ...commonMediumTextOption,
      title: '产品类型',
      field: 'Types',
    },
    {
      ...commonMediumTextOption,
      title: '是否良品',
      field: 'IsGoodProduct',
    },
    {
      ...commonTextOption,
      title: '料号',
      field: 'Matnr',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '工厂代码',
      field: 'Werks',
    },
    {
      ...commonMediumTextOption,
      title: '库存地点',
      field: 'Lgort',
    },
    {
      ...commonMediumTextOption,
      title: '库存地点描述',
      field: 'Address',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '批次',
      field: 'Charg',
    },
    {
      ...commonMediumValueOption,
      title: '成本单价',
      field: 'Price',
      formatter: priceFormatter,
    },
    {
      ...commonMediumValueOption,
      title: '财务月结后成本单价',
      field: 'Sprice',
      width: 160,
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '收货数量',
      field: 'Menge',
    },
    {
      ...commonMediumValueOption,
      title: '已计提金额',
      field: 'YjtValue',
      formatter: priceFormatter,
    },
    {
      ...commonMediumValueOption,
      title: '总金额',
      field: 'Zdmbtr',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '<30天数量',
      field: 'Menge0',
    },
    {
      ...commonLargeValueOption,
      title: '<30天金额',
      field: 'Dmbtr0',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '30 - 45 数量',
      field: 'Menge1',
    },
    {
      ...commonLargeValueOption,
      title: '30 - 45 金额',
      field: 'Dmbtr1',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '45 - 60 数量',
      field: 'Menge2',
    },
    {
      ...commonLargeValueOption,
      title: '45 - 60 金额',
      field: 'Dmbtr2',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '60 - 90 数量',
      field: 'Menge3',
    },
    {
      ...commonLargeValueOption,
      title: '60 - 90 金额',
      field: 'Dmbtr3',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '90 - 180 数量',
      field: 'Menge4',
    },
    {
      ...commonLargeValueOption,
      title: '90 - 180 金额',
      field: 'Dmbtr4',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '180 - 360 数量',
      field: 'Menge5',
    },
    {
      ...commonLargeValueOption,
      title: '180 - 360 金额',
      field: 'Dmbtr5',
      formatter: priceFormatter,
    },
    {
      ...commonMediumFormatValueOption,
      title: '360以上 数量',
      field: 'Menge6',
    },
    {
      ...commonLargeValueOption,
      title: '360以上 金额',
      field: 'Dmbtr6',
      formatter: priceFormatter,
    },
    {
      ...commonMediumTextOption,
      title: '业务范围',
      field: 'Gsber',
    },
    {
      ...commonMediumTextOption,
      title: '业务范围描述',
      field: 'Source',
    },
    {
      ...commonMediumTextOption,
      title: '是否保税',
      field: 'IsBonded',
    },
    {
      ...commonDateOption,
      title: '过账日期',
      field: 'BuDat',
    },
    {
      ...commonMediumTextOption,
      title: '产品类别',
      field: 'Cplb',
    },
    {
      ...commonMediumTextOption,
      title: '类别2',
      field: 'Lb2',
    },
    {
      ...commonMediumTextOption,
      title: '外部项目区分',
      field: 'CustProjectName',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '内部项目',
      field: 'OwnProjectName',
    },
    {
      ...commonMediumTextOption,
      title: '库龄',
      field: 'Zdays',
    },
    {
      ...commonTextOption,
      title: '计量单位',
      field: 'Meins',
    },
    {
      ...commonTextOption,
      title: '平米数',
      field: 'MmMenge',
    },
  ];
  return columns;
};
