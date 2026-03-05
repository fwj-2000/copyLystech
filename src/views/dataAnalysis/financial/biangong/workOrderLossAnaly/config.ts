import { dimensionCommonFormOptions } from '/@/views/dataAnalysis/financial/config';
import {
  commonLargeTextOption,
  commonValueOption,
  commonSeqOption,
  commonMediumTextOption,
  getFormatter,
  commonMiniTextOption,
  commonMiniValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import { getWorkOrderLossAnalysiDimlist } from '/@/api/dataAnalysis/financial';

export const formOptions: TFormItemOption[] = [
  ...dimensionCommonFormOptions,
  {
    type: EFormItemType.SELECT,
    label: '维度',
    default: 'workshop',
    key: 'dimensionType',
    attrs: {
      allowClear: false,
      // mode: 'multiple',
    },
    options: [],
    getOptions: async () => {
      const { data } = await getWorkOrderLossAnalysiDimlist({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    getParam: value => {
      return { dimensionType: value };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '工单类型',
    default: '',
    options: [],
    key: 'auart',
  },
];
export const filterOptions: TFormItemOption[] = [
  // {
  //   type: EFormItemType.SELECT,
  //   label: '工单类型',
  //   default: '',
  //   options: [],
  //   key: 'auart',
  // },
  {
    type: EFormItemType.SELECT,
    label: '业务范围',
    default: '',
    key: 'businesScope',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '订单号',
    default: '',
    key: 'orderNo',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '产品编码',
    default: [],
    key: 'productCode',
    attrs: {
      mode: 'multiple',
      maxTagCount: 2,
    },
    options: [],
    getParam: value => {
      console.log('🚀 ~ value:', value);
      return { productCode: Array.isArray(value) ? value.join(';') : value };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '物料八码/全码',
    default: '',
    key: 'fullCode',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '项目',
    default: '',
    key: 'znbxm',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '车间',
    default: '',
    key: 'workshop',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '客户',
    default: '',
    key: 'zzdkh',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '产品类别',
    default: '',
    key: 'zcplb',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '中间6码',
    default: '',
    key: 'zj6m',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '中间10码',
    default: '',
    key: 'zj10m',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '工程师',
    default: '',
    key: 'zzrgcs',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '产品线',
    default: '',
    key: 'cpx',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '新老项目',
    default: '',
    key: 'zxlxm',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用1',
    default: '',
    key: 'other1',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用2',
    default: '',
    key: 'other2',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用3',
    default: '',
    key: 'other3',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用4',
    default: '',
    key: 'other4',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用5',
    default: '',
    key: 'other5',
    options: [],
  },
];

// 表格字段配置 有权限看全部
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonSeqOption,
    },
    {
      ...commonMiniTextOption,
      field: 'businesScope',
      title: '业务范围',
    },
    {
      ...commonMiniTextOption,
      field: 'factory',
      title: '厂区名称',
    },
    {
      ...commonMiniTextOption,
      width: 70,
      field: 'dateDim',
      title: '日期',
    },
    {
      ...commonMediumTextOption,
      field: 'orderNo',
      title: '订单号',
    },
    {
      ...commonLargeTextOption,
      field: 'productCode',
      title: '产品编码',
    },
    {
      ...commonMiniTextOption,
      field: 'materialFactory',
      title: '材料工厂',
    },
    {
      ...commonLargeTextOption,
      field: 'fullCode',
      title: '物料八码/全码',
    },
    {
      ...commonMiniTextOption,
      field: 'meins',
      title: '单位',
    },
    {
      ...commonMediumTextOption,
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
    },
    {
      title: '标准材料（元）',
      field: 'standardMaterialCost',
      headerAlign: 'center',
      children: [
        {
          ...commonMiniValueOption,
          field: 'standardUsage',
          title: '用量',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'zeroLossStandardCost',
          title: '零损耗',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'excessLossStandardCost',
          title: '含损耗',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
      ],
    },
    {
      title: '实际材料（元）',
      headerAlign: 'center',
      field: 'actualMaterialCostonly',
      children: [
        {
          ...commonMiniValueOption,
          field: 'actualUsage',
          title: '用量',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'actualMaterialCost',
          title: '实际',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
      ],
    },
    {
      title: '材料损失（元）',
      headerAlign: 'center',
      field: 'materialLossAmount(yuan)',
      children: [
        {
          ...commonMiniValueOption,
          field: 'quantity',
          title: '数量',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'standardIncludingLoss',
          title: '标准',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonMiniValueOption,
          field: 'actual',
          title: '实际',
          width: 70,
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'materialExcessLossAmount',
          title: '超损额',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
      ],
    },

    {
      ...commonValueOption,
      field: 'overLossProp',
      title: '超损占比',
      width: 60,
      formatter: getFormatter({ decimal: 2, isRate: true, isH: true }),
    },
    {
      ...commonValueOption,
      field: 'zcpcz',
      title: '产值',
      width: 60,
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
    },
  ];

  return columns;
};
// 无权限 看部分
export const getSyncColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonSeqOption,
    },
    {
      ...commonMiniTextOption,
      field: 'businesScope',
      title: '业务范围',
    },
    {
      ...commonMiniTextOption,
      field: 'factory',
      title: '厂区名称',
    },
    {
      ...commonMiniTextOption,
      width: 70,
      field: 'dateDim',
      title: '日期',
    },
    {
      ...commonMediumTextOption,
      field: 'orderNo',
      title: '订单号',
    },
    {
      ...commonLargeTextOption,
      field: 'productCode',
      title: '产品编码',
    },
    {
      ...commonMiniTextOption,
      field: 'materialFactory',
      title: '材料工厂',
    },
    {
      ...commonLargeTextOption,
      field: 'fullCode',
      title: '物料八码/全码',
    },

    {
      ...commonMiniValueOption,
      field: 'standardUsage',
      title: '标准用量',
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
    },
    {
      ...commonMiniValueOption,
      field: 'actualUsage',
      title: '实际用量',
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
    },

    {
      title: '材料损失',
      field: 'materialLossAmount',
      headerAlign: 'center',
      children: [
        {
          ...commonMiniValueOption,
          field: 'quantity',
          title: '数量',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'standardIncludingLoss',
          title: '标准(含损耗)',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonMiniValueOption,
          field: 'actual',
          title: '实际',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
        {
          ...commonValueOption,
          field: 'materialExcessLossAmount',
          title: '材料超损额',
          formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        },
      ],
    },
  ];

  return columns;
};
