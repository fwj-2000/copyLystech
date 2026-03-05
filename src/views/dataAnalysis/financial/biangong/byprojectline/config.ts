import XEUtils from 'xe-utils';
import { dimensionCommonFormOptions } from '/@/views/dataAnalysis/financial/config';

import {
  commonLargeTextOption,
  commonTextOption,
  commonValueOption,
  // commonLargeValueOption,
  commonMediumTextOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
// const CommonFormOptions = dimensionCommonFormOptions.filter(item => item.key !== 'isBian');
export const formOptions: TFormItemOption[] = [
  ...dimensionCommonFormOptions,
  {
    type: EFormItemType.SELECT,
    label: '产品线',
    default: ['B-IPHONE'],
    key: 'productLine',
    isDropdownBtn: true,
    attrs: {
      allowClear: true,
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { productLine: value.join(';') };
    },
  },
  {
    type: EFormItemType.SELECT,
    default: '1',
    key: 'showType',
    label: '显示类型',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '同比版', value: '0' },
      { text: '环比版', value: '1' },
    ],
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'projectLine',
      title: '产品线',
      className: 'bg-white',
      showOverflow: false,
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonLargeTextOption,
      field: 'dimStr',
      title: '年份',
      width: 140,
      // className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      field: 'items',
      title: '项目',
      width: 125,
      // className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      field: 'category',
      width: 125,
      title: '类别',
    },
    {
      ...commonValueOption,
      field: 'list',
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue, row }) => {
        const { category: metric } = row;
        if (!cellValue) return '';
        if (metric.includes('产值均价')) {
          return XEUtils.commafy(cellValue, { digits: 4 });
        }
        if (metric.includes('%')) {
          return `${XEUtils.commafy(Number(cellValue) * 100, { digits: 1 })}%`;
        }
        return XEUtils.commafy(cellValue, { digits: 0 });
      },
      className: ({ row, column }) => {
        const commonCategory = ['制程提升%', '制程损失'];
        const { items, category } = row;
        const { field } = column;
        const parsedValue = Number.parseFloat(row[field]);
        // 边贡 负数 标红色，材料人工 正数 标红色
        let condition = false;
        if (items === '边贡' && commonCategory.includes(category)) {
          condition = parsedValue < 0;
        } else if (['材料', '人工', '损耗'].includes(items) && commonCategory.includes(category)) {
          condition = parsedValue > 0;
        }
        return condition ? 'text-red' : '';
      },
    },
  ];

  return columns;
};
