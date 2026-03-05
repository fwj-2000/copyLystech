import { commonDateRangeFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonTextOption, commonMiniValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

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

// 新增日期转换函数
const parseDateByDimension = (dateStr: string, dimension: ETimeDimension) => {
  switch (dimension) {
    case ETimeDimension.WEEK:
      const resWEEK = dateStr.replace(/_/g, ''); //2025_WK26 变 2025WK26
      const [year, week] = resWEEK.match(/\d+/g)!; //将 "2025WK25" 转换为周最后一天
      return dayjs().year(Number(year)).week(Number(week)).endOf('week');
    case ETimeDimension.MONTH:
      const resMONTH = dateStr.replace(/_/g, '-').replace('月', ''); //2025_06-25 变 2025-06-25
      return dayjs(resMONTH);
    default:
      const resDAY = dateStr.replace(/_/g, '-'); //2025_WK26 变 2025WK26
      return dayjs(resDAY);
  }
};

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      field: 'FactoryName',
      title: '厂区',
      className: 'bg-white font-weight-bold',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      field: 'Title1',
      title: '类型',
      className: 'font-weight-bold',
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
      field: 'List',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: {
        ...commonMiniValueOption,
        width: 60,
        slots: {
          default: ESlotDefault.LINK_DEFAULT,
        },
        params: {
          getPathUrl: ({ row }) => {
            const { Title1 } = row;
            switch (Title1) {
              case '原材料':
              case '半成品':
              case '成品':
                return '/dataAnalysis/financial/inventory/detail';
              default:
                return '';
            }
          },

          getPathParams: ({ row, column, searchFormValue }) => {
            const { field } = column;
            const { Title1, OrgCode } = row;
            const { orgCode, dimension } = searchFormValue;
            const query = {
              orgCode: OrgCode ?? orgCode,
              date: parseDateByDimension(field, dimension),
              isBad: true,
            };
            switch (Title1) {
              case '原材料':
              case '半成品':
              case '成品':
                return {
                  types: Title1,
                  ...query,
                };
              default:
                return query;
            }
          },
        },
        sortable: true,
        formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
        exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4) ?? '',
      },
    },
    {
      ...commonMiniValueOption,
      width: 70,
      field: 'BadProp',
      title: '不良库存占比',
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '%', 1),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '%', 1) ?? '',
    },
    {
      ...commonMiniValueOption,
      field: 'Env',
      title: '环比',
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4) ?? '',
    },
  ];
  return columns;
};
