import { commonSyOrgCodeFormOptions, commonDateRangeFormOptions } from '/@/views/dataAnalysis/config';
import {
  textOptionEasy,
  commonDateOption,
  commonSeqOption,
  commonLargeValueOption,
  commonMediumValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

// 表单配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.DAY,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  commonDateRangeFormOptions,
  {
    label: '物料',
    type: EFormItemType.INPUT,
    default: '',
    key: 'matnr',
  },
  {
    label: '宽幅开始',
    type: EFormItemType.INPUT,
    default: '0',
    key: 'kuanfuStart',
  },
  {
    label: '宽幅结束',
    type: EFormItemType.INPUT,
    default: '30',
    key: 'kuanfuEnd',
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
  exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 2),
};
const commonMediumValueOptionModified = {
  ...commonMediumValueOption,
  formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 2, true),
  exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 2),
};

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    commonSeqOption,

    {
      ...textOptionEasyModified,
      title: '厂区',
      field: 'Factory',
    },
    {
      ...textOptionEasyModified,
      title: '宽幅',
      field: 'Kuanfu',
    },
    {
      ...commonDateOption,
      title: '收货日期',
      field: 'Budat',
    },
    {
      ...textOptionEasyModified,
      title: '周',
      field: 'Week',
    },
    {
      ...textOptionEasyModified,
      title: '月',
      field: 'Month',
    },
    {
      ...textOptionEasyModified,
      title: '料号',
      field: 'Matnr',
      width: 120,
    },
    {
      ...commonLargeValueOptionModified,
      title: '总金额',
      width: 75,
      field: 'Zdmbtr',
    },
    {
      ...textOptionEasyModified,
      title: '产品类型',
      field: 'Types',
    },
    {
      ...textOptionEasyModified,
      title: '公司',
      field: 'Company',
    },
    {
      ...textOptionEasyModified,
      title: '公司代码',
      width: 70,
      field: 'CompanyCode',
    },
    {
      ...textOptionEasyModified,
      title: '数据来源',
      field: 'Datasource',
    },

    // 产品类型缩写
    {
      ...textOptionEasyModified,
      title: '产品类型缩写',
      field: 'TypeName',
    },

    // 产品类型中文
    {
      ...textOptionEasyModified,
      title: '产品类型中文',
      field: 'TypeNameCn',
    },

    // 是否良品
    {
      ...textOptionEasyModified,
      title: '是否良品',
      field: 'IsGoodProduct',
    },

    // 工厂代码
    {
      ...textOptionEasyModified,
      title: '工厂代码',
      field: 'Werks',
    },

    // 库存地点
    {
      ...textOptionEasyModified,
      title: '库存地点',
      field: 'Lgort',
    },

    // 批次
    {
      ...textOptionEasyModified,
      title: '批次',
      field: 'Charg',
    },

    // 成本单价
    {
      ...commonLargeValueOptionModified,
      title: '成本单价',
      field: 'Price',
    },

    // 财务月结后成本单价
    {
      ...commonLargeValueOptionModified,
      title: '财务月结后成本单价',
      field: 'Sprice',
    },

    // 收货数量
    {
      ...commonLargeValueOptionModified,
      title: '收货数量',
      field: 'Menge',
    },

    // 按照库龄取库龄小于30天的数量
    {
      ...commonLargeValueOptionModified,
      title: '库龄<30天数量',
      field: 'Menge0',
    },

    // 按照库龄取库龄小于30天的金额
    {
      ...commonLargeValueOptionModified,
      title: '库龄<30天金额',
      field: 'Dmbtr0',
    },

    // 30-45 数量
    {
      ...commonMediumValueOptionModified,
      title: '30-45天数量',
      field: 'Menge1',
    },

    // 30-45 金额
    {
      ...commonMediumValueOptionModified,
      title: '30-45天金额',
      field: 'Dmbtr1',
    },

    // 45-60 数量
    {
      ...commonMediumValueOptionModified,
      title: '45-60天数量',
      field: 'Menge2',
    },

    // 45-60 金额
    {
      ...commonMediumValueOptionModified,
      title: '45-60天金额',
      field: 'Dmbtr2',
    },

    // 60-90 数量
    {
      ...commonMediumValueOptionModified,
      title: '60-90天数量',
      field: 'Menge3',
    },

    // 60-90 金额
    {
      ...commonMediumValueOptionModified,
      title: '60-90天金额',
      field: 'Dmbtr3',
    },

    // 90-180 数量
    {
      ...commonLargeValueOptionModified,
      title: '90-180天数量',
      field: 'Menge4',
    },

    // 90-180 金额
    {
      ...commonLargeValueOptionModified,
      title: '90-180天金额',
      field: 'Dmbtr4',
    },

    // 180-360 数量
    {
      ...commonLargeValueOptionModified,
      title: '180-360天数量',
      field: 'Menge5',
    },

    // 180-360 金额
    {
      ...commonLargeValueOptionModified,
      title: '180-360天金额',
      field: 'Dmbtr5',
    },

    // 360以上 数量
    {
      ...commonLargeValueOptionModified,
      title: '360天以上数量',
      field: 'Menge6',
    },

    // 360以上 金额
    {
      ...commonLargeValueOptionModified,
      title: '360天以上金额',
      field: 'Dmbtr6',
    },

    // 业务范围
    {
      ...textOptionEasyModified,
      title: '业务范围',
      field: 'Gsber',
    },

    // 仓储地点描述列
    {
      ...textOptionEasyModified,
      title: '仓储地点描述',
      field: 'Name1',
    },

    // 来源
    {
      ...textOptionEasyModified,
      title: '来源',
      field: 'Source',
    },

    // 地址
    {
      ...textOptionEasyModified,
      title: '地址',
      field: 'Address',
    },

    // 是否保税
    {
      ...textOptionEasyModified,
      title: '是否保税',
      field: 'IsBonded',
    },

    // 数据处理日期
    {
      ...commonDateOption,
      title: '数据处理日期',
      field: 'EtlDate',
    },

    // 产品类别
    {
      ...textOptionEasyModified,
      title: '产品类别',
      field: 'Cplb',
    },

    // 类别2
    {
      ...textOptionEasyModified,
      title: '类别2',
      field: 'Lb2',
    },

    // 库龄
    {
      ...textOptionEasyModified,
      title: '库龄',
      field: 'Zdays',
    },

    // 内部项目
    {
      ...textOptionEasyModified,
      title: '内部项目',
      field: 'OwnProjectName',
    },

    // 外部项目
    {
      ...textOptionEasyModified,
      title: '外部项目',
      field: 'CustProjectName',
    },

    // {
    //   ...commonLargeValueOptionModified,
    //   field: 'List',
    //   width: 90,
    //   columnType: EColumnType.KEYS_VALUES,
    //   formatter: getFormatter(),
    //   title: '清单',
    // },
    // {
    //   ...commonLargeValueOptionModified,
    //   title: '最高库龄',
    //   field: 'LibraryAge',
    // },
    // {
    //   ...commonLargeValueOptionModified,
    //   width: 60,
    //   title: '环比',
    //   field: 'Env',
    //   formatter: getFormatter(),
    // },
    // {
    //   ...commonLargeValueOptionModified,
    //   width: 60,
    //   title: '降幅',
    //   field: 'Drop',
    //   formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    // },
  ];
  return columns;
};
