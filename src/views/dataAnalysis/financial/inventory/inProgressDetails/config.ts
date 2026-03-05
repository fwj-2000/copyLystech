import dayjs from 'dayjs';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonDateOption,
  commonLargeTextOption,
  commonMediumTextOption,
  commonMiniTextOption,
  commonTextOption,
  commonMediumFormatValueOption,
  commonMediumValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

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
    label: '厂区名称',
    default: '',
    key: 'factoryName',
  },
  {
    type: EFormItemType.INPUT,
    label: '工厂代码',
    default: '',
    key: 'werks',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单号',
    default: '',
    key: 'aufnr',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单类型',
    default: '',
    key: 'auart',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单状态',
    default: '',
    key: 'stats',
  },
  {
    type: EFormItemType.INPUT,
    label: '物料编码',
    default: '',
    key: 'matnr',
  },
  {
    type: EFormItemType.INPUT,
    label: '物料描述',
    default: '',
    key: 'maktx',
  },
  {
    type: EFormItemType.INPUT,
    label: 'BOM组件物料描述',
    default: '',
    key: 'idktx',
  },
  {
    type: EFormItemType.INPUT,
    label: 'MRP控制者',
    default: '',
    key: 'dispo',
  },
  {
    type: EFormItemType.INPUT,
    label: '控制者描述',
    default: '',
    key: 'dsnam',
  },
  {
    type: EFormItemType.INPUT,
    label: '下达日期',
    default: '',
    key: 'idat2a',
  },
  {
    type: EFormItemType.INPUT,
    label: '预留编号',
    default: '',
    key: 'rsnum',
  },
  {
    type: EFormItemType.INPUT,
    label: '预留项目',
    default: '',
    key: 'rspos',
  },
  {
    type: EFormItemType.INPUT,
    label: '创建日期',
    default: '',
    key: 'erdat',
  },
  {
    type: EFormItemType.INPUT,
    label: '首次领料日期',
    default: '',
    key: 'ziDate',
  },
  {
    type: EFormItemType.INPUT,
    label: '组件物料工厂',
    default: '',
    key: 'idwrk',
  },
  {
    type: EFormItemType.INPUT,
    label: '组件物料编码',
    default: '',
    key: 'idnrk',
  },
  {
    type: EFormItemType.INPUT,
    label: '业务范围',
    default: '',
    key: 'abtei',
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
      return { erdat: value.format('YYYY-MM-DD') };
    },
  },
];
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
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
      title: '厂区名称',
      field: 'FactoryName',
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
      ...commonMediumTextOption,
      title: '工厂代码',
      field: 'Werks',
    },
    {
      ...commonMediumTextOption,
      title: '工单号',
      field: 'Aufnr',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '工单类型',
      field: 'Auart',
    },
    {
      ...commonMediumTextOption,
      title: '工单状态',
      field: 'Stats',
    },
    {
      ...commonMediumTextOption,
      title: '物料编码',
      field: 'Matnr',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '物料描述',
      field: 'Maktx',
      width: 180,
    },
    {
      ...commonMediumTextOption,
      title: 'BOM组件物料描述',
      field: 'Idktx',
      width: 180,
    },
    {
      ...commonMediumFormatValueOption,
      title: '总订单数量',
      field: 'Gamng',
      width: 120,
    },
    {
      ...commonMediumFormatValueOption,
      title: '收货数量',
      field: 'Wemng',
    },
    {
      ...commonMediumTextOption,
      title: 'MRP控制者',
      field: 'Dispo',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '控制者描述',
      field: 'Dsnam',
      width: 160,
    },
    {
      ...commonDateOption,
      title: '下达日期',
      field: 'Idat2a',
    },
    {
      ...commonMediumTextOption,
      title: '预留编号',
      field: 'Rsnum',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '预留项目',
      field: 'Rspos',
    },
    {
      ...commonDateOption,
      title: '创建日期',
      field: 'Erdat',
    },
    {
      ...commonDateOption,
      title: '首次领料日期',
      field: 'ZiDate',
    },
    {
      ...commonMediumTextOption,
      title: '组件物料工厂',
      field: 'Idwrk',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '组件物料编码',
      field: 'Idnrk',
      width: 160,
    },
    {
      ...commonMediumFormatValueOption,
      title: '组件物料需求数量',
      field: 'Bdmng',
      width: 160,
    },
    {
      ...commonMediumFormatValueOption,
      title: '组件物料发料数量',
      field: 'Enmng',
      width: 160,
    },
    {
      ...commonMediumFormatValueOption,
      title: '组件物料在制数量',
      field: 'Qty',
      width: 160,
    },
    {
      ...commonMediumTextOption,
      title: '计量单位',
      field: 'Meins',
    },
    {
      ...commonMediumValueOption,
      title: '价格',
      field: 'Gpreis',
      formatter: priceFormatter,
    },
    {
      ...commonMediumTextOption,
      title: '币别',
      field: 'Waers',
    },
    {
      ...commonMediumValueOption,
      title: '金额CNY',
      field: 'Amount',
      formatter: priceFormatter,
    },
    {
      ...commonMediumTextOption,
      title: '业务范围',
      field: 'Abtei',
    },
    {
      ...commonDateOption,
      title: '处理日期',
      field: 'EtlDate',
    },
  ];
  return columns;
};
