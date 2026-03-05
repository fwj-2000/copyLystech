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
import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';

const zStatuOptions = [
  {
    text: '创建',
    value: '01',
  },
  {
    text: '过账',
    value: '02',
  },
  {
    text: '删除',
    value: '03',
  },
  {
    text: '已冲销',
    value: '04',
  },
  {
    text: '在途',
    value: '05',
  },
  {
    text: '冲销后过账',
    value: '06',
  },
  {
    text: '锁定',
    value: '07',
  },
  {
    text: '作废',
    value: '08',
  },
  {
    text: 'OA审批中',
    value: '09',
  },
  {
    text: '审批完成',
    value: '10',
  },
];

export const formOptions: TFormItemOption[] = [
  commonOrgCodeSelectFormOptions,
  commonDayFormOptions, // 状态	长文本	是否转工单
  {
    type: EFormItemType.SELECT,
    default: [],
    label: '状态',
    key: 'zStatu',
    options: zStatuOptions,
    attrs: {
      mode: 'multiple',
    },
    getParam: (value: string[]) => ({ zStatu: Array.isArray(value) ? value.join(';') : value }),
  },
];
// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  // 工厂代码	工厂名称	单号	行号	物料凭证编号	单据类型	订单号	物料编号	库存地点	库存地点描述
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
    label: '单号',
    key: 'zNo',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '行号',
    key: 'zItem',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料凭证编号',
    key: 'mblnr',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '单据类型',
    key: 'zDocTyp',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '订单号',
    key: 'aufnr',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料编号',
    key: 'matnr',
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
    label: '库存地点',
    key: 'lgort',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '长文本',
    key: 'potx2',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '是否转工单',
    key: 'iszAufnr',
  },
  // MRP控制者	物料编号
  {
    type: EFormItemType.INPUT,
    default: '',
    label: 'MRP控制者',
    key: 'dispo',
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    label: '物料编号',
    key: 'plnbez',
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    { ...commonTextOption, title: '厂区', field: 'factory' },
    { ...commonTextOption, title: '工厂代码', field: 'werks' },
    { ...commonTextOption, title: '工厂名称', field: 'name1' },
    { ...commonTextOption, title: '单号', field: 'zNo' },
    { ...commonTextOption, title: '行号', field: 'zItem' },
    { ...commonTextOption, title: '物料凭证编号', field: 'mblnr' },
    { ...commonTextOption, title: '单据类型', field: 'zDocTyp' },
    { ...commonTextOption, title: '订单号', field: 'aufnr' },
    { ...commonTextOption, title: '物料编号', field: 'matnr' },
    { ...commonMiniTextOption, title: '库存地点', field: 'lgort' },
    { ...commonLargeTextOption, title: '库存地点描述', field: 'lgobe' },
    { ...commonMiniValueOption, title: '数量', field: 'zQty' },
    { ...commonMiniValueOption, title: '过账数量', field: 'zQtyP' },
    { ...commonTextOption, title: '创建日期', field: 'zidateStr' },
    { ...commonTextOption, title: '过账日期', field: 'zPDateStr' },
    { ...commonTextOption, title: '过账时间', field: 'zPTime' },
    { ...commonMiniTextOption, title: '状态', field: 'status' },
    { ...commonTextOption, title: '长文本', field: 'potx2' },
    { ...commonTextOption, title: '是否转工单', field: 'iszAufnr' },
    { ...commonTextOption, title: '业务范围', field: 'gsber' },
    { ...commonMediumTextOption, title: 'MRP控制者', field: 'dispo' },
    { ...commonTextOption, title: '物料编号', field: 'plnbez' },
    { ...commonTextOption, title: '单据创建时间', field: 'zitime' },
    // { ...commonLargeTextOption, title: '发料', field: 'name1' },
    { ...commonTextOption, title: '创建日期', field: 'createDateTimeStr' },
    { ...commonTextOption, title: '过账日期', field: 'postDateTimeStr' },
    { ...commonValueOption, title: '发货时长', field: 'deliveryHours' },
  ];
};
