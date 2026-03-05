import { getColumns } from '/@/views/dashboard/operation/productionAndSalesRate/config';

import { BaseVxeTableTypes, ESlotDefault } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import dayjs from 'dayjs';

export const PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY_STORAGE_KEY = 'PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY';
// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [
    {
      field: 'prodline',
      className: 'bg-white',
      title: '产品线',
      fixed: 'left',
      width: 100,
      headerAlign: 'left',
      align: 'center',
      mergeConfig: {
        needMergeRow: true,
        mergeRowField: 'combine',
      },
    },
    {
      field: 'item',
      className: 'bg-white',
      title: '项目',
      fixed: 'left',
      width: 100,
      headerAlign: 'left',
      align: 'center',
      mergeConfig: {
        needMergeRow: true,
        mergeRowField: 'combine',
      },
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dashboard/operation/productionAndSalesRate/group/detail';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { orgCode, ...res } = searchFormValue;
          const item = row.item;
          const query = {
            ...res,
            orgCode: row.orgcode ?? orgCode,
            period: item,
            prodline: row.prodline,
          };
          return query;
        },
      },
    },
    {
      field: 'category',
      headerAlign: 'left',
      align: 'center',
    },
    { field: 'metric' },
    {
      field: 'vlist',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      className: ({ row, column }) => {
        const { metric, category } = row;
        const value = row[column.field] ?? '';
        const markMetric = ['产值达成率', '出货达成率', '产销率'];
        if (markMetric.includes(metric)) {
          return Number.parseInt(value, 10) < 100 ? 'text-red' : null;
        }
        if (category.includes('需求波动')) {
          return Number.parseInt(value, 10) < 0 ? 'text-red' : null;
        }
      },
      params: {
        getPathUrl: ({ row, searchFormValue }) => {
          const { dimension } = searchFormValue;
          // console.log('🚀 ~ getAllColumns ~ row:', row);
          const { category } = row;
          switch (category) {
            case '需求波动(%)':
            case '需求量(W)':
              return dimension === 'week' ? '/dashboard/operation/salesRate/fcTrend' : '/dashboard/operation/productionAndSalesRate/detail';
            case 'WOS(周)':
              return '/dashboard/operation/salesRate/wosTrend';
            default:
              return '/dashboard/operation/productionAndSalesRate/detail';
          }
        },
        getPathParams: ({ row, column, searchFormValue }) => {
          const { field } = column;
          const year = field.slice(0, 4);
          const weekNumber = field.substr(4).replace('WK', '');
          const startOfWeek = dayjs().tz().year(year).week(weekNumber).startOf('week');
          const endOfWeek = dayjs().tz().year(year).week(weekNumber).endOf('week');
          const orgCode = row.orgcode || searchFormValue.orgCode || 'MQ';

          const { dimension } = searchFormValue;
          const { prodline, item, category } = row;
          const { period } = searchFormValue;
          console.log('🚀 ~ getAllColumns ~ searchFormValue:111', searchFormValue);
          // 修改为：跳转到FC趋势页面，并设置日期范围为选中周的前4周到后4周
          const selectedWeek = Number.parseInt(weekNumber);
          const startWeek = selectedWeek - 4;
          const endWeek = selectedWeek + 4;
          const startOfDateRange = dayjs().tz().year(year).week(startWeek).startOf('week');
          const endOfDateRange = dayjs().tz().year(year).week(endWeek).endOf('week');
          switch (category) {
            case '需求波动(%)':
            case '需求量(W)':
              return dimension === 'week'
                ? {
                    orgCode,
                    dimension,
                    dateRange: [startOfDateRange, endOfDateRange],
                    prodline: row.prodline === 'all' ? '' : row.prodline,
                    item: '',
                    newOldProject: row.item === 'all' || row.item === '/' ? '' : row.item,
                  }
                : {
                    orgCode,
                    dateRange: [startOfWeek, endOfWeek],
                    dimension: searchFormValue.dimension,
                    prodline: row.prodline === 'all' ? '' : row.prodline,
                    period: period === 'all' ? '' : period,
                    item: row.item === 'all' || row.item === '/' ? '' : row.item,
                  };
            case 'WOS(周)':
              return {
                orgCode,
                dimension,
                dateRange: [startOfDateRange, endOfDateRange],
                prodline,
                item,
                newOldProject: row.item === 'all' || row.item === '/' ? '' : row.item,
              };
            default:
              // console.log('🚀 ~ getAllColumns ~ row:', row, searchFormValue, {
              //   orgCode,
              //   dateRange: [startOfWeek, endOfWeek],
              //   dimension: searchFormValue.dimension,
              //   prodline: row.prodline === 'all' ? '' : row.prodline,
              //   period: period === 'all' ? '' : period,
              //   item: row.item === 'all' || row.item === '/' ? '' : row.item,
              // });

              return {
                orgCode,
                dateRange: [startOfWeek, endOfWeek],
                dimension: searchFormValue.dimension,
                prodline: row.prodline === 'all' ? '' : row.prodline,
                period: item === 'all' ? '' : item,
                // period: period === 'all' ? '' : period,
                item: '',
                // item: row.item === 'all' || row.item === '/' ? '' : row.item,
              };
          }
        },
      },
    },
  ];
  return getColumns(columns);
};

// 搜索条件
export const searchOptions: Partial<TFormItemOption>[] = [
  {
    default: 'MQ1001001',
  },
];

// 额外的搜索条件
export const extraFormOptions: TFormItemOption[] = [
  {
    key: 'isSimplify',
    default: 'true',
    options: [
      { text: '简化版', value: 'true' },
      { text: '完整版', value: 'false' },
    ],
    type: EFormItemType.RADIO_GROUP,
    attrs: {
      buttonStyle: 'solid',
    },
    isOverrideDefault: true,
    setDefault: () => {
      return localStorage.getItem(PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY_STORAGE_KEY) ?? 'false';
    },
  },
];
