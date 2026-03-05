import { getIsGoodProduct, getZdaysValue } from './utils';
import { commonDateRangeFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonLargeTextOption, commonLargeValueOption, commonMediumTextOption, commonValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { truncateToThouInt } from '/@/views/dashboard/utils';

// 跳转按钮
export const jumpButtonOptions = [
  {
    text: 'WIP统计',
    getPathUrl: () => {
      return '/dataAnalysis/financial/inventory/wip';
    },
  },
  {
    text: '库存明细',
    getPathUrl: () => {
      return '/dataAnalysis/financial/inventory/detail';
    },
  },
  {
    text: '在制明细',
    getPathUrl: () => {
      return '/dataAnalysis/financial/inventory/inProgressDetails';
    },
  },
];

// 通用搜索组件配置
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
];

/**
 * 解析日期字符串根据时间维度
 * @param dateStr - 日期字符串，格式如 '2025_WK26' 或 '2025_10月'
 * @param dimension - 时间维度，可选值为 'week'（周）或 'month'（月）'day'（天）
 * @returns 解析后的日期对象
 */
const parseDateByDimension = (dateStr: string, dimension: ETimeDimension) => {
  console.log('🚀 ~ parseDateByDimension ~ dateStr:', dateStr);
  switch (dimension) {
    case ETimeDimension.WEEK:
      const resWEEK = dateStr.replace(/_/g, ''); //2025_WK26 变 2025WK26
      const [year, week] = resWEEK.match(/\d+/g)!; //将 "2025WK25" 转换为周最后一天
      return dayjs().year(Number(year)).week(Number(week)).endOf('week');
    case ETimeDimension.MONTH:
      const resMONTH = dateStr.replace(/_/g, '-').replace('月', ''); // 2025_10月 2025-10
      return dayjs(resMONTH).endOf('month');
    default:
      const resDAY = dateStr.replace(/_/g, '-');
      return dayjs(resDAY);
  }
};

const centerHeaderAlign: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 100,
};
const centerListAlign: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 70,
};

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...centerHeaderAlign,
      field: 'FactoryName',
      title: '厂区',
      className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      ...commonLargeTextOption,
      ...centerHeaderAlign,
      field: 'Title1',
      title: '类型',
      mergeConfig: {
        needMergeRow: true,
      },
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/inventory/report/lineChart';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { Title1: type, OrgCode } = row;
          return {
            type,
            timeDimension: searchFormValue.dimension,
            dateRange: searchFormValue.dateRange,
            orgCode: OrgCode,
            factoryName: row.FactoryName,
          };
        },
      },
    },
    {
      ...commonLargeTextOption,
      field: 'Title2',
      title: '账龄',
      ...centerHeaderAlign,
    },
    {
      ...commonLargeValueOption,
      field: 'List',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: {
        ...commonValueOption,
        ...centerListAlign,
        slots: {
          default: ESlotDefault.LINK_DEFAULT,
        },
        params: {
          getPathUrl: ({ row }) => {
            const { Title1, Title2 } = row;
            switch (Title1) {
              case '原材料':
              case '半成品':
              case '成品':
              case '在仓库存':
              case 'VMI在库':
              case '在仓库存(含不良)':
                return '/dataAnalysis/financial/inventory/detail';
              case '在制':
                return Title2 === '委外' ? '/dataAnalysis/financial/inventory/detail' : '/dataAnalysis/financial/inventory/inProgressDetails';
              case '结单管理':
                return '/dataAnalysis/financial/inventory/settlementRate';
              case 'WIP工单数量':
              case 'WIP工单金额':
                return '/dataAnalysis/financial/inventory/wip';
              default:
                return '';
            }
          },

          getPathParams: ({ row, column, searchFormValue }) => {
            const { field } = column;
            const { Title1, Title2, OrgCode } = row;
            const { orgCode, dimension } = searchFormValue;
            const query = {
              orgCode: OrgCode ?? orgCode,
              date: parseDateByDimension(field, dimension),
              isGoodProduct: getIsGoodProduct(Title2) ?? '',
            };
            switch (Title1) {
              case '原材料':
              case '半成品':
              case '成品':
                return {
                  types: Title1,
                  ...query,
                };
              case '在制':
                return Title2 === '委外'
                  ? {
                      ...query,
                      sobkz: 'O',
                    }
                  : query;
              case 'VMI在库':
                return {
                  dataSource: 'VMI',
                  ...query,
                };
              case '在仓库存':
              case '在仓库存(含不良)':
                return {
                  zdays: getZdaysValue(Title2) ?? '',
                  dataSource: '在仓',
                  ...query,
                };
              case '结单管理':
                return {
                  ...query,
                };
              case 'WIP工单数量':
              case 'WIP工单金额':
                return {
                  ...query,
                  dateRange: [dayjs(query.date).subtract(1, 'week'), dayjs(query.date)],
                };
              default:
                return query;
            }
          },
        },
        sortable: true,
        formatter: ({ cellValue, row }) => truncateToThouInt(cellValue, row.Title2),
        exportMethod: ({ row, column }) => truncateToThouInt(row[column.field], row.Title2, false) ?? '',
      },
    },
    {
      ...commonValueOption,
      ...centerHeaderAlign,
      field: 'Env',
      title: '环比',
      formatter: ({ cellValue, row }) => truncateToThouInt(cellValue, row.Title2),
      exportMethod: ({ row, column }) => truncateToThouInt(row[column.field], row.Title2, false) ?? '',
    },
  ];
  return columns;
};
