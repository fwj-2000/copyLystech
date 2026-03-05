import { commonMiniTextOption, commonTextOption, commonMediumTextOption, commonMiniValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';
import { commonDayFormOptions } from '/@/views/dataAnalysis/config';
import dayjs from 'dayjs';

export const formOptions: TFormItemOption[] = [commonOrgCodeSelectFormOptions, commonDayFormOptions];

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '产品类型',
    key: 'types',
  },
  // 仓库分类	物料编码
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '仓库分类',
    key: 'ckType',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料编码',
    key: 'material',
  },
  // SAP工厂代码	SAP仓位	物料生产日期	物料有效日期	质保状态	Lot号	规格	唯一码 储位ID	储位名称
  {
    type: EFormItemType.INPUT,
    default: '',
    label: 'SAP工厂代码',
    key: 'sapFactoryCode',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: 'SAP仓位',
    key: 'sapRepertoryCode',
  },
  {
    type: EFormItemType.DATE_PICKER,
    label: '物料生产日期',
    key: 'dateCode',
    default: '',
    getParam: value => {
      return { dateCode: value ? dayjs(value).format('YYYY-MM-DD') : '' };
    },
  },
  {
    type: EFormItemType.DATE_PICKER,
    label: '物料有效日期',
    key: 'expiryDateStr',
    default: '',
    getParam: value => {
      return { expiryDateStr: value ? dayjs(value).format('YYYY-MM-DD') : '' };
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '质保状态',
    key: 'zbStatus',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: 'Lot号',
    key: 'lotNo',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '规格',
    key: 'spec',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '唯一码',
    key: 'idNo',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '储位ID',
    key: 'storageId',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '储位名称',
    key: 'storageName',
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    { ...commonMediumTextOption, title: '数据处理时间', field: 'etlDateStr' },
    { ...commonMiniTextOption, title: '厂区', field: 'factory' },
    { ...commonMiniTextOption, title: '仓库分类', field: 'ckType' },
    {
      ...commonTextOption,
      title: '物料编码',
      field: 'material',
    },
    {
      ...commonMiniValueOption,
      title: '数量',
      field: 'qty',
    },
    { ...commonTextOption, title: '宽幅', field: 'matnrLast4' },
    { ...commonMiniTextOption, title: '物料面积', field: 'matnrArea' },
    {
      ...commonTextOption,
      title: 'SAP工厂代码',
      field: 'sapFactoryCode',
    },
    {
      ...commonTextOption,
      title: 'SAP仓位',
      field: 'sapRepertoryCode',
    },
    {
      ...commonTextOption,
      title: '物料生产日期',
      field: 'dateCode',
    },
    {
      ...commonTextOption,
      title: '物料有效日期',
      field: 'expiryDateStr',
    },
    {
      ...commonTextOption,
      title: '质保状态',
      field: 'zbStatus',
    },
    {
      ...commonTextOption,
      title: 'Lot号',
      field: 'lotNo',
    },
    {
      ...commonTextOption,
      title: '规格',
      field: 'spec',
    },
    {
      ...commonTextOption,
      title: '唯一码',
      field: 'idNo',
    },
    // {
    //   ...commonMiniTextOption,
    //   title: '是否出库',
    //   field: 'isOutStr',
    // },
    // {
    //   ...commonMiniTextOption,
    //   title: '来源类型',
    //   field: 'sourceType',
    // },
    {
      ...commonMiniTextOption,
      title: '储位ID',
      field: 'storageId',
    },
    // {
    //   ...commonMiniTextOption,
    //   title: 'SAP仓位',
    //   field: 'sapRepertoryCode',
    // },
    { ...commonTextOption, title: '储位名称', field: 'storageName' },
  ];
};
