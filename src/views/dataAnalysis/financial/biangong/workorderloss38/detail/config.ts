import { dimensionCommonFormOptionsSimple } from '/@/views/dataAnalysis/financial/config';
import { commonValueOption, commonMediumTextOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

export const formOptions: TFormItemOption[] = [...dimensionCommonFormOptionsSimple];
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '工号',
    key: 'empNo',
  },
  {
    type: EFormItemType.INPUT,
    label: '模切工',
    key: 'ufName',
  },
  {
    type: EFormItemType.INPUT,
    label: '机台号',
    key: 'machineId',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单号',
    key: 'workOrderNo',
  },
  {
    type: EFormItemType.INPUT,
    label: '班次',
    key: 'team',
  },
  {
    type: EFormItemType.INPUT,
    label: '料号',
    key: 'productCode',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单类型',
    key: 'auaZh',
  },
  {
    type: EFormItemType.INPUT,
    label: '车间',
    key: 'dsnam',
  },
  {
    type: EFormItemType.SELECT,
    label: '结单情况',
    default: '',
    key: 'isCleared',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '全部', value: '' },
      { text: '已结', value: '1' },
      { text: '未结', value: '0' },
    ],
  },
];
const commonFormatValueDecimal_2 = {
  ...commonValueOption,
  formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 2, true),
  exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 2),
};
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'factory',
      title: '工厂',
    },
    {
      ...commonMediumTextOption,
      field: 'timeDate',
      title: '日期',
    },
    {
      ...commonMediumTextOption,
      field: 'empNo',
      title: '工号',
    },
    {
      ...commonMediumTextOption,
      field: 'ufName',
      title: '姓名',
    },
    {
      ...commonMediumTextOption,
      field: 'machineId',
      title: '机台号',
    },
    {
      ...commonMediumTextOption,
      field: 'workOrderNo',
      title: '工单号',
    },

    {
      ...commonMediumTextOption,
      field: 'team',
      title: ' 班次',
    },
    // auaZh 工单类型名称/auart 工单代码、dsnam  车间名称/dispo 车间代码
    {
      ...commonMediumTextOption,
      field: 'auaZh',
      title: ' 工单类型名称',
    },
    {
      ...commonMediumTextOption,
      field: 'auart',
      title: '工单代码',
    },
    {
      ...commonMediumTextOption,
      field: 'dsnam',
      title: '车间名称',
    },
    {
      ...commonMediumTextOption,
      field: 'dispo',
      title: '车间代码',
    },
    {
      ...commonMediumTextOption,
      field: 'productCode',
      title: ' 料号',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'quantity',
      title: ' 产量',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'planQuantity',
      title: ' 计划数',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'workTime',
      title: ' 工时',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'badQuantity',
      title: ' 不良数',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'orderQuantity',
      title: ' 工单总未结产量',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'badTotal',
      title: ' 工单不良数',
    },
    {
      ...commonValueOption,
      field: 'badPercentage',
      title: ' 不良品占比',
      formatter: getFormatter({ decimal: 2, isRate: true, isH: true }),
    },
    {
      ...commonMediumTextOption,
      field: 'isCleared',
      title: ' 是否结清',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'totalOutput',
      title: ' 工单总产量',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'price',
      title: ' 单价',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'actualMaterialLoss',
      title: ' 实际材料损失',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'actualMaterialCost',
      title: ' 实际材料成本',
    },
    {
      ...commonFormatValueDecimal_2,
      field: 'lossAmount',
      title: '损失额',
    },
    {
      ...commonValueOption,
      field: 'lossRate',
      title: '损耗率',
      formatter: getFormatter({ decimal: 2, isRate: true, isH: true }),
    },
  ];

  return columns;
};
