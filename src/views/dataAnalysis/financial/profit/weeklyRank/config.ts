import dayjs, { Dayjs } from 'dayjs';
import { getSyOrganization } from '/@/api/dataAnalysis/financial';
import { EFormItemType, EOrgLevel, TFormItemOption, ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { commonTextOption, commonValueOption, commonMediumValueOption, getClassName } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { isString } from '/@/utils/is';

let currentYear: number | null = null;
// 通用搜索组件配置
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getSyOrganization(params);
      const list = data.list ?? data;
      const handleList = list.map(item => {
        return {
          id: item.ID,
          parentId: item.Parent_Id,
          value: item.Org_Code,
          text: item.Org_Name,
          level: item.Org_Level,
          disabled: `${item.Org_Level}` === EOrgLevel.BU,
        };
      });
      return handleList;
    },
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(4, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateDim',
    attrs: {
      picker: ETimeDimension.WEEK,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, value);
      return { startDim, endDim };
    },
  },
];

// 表格字段配置
export const getAllColumns = ({ dateRange = [dayjs(), dayjs().subtract(1, 'week')] }: { dateRange?: [Dayjs, Dayjs] } = {}): BaseVxeTableTypes.Columns => {
  const [, endDate] = dateRange;
  const endWeekStr = `WK${endDate.week()}`;
  currentYear = endDate.year();
  const monthKey = `${currentYear}年${(endDate.month() + 1).toString().padStart(2, '0')}月`;

  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      field: 'buName',
      title: 'BG/BU',
      mergeConfig: {
        needMergeRow: true,
      },
      fixed: 'left',
    },
    {
      ...commonTextOption,
      field: 'factory',
      title: '工厂',
      mergeConfig: {
        needMergeRow: true,
      },
      fixed: 'left',
    },
    {
      ...commonTextOption,
      field: 'project',
      title: '项目',
      fixed: 'left',
    },
    {
      field: 'weekList',
    },

    {
      title: `${monthKey}${endWeekStr}达成`,
      field: 'weekTar',
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          field: 'weekTarGet',
          title: '周目标',
          headerClassName: 'bg-purple',
          ...commonValueOptionPlus,
        },
        {
          field: 'weekActual',
          title: '周实际',
          headerClassName: 'bg-purple',
          ...commonValueOptionPlus,
        },

        {
          ...commonValueOption,
          field: 'weekAchievementRate',
          title: '达成率',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: ({ row, column }) => {
            const { field } = column;
            const percentageValue = row[field];
            if (row.project === '净利率') {
              return Number.parseFloat(percentageValue) < 0 ? 'text-red' : '';
            }
            return '';
          },
        },
      ],
    },
    {
      title: `${monthKey}${endWeekStr}（实际+预测）月累计达成`,
      field: 'monthTar',
      headerAlign: 'center',
      children: [
        {
          field: 'sameActual',
          title: '同期实际',
          ...commonValueOptionPlus,
        },
        {
          field: 'groupTarGet',
          title: '集团目标',
          ...commonValueOptionPlus,
        },
        {
          field: 'operationTarGet',
          title: '运营目标',
          ...commonValueOptionPlus,
        },
        {
          field: 'monthSum',
          title: '月度预估',
          ...commonValueOptionPlus,
        },
        {
          ...commonValueOption,
          field: 'monthActualGroup',
          title: '月实际较集团版',
          formatter: formatRate,
          className: ({ row, column }) => {
            const { field } = column;
            const percentageValue = row[field];
            if (row.project === '净利润') {
              return Number.parseFloat(percentageValue) < 1 ? 'text-red' : '';
            }
            return '';
          },
        },
        {
          ...commonValueOption,
          field: 'monthActualOperation',
          title: '月实际较运营版',
          formatter: formatRate,
          className: ({ row, column }) => {
            const { field } = column;
            const percentageValue = row[field];
            if (row.project === '净利润') {
              // console.log(row[field], 'row[field]');
              return Number.parseFloat(percentageValue) < 1 ? 'text-red' : '';
            }
            return '';
          },
        },
      ],
    },
  ];
  return columns;
};

// 自定义格式化字段表头配置 参考dataAnalysis-financial-profit-report
export const customFieldOptions = {
  weekList: {
    getColumns: ({ data }) => {
      const columns = {
        title: `${currentYear}年BY周预估损益`,
        headerAlign: 'center',
        field: 'monthTarYear',
        children: data.map((item, idx) => {
          // 判断当前列是否是倒数第二列
          const isTargetColumn = idx === data.length - 2;
          return {
            ...commonValueOptionPlus,
            ...commonMediumValueOption,
            width: item.keys === '合计' ? 60 : 90,
            field: item.keys,
            title: item.keys,
            className: ({ row }) => {
              if (isTargetColumn && row.project === '净利率') {
                const value = row[item.keys];
                const num = Number.parseFloat(value);
                if (!Number.isNaN(num) && num < 1) {
                  return 'text-red';
                }
              }
              return '';
            },
          };
        }),
      };
      return columns;
    },
    formatData: (values: any[]) => {
      const info = values.reduce((pre, cur) => {
        return {
          ...pre,
          [cur.keys]: cur.values,
        };
      }, {});
      // console.log('info', info);
      return info;
    },
  },
};

const commonValueOptionPlus = {
  ...commonValueOption,
  formatter: ({ cellValue, row, column }) => formatValue(cellValue, row),
  exportMethod: ({ row, column }) => formatValue(row[column.field], row, false, 2),
};
const formatValue = (cellValue, row, useTrue = true, digits = 0) => {
  if (!cellValue) return '';
  const { project: metric } = row;
  const rateMetric = ['净利率'];
  if (isString(cellValue)) {
    return cellValue;
  }
  if (rateMetric.includes(metric)) {
    return `${(cellValue * 100).toFixed(1)}%`;
  }
  return transThouIntEx(cellValue, '', digits, useTrue);
};

const formatRate = ({ cellValue }) => {
  if (!cellValue) return '';
  return `${(cellValue * 100).toFixed(1)}%`;
};
