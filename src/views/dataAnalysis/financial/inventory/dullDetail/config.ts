import { getDullDetatilLibraryAgeParam, dullDetatilGoodProductParam } from '/@/api/dataAnalysis/financial';
import { commonSyOrgCodeFormOptions, commonDayWeekMonthFormOptions } from '/@/views/dataAnalysis/config';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { commonSeqOption, commonMediumTextOption, commonMediumFormatValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  commonDayWeekMonthFormOptions,
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'date',
    pickerKey: 'dimension',
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, [value, value]);
      return { startDim, endDim };
    },
  },
  {
    label: '产品类型',
    type: EFormItemType.INPUT,
    default: '',
    key: 'productType',
    attrs: {
      style: {
        width: '80px',
      },
    },
  },

  {
    type: EFormItemType.SELECT,
    label: '是否良品',
    default: [],
    key: 'IsGoodProduct',
    attrs: {
      allowClear: true,
    },
    options: [],
    getOptions: async () => {
      const { data } = await dullDetatilGoodProductParam({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
  },

  {
    type: EFormItemType.SELECT,
    label: '库龄',
    default: [],
    isOverrideDefault: false,
    key: 'libraryAge',
    attrs: {
      allowClear: true,
      mode: 'multiple',
    },
    options: [],
    getOptions: async () => {
      const { data } = await getDullDetatilLibraryAgeParam({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    getParam: value => {
      return { libraryAge: Array.isArray(value) ? value.join(';') : [] };
    },
  },

  {
    label: 'Top',
    type: EFormItemType.INPUT,
    default: '20',
    key: 'top',
    attrs: {
      style: {
        width: '80px',
      },
    },
  },

  {
    label: '风险标记',
    type: EFormItemType.INPUT,
    default: '',
    key: 'riskMarke',
    attrs: {
      style: {
        width: '80px',
      },
    },
  },
];

// 金额列公共配置
const amountColumnOption = {
  ...commonMediumFormatValueOption,
  width: 100,
  exportMethod: ({ row, column }) => {
    const rawValue = row[column.field];
    // 增强空值保护
    if (rawValue == null) return '';
    const value = Number.parseFloat(rawValue);
    return Number.isNaN(value) ? '' : value.toFixed(4);
  },
};

// 表格字段配置
export const getAllColumns = (options: { hideAmount?: boolean } = {}): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    commonSeqOption,
    {
      ...commonMediumTextOption,
      field: 'Factory',
      title: '工厂',
    },
    {
      ...commonMediumTextOption,
      field: 'Werks',
      title: '工厂代码',
    },
    {
      ...commonMediumTextOption,
      field: 'DataSource',
      title: '库存分类',
    },
    {
      ...commonMediumTextOption,
      field: 'Types',
      title: '产品类型',
    },
    {
      ...commonMediumTextOption,
      field: 'IsGoodProduct',
      title: '是否良品',
    },
    {
      ...commonMediumTextOption,
      field: 'Matnr',
      title: '物料',
      width: 150,
    },
    {
      ...commonMediumFormatValueOption,
      field: 'MengeAll',
      title: '总库存数量',
      ...amountColumnOption,
      width: 100,
    },

    {
      ...amountColumnOption, // 复用公共配置
      field: 'ZdmbtrAll',
      title: '总库存金额',
      width: 100,
    },
    {
      ...commonMediumTextOption,
      field: 'DangerMark',
      title: '风险标记',
    },
    // ...(!options.hideAmount
    //   ? []
    //   : [
    //     {
    //       ...amountColumnOption, // 复用公共配置

    //       field: 'ZdmbtrAll',
    //       title: '总库存金额',
    //       width: 100
    //     },
    //   ]),

    {
      field: 'ZdmbtrAllRange',
      ...commonMediumTextOption,
      title: '总库存金额区间',
    },
    {
      ...commonMediumFormatValueOption,

      field: 'MaxZdays',
      title: '最长库龄',
    },
    {
      field: 'OrderMengeSum',
      ...commonMediumFormatValueOption,
      title: '账龄数量',
    },
    {
      field: 'OrderMoneySum',
      ...commonMediumFormatValueOption,
      title: '账龄金额',
    },
    {
      field: 'ZdmbtrRange',
      ...commonMediumTextOption,
      title: '账龄金额区间',
    },
    // 复用金额列配置
    { ...amountColumnOption, field: 'SumZaizhiMoney', title: '在制金额' },
    { ...amountColumnOption, field: 'WjzZdmbtr', title: '1039无价值仓金额', width: 130 },
    {
      title: '账龄数量',
      field: 'MengeSum',
      headerAlign: 'center',
      children: [
        { ...amountColumnOption, field: 'Less30Menge', title: '<30数量' },
        { ...amountColumnOption, field: 'Between3045Menge', title: '30-45数量' },
        { ...amountColumnOption, field: 'Between4560Menge', title: '45-60数量' },
        { ...amountColumnOption, field: 'Between6090Menge', title: '60-90数量' },
        { ...amountColumnOption, field: 'Between90180Menge', title: '90-180数量' },
        { ...amountColumnOption, field: 'Between180360Menge', title: '180-360数量', width: 120 },
        { ...amountColumnOption, field: 'Greater360Menge', title: '>=360数量' },
      ],
    },
    {
      title: '账龄金额',
      field: 'MoneySum',
      headerAlign: 'center',
      children: [
        { ...amountColumnOption, field: 'Less30Money', title: '<30金额' },
        { ...amountColumnOption, field: 'Between3045Money', title: '30-45金额' },
        { ...amountColumnOption, field: 'Between4560Money', title: '45-60金额' },
        { ...amountColumnOption, field: 'Between6090Money', title: '60-90金额' },
        { ...amountColumnOption, field: 'Between90180Money', title: '90-180金额' },
        { ...amountColumnOption, field: 'Between180360Money', title: '180-360金额', width: 120 },
        { ...amountColumnOption, field: 'Greater360Money', title: '>=360金额' },
      ],
    },
    { ...commonMediumFormatValueOption, field: 'YjtMoney', title: '已计提金额', width: 120 },
  ];
  return columns;
};
