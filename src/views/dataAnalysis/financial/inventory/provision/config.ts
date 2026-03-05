import type { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import type { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import dayjs from 'dayjs';
import {
  commonLargeTextOption,
  commonMediumTextOption,
  commonValueOption,
  commonMediumValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { EFormItemType, ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { getDateDim, truncateToInteger } from '/@/views/dashboard/utils';
import { getIsGoodProduct, getZdaysValue } from './utils';
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'Factory',
      title: '厂区',
      className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { OrgCode } = row;
          return {
            date: searchFormValue.date,
            orgCode: OrgCode,
            dataSource: '在仓',
          };
        },
      },
    },
    {
      ...commonLargeTextOption,
      field: 'ProductType',
      title: '类型',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { OrgCode, ProductType } = row;
          return {
            date: searchFormValue.date,
            orgCode: OrgCode,
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
          };
        },
      },
    },
    {
      ...commonLargeTextOption,
      field: 'Category',
      title: '分类',
    },
    {
      ...commonValueOption,
      field: 'Jt0To30',
      title: '0-30天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonValueOption,
      field: 'Jt31To45',
      title: '31-45天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonValueOption,
      field: 'Jt46To60',
      title: '46-60天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonValueOption,
      field: 'Jt61To90',
      title: '61-90天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonValueOption,
      field: 'Jt91To120',
      title: '91-120天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonMediumValueOption,
      field: 'Jt121To150',
      title: '121-150天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonMediumValueOption,
      field: 'Jt151To180',
      title: '151-180天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonMediumValueOption,
      field: 'Jt181To360',
      title: '181-360天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonMediumValueOption,
      field: 'Jt1361',
      title: '大于360天',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue, column }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          const { title } = column;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            zdays: getZdaysValue(title) ?? '',
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },
    {
      ...commonValueOption,
      field: 'JtTotal',
      title: '汇总',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/detail';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { OrgCode, ProductType } = row;
          const { orgCode } = searchFormValue;
          return {
            date: dayjs(searchFormValue.date),
            orgCode: OrgCode ?? orgCode,
            types: getIsGoodProduct(ProductType),
            dataSource: '在仓',
            isJt: row.Category === '未计提' ? '0' : '1',
          };
        },
      },
    },

    {
      ...commonValueOption,
      field: 'LastJtTotal',
      title: '上期汇总',
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
    },
    {
      ...commonValueOption,
      field: 'JtTotalHb',
      title: '金额环比',
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
    },
    {
      ...commonValueOption,
      field: 'CurrJt180Total',
      title: '超180天',
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
    },
    // //上期超180天
    // LastJt180Total
    {
      ...commonValueOption,
      field: 'LastJt180Total',
      title: '上期超180天',
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
    },
    // //环比
    // Jt180TotalHb
    {
      ...commonValueOption,
      field: 'Jt180TotalHb',
      title: '环比',
      formatter: ({ cellValue }) => truncateToInteger(cellValue),
      exportMethod: ({ row, column }) => row[column.field] ?? '',
    },
  ];

  return columns;
};
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
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'date',
    pickerKey: 'dimension',
    getParam: (value, searchParams) => {
      const dateDim =
        searchParams.dimension === ETimeDimension.WEEK
          ? getDateDim(value)
          : searchParams.dimension === ETimeDimension.MONTH
          ? dayjs(value).format('YYYY-MM')
          : dayjs(value).format('YYYY-MM-DD');
      return { startDim: dateDim, endDim: dateDim };
    },
  },
];

export const filterOptions: TFormItemOption[] = [];

// // 获取行样式
export const getRowStyle = ({ row }) => {
  const { ProductType } = row;
  return {
    ...(['汇总'].includes(ProductType) ? { fontWeight: '700' } : {}),
  };
};
