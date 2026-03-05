import dayjs from 'dayjs';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import {
  commonBiggerTextOption,
  commonDateOption,
  commonLargeTextOption,
  commonTextOption,
  commonMediumFormatValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  { type: EFormItemType.INPUT, label: '厂区', default: '', key: 'orgName' },
  { type: EFormItemType.INPUT, label: '公司代码', default: '', key: 'bukrs' },
  { type: EFormItemType.INPUT, label: '公司名称', default: '', key: 'butxt' },
  { type: EFormItemType.INPUT, label: '订单号', default: '', key: 'aufnr' },
  { type: EFormItemType.INPUT, label: '截止关单日期', default: '', key: 'pBudat' },
  { type: EFormItemType.INPUT, label: '实际下达日期', default: '', key: 'ftrmi' },
  { type: EFormItemType.INPUT, label: '工厂', default: '', key: 'werks' },
  { type: EFormItemType.INPUT, label: '月份', default: '', key: 'zMonth' },
  { type: EFormItemType.INPUT, label: '销售凭证类型', default: '', key: 'auart' },
  { type: EFormItemType.INPUT, label: '短文本', default: '', key: 'txt' },
  { type: EFormItemType.INPUT, label: '对象状态', default: '', key: 'status' },
  { type: EFormItemType.INPUT, label: '物料编号', default: '', key: 'matnr' },
  { type: EFormItemType.INPUT, label: '物料描述', default: '', key: 'maktx' },
  { type: EFormItemType.INPUT, label: '计划下达日期', default: '', key: 'ftrms' },
  { type: EFormItemType.INPUT, label: '总订单数量', default: '', key: 'gamng' },
  { type: EFormItemType.INPUT, label: '基本计量单位', default: '', key: 'gmein' },
  { type: EFormItemType.INPUT, label: '实际开始日期', default: '', key: 'gstri' },
  { type: EFormItemType.INPUT, label: '技术完成日期', default: '', key: 'idat2' },
  { type: EFormItemType.INPUT, label: '对订单的MRP控制者', default: '', key: 'dispo' },
  { type: EFormItemType.INPUT, label: '控制者名称', default: '', key: 'dsnam' },
  { type: EFormItemType.INPUT, label: '首次领料日期', default: '', key: 'zidate' },
  { type: EFormItemType.INPUT, label: '业务范围', default: '', key: 'gsber' },
  { type: EFormItemType.INPUT, label: '业务部门描述', default: '', key: 'gtext' },
];

// 表单配置
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'datasourceTime',
    getParam: value => {
      return {
        DatasourceTime: value.format('YYYY-MM-DD'),
      };
    },
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      title: '厂区',
      field: 'OrgName',
    },
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
      ...commonDateOption,
      title: '截止关单日期',
      field: 'PBudat',
      width: 120,
    },
    {
      ...commonDateOption,
      title: '实际下达日期',
      field: 'Ftrmi',
      width: 120,
    },
    {
      ...commonTextOption,
      title: '工厂',
      field: 'Werks',
    },
    {
      ...commonTextOption,
      title: '月份',
      field: 'ZMonth',
    },
    {
      ...commonTextOption,
      title: '销售凭证类型',
      field: 'Auart',
    },
    {
      ...commonLargeTextOption,
      title: '短文本',
      field: 'Txt',
    },
    {
      ...commonTextOption,
      title: '对象状态',
      field: 'Status',
    },
    {
      ...commonLargeTextOption,
      title: '物料编号',
      field: 'Matnr',
    },
    {
      ...commonBiggerTextOption,
      title: '物料描述',
      field: 'Maktx',
    },
    {
      ...commonDateOption,
      title: '计划下达日期',
      field: 'Ftrms',
    },
    {
      ...commonMediumFormatValueOption,
      title: '总订单数量',
      field: 'Gamng',
    },
    {
      ...commonTextOption,
      title: '基本计量单位',
      field: 'Gmein',
    },
    {
      ...commonDateOption,
      title: '实际开始日期',
      field: 'Gstri',
    },
    {
      ...commonDateOption,
      title: '技术完成日期',
      field: 'Idat2',
      width: 120,
    },
    {
      ...commonLargeTextOption,
      title: '对订单的MRP控制者',
      field: 'Dispo',
    },
    {
      ...commonLargeTextOption,
      title: '控制者名称',
      field: 'Dsnam',
    },
    {
      ...commonDateOption,
      title: '首次领料日期',
      field: 'Zidate',
      width: 120,
    },
    {
      ...commonTextOption,
      title: '业务范围',
      field: 'Gsber',
    },
    {
      ...commonLargeTextOption,
      title: '业务部门描述',
      field: 'Gtext',
    },
    {
      ...commonLargeTextOption,
      title: '是否逾期',
      field: 'IsYuqi',
    },
    {
      ...commonLargeTextOption,
      title: '车间呈现',
      field: 'Workshop',
    },
  ];
  return columns;
};
