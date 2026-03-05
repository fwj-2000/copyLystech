import XEUtils from 'xe-utils';
import { dimensionCommonFormOptions_8Week } from '/@/views/dataAnalysis/financial/config';
import { commonLargeTextOption, commonValueOption, commonLargeValueOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDimensionDimensionTypeparameter } from '/@/api/dashbord/report';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { IJumpButtonOption } from './types';

export const formOptions: TFormItemOption[] = [
  ...dimensionCommonFormOptions_8Week,
  {
    type: EFormItemType.SELECT,
    label: '维度',
    default: [],
    isOverrideDefault: false,
    key: 'dimensionType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getOptions: async () => {
      const { data } = await getDimensionDimensionTypeparameter({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    getParam: value => {
      return { dimensionType: value.join(';') };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '工单类型',
    default: [],
    key: 'workNoType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { workNoType: value.join(';') };
    },
  },
];

// 跳转按钮
export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: '维度分组',
    getPathUrl: () => '/dataAnalysis/financial/biangong/groupDimension',
    getPathParams: searchFormValue => {
      const query = {
        ...searchFormValue,
      };
      return query;
    },
  },
];
// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonLargeTextOption,
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
      align: 'center',
      className: 'bg-white',
      fixed: 'left',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonMediumTextOption,
      field: 'category',
      title: '指标',
      align: 'center',
      fixed: 'left',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonLargeTextOption,
      field: 'productType',
      title: '类目',
      fixed: 'left',
      width: 120,
    },
    {
      ...commonLargeValueOption,
      field: 'list',
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue, row }) => {
        const { productType: metric } = row;
        if (!cellValue || !metric) return '';
        if (metric.includes('(K/H)')) {
          return XEUtils.commafy(cellValue, { digits: 1 });
        }
        if (metric.includes('(H)') || metric.includes('(元)')) {
          return XEUtils.commafy(cellValue, { digits: 0 });
        }
        if (metric.includes('%')) {
          return `${XEUtils.commafy(Number(cellValue) * 100, { digits: 1 })}%`;
        }
        return XEUtils.commafy(cellValue, { digits: 0 });
      },
      exportMethod: ({ row, column }) => {
        const { productType: metric } = row;
        let cellValue = row[column.field] ?? '';
        if (!cellValue || !metric) return '';
        if (metric.includes('(K/H)')) {
          return XEUtils.round(cellValue, 1);
        }
        if (metric.includes('(H)') || metric.includes('(元)')) {
          return XEUtils.round(cellValue, 0);
        }
        if (metric.includes('%')) {
          return `${XEUtils.round(Number(cellValue) * 100, 1)}%`;
        }
        return XEUtils.round(cellValue, 4);
      },
      className: ({ row, column }) => {
        const { field } = column;
        const percentageValue = row[field];
        const condition = Number.parseFloat(percentageValue) < 0;
        return condition ? 'text-red' : '';
      },
    },
    {
      ...commonValueOption,
      field: 'total',
      title: '累计',
      formatter: ({ cellValue, row }) => {
        const { productType: metric } = row;
        if (!cellValue || !metric) return '';
        if (metric.includes('(K/H)')) {
          return XEUtils.commafy(cellValue, { digits: 1 });
        }
        if (metric.includes('(H)') || metric.includes('(元)')) {
          return XEUtils.commafy(cellValue, { digits: 0 });
        }
        if (metric.includes('%')) {
          return `${XEUtils.commafy(Number(cellValue) * 100, { digits: 1 })}%`;
        }
        return XEUtils.commafy(cellValue, { digits: 0 });
      },
      exportMethod: ({ row, column }) => {
        const { productType: metric } = row;
        let cellValue = row[column.field] ?? '';
        if (!cellValue || !metric) return '';
        if (metric.includes('%')) {
          return `${XEUtils.round(Number(cellValue) * 100, 1)}%`;
        }
        if (metric.includes('(H)') || metric.includes('(元)')) {
          return XEUtils.round(cellValue, 0);
        }
        if (metric.includes('%')) {
          return `${XEUtils.round(Number(cellValue) * 100, 1)}%`;
        }
        return XEUtils.round(cellValue, 4);
      },
      className: ({ row, column }) => {
        const { field } = column;
        const percentageValue = row[field];
        const condition = Number.parseFloat(percentageValue) < 0;
        return condition ? 'text-red' : '';
      },
    },
  ];

  return columns;
};

export const filterKeyMap = {
  zzdkh: 'customerType', //客户
  zzrgcs: 'engineer', //"工程师",
  zcplb: 'productType', //"产品类别",
  znbxm: 'programType', //"项目",
  zj6m: 'sixCodes', //中间6码
  workshop: 'workShopType', //"车间",
  aufnr: 'orderNo', //"订单号",
  zxlxm: 'newOldProject', //"新老项目",
  xxm: 'smallProject', //小项目
  cpx: 'productLine', //产品线
  matnr: 'productNo', //成品料号
  other1: 'general1',
  other2: 'general2',
  other3: 'general3',
  other4: 'general4',
  other5: 'general5',
  largeproject: 'largeProject', //大项目
  factory: 'factory', //厂区
  zj10m: 'zj10m', //中间10码
  // priceRange: 'priceRange', //单价区间
};
