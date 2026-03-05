import dayjs from 'dayjs';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import {
  commonBiggerTextOption,
  commonLargeTextOption,
  commonTextOption,
  commonMediumTextOption,
  commonMediumFormatValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  { type: EFormItemType.INPUT, label: '公司代码', default: '', key: 'bukrs' },
  { type: EFormItemType.INPUT, label: '公司名称', default: '', key: 'butxt' },
  { type: EFormItemType.INPUT, label: '订单号', default: '', key: 'aufnr' },
  { type: EFormItemType.INPUT, label: '工厂', default: '', key: 'werks' },
  { type: EFormItemType.INPUT, label: '销售凭证类型', default: '', key: 'auart' },
  { type: EFormItemType.INPUT, label: '短文本', default: '', key: 'txt' },
  { type: EFormItemType.INPUT, label: '对象状态', default: '', key: 'status' },
  { type: EFormItemType.INPUT, label: '物料编号', default: '', key: 'matnr' },
  { type: EFormItemType.INPUT, label: '物料描述', default: '', key: 'maktx' },
  { type: EFormItemType.INPUT, label: '总订单数量', default: '', key: 'gamng' },
  { type: EFormItemType.INPUT, label: '基本计量单位', default: '', key: 'gmein' },
  { type: EFormItemType.INPUT, label: '对订单的MRP控制者', default: '', key: 'dispo' },
  { type: EFormItemType.INPUT, label: '控制者名称', default: '', key: 'dsnam' },
  { type: EFormItemType.INPUT, label: '业务范围', default: '', key: 'gsber' },
  { type: EFormItemType.INPUT, label: '业务部门描述', default: '', key: 'gtext' },
];

// 表单配置
export const formOptions: TFormItemOption[] = [
  commonOrgCodeSelectFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'Ftrmi',
    getParam: value => {
      return {
        Ftrmi: value.format('YYYY-MM-DD'),
      };
    },
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      title: '公司代码',
      field: 'Bukrs',
    },
    {
      ...commonBiggerTextOption,
      title: '公司名称',
      field: 'Butxt',
    },
    {
      ...commonLargeTextOption,
      title: '订单号',
      field: 'Aufnr',
    },
    {
      ...commonTextOption,
      title: '实际下达日期',
      field: 'FtrmiStr',
    },
    {
      ...commonMediumFormatValueOption,
      width: 60,
      title: '天数',
      field: 'ZDay',
    },
    {
      ...commonTextOption,
      width: 60,
      title: '工厂',
      field: 'Werks',
    },
    {
      ...commonTextOption,
      title: '销售凭证类型',
      field: 'Auart',
    },
    {
      ...commonTextOption,
      title: '短文本',
      field: 'Txt',
    },
    {
      ...commonTextOption,
      title: '对象状态',
      field: 'Status',
    },
    {
      ...commonTextOption,
      title: '物料编号',
      field: 'Matnr',
    },
    {
      ...commonTextOption,
      title: '物料描述',
      field: 'Maktx',
    },
    {
      ...commonMediumFormatValueOption,
      width: 70,
      title: '总订单数量',
      field: 'Gamng',
    },
    {
      ...commonTextOption,
      title: '基本计量单位',
      field: 'Gmein',
    },
    {
      ...commonMediumFormatValueOption,
      width: 70,
      title: '技术关闭天数',
      field: 'ZDay2',
    },
    {
      ...commonMediumFormatValueOption,
      title: '订单项目已收货数量',
      field: 'Wemng',
    },
    {
      ...commonMediumTextOption,
      title: '对订单的MRP控制者',
      field: 'Dispo',
    },
    {
      ...commonLargeTextOption,
      title: '控制者名称',
      field: 'Dsnam',
    },
    {
      ...commonMediumTextOption,
      title: '首次领料日期',
      field: 'ZidateStr',
    },
    {
      ...commonMediumFormatValueOption,
      width: 70,
      title: '截单天数',
      field: 'Jdts',
    },
    {
      ...commonMediumFormatValueOption,
      width: 70,
      title: '关闭截单天数',
      field: 'Cjdts',
    },
    {
      ...commonMediumTextOption,
      title: '业务范围',
      field: 'Gsber',
    },
    {
      ...commonLargeTextOption,
      title: '业务部门描述',
      field: 'Gtext',
    },
    {
      ...commonMediumTextOption,
      title: '厂区',
      field: 'OrgName',
    },
    {
      ...commonLargeTextOption,
      title: '厂区层级',
      field: 'DisplayName',
    },
  ];
  return columns;
};
