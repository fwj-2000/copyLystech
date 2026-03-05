import dayjs, { Dayjs } from 'dayjs';
import { getDateRangeDim, transThouIntEx, getCustomDefaultRange, parseDateDetail } from '/@/views/dataAnalysis/utils';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonMediumColumnOptions,
  commonSeqOption,
  commonValueOption,
  getClassName,
  getFormatter,
  commonMiniTextOption,
  commonMiniValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { EBuSbuDimension } from '/@/views/dataAnalysis/financial/biangong/types';
import { BaseVxeTableTypes, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

import { isString } from '/@/utils/is';
export type DimensionType = 'month' | 'week';
export const defaultDataRange: Dayjs[] = getCustomDefaultRange();
export { getText, isNull } from '/@/views/dataAnalysis/financial/profit/report/utils';
// export const defaultDataRange: Dayjs[] = [dayjs().subtract(4, 'week'), dayjs().subtract(1, 'week')];
// 自定义格式化字段表头配置 参考dataAnalysis-financial-profit-report

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: EBuSbuDimension.SBU,
    key: 'busbuDim',
    isHide: false,
    attrs: {
      allowClear: false,
    },
    options: [
      { text: 'BU', value: EBuSbuDimension.BU },
      { text: 'SBU', value: EBuSbuDimension.SBU },
    ],
  },
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '周', value: ETimeDimension.WEEK },
      { text: '月', value: ETimeDimension.MONTH },
    ],
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: defaultDataRange,
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },

  {
    type: EFormItemType.SELECT,
    default: 'xz',
    key: 'saleOutputDim',
    isHide: false,
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '产值', value: 'cz' },
      { text: '销值', value: 'xz' },
    ],
  },
  {
    type: EFormItemType.SELECT,
    default: '0',
    key: 'isAssembly',
    isHide: true,
    label: '是否含组装BG',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '是', value: '1' },
      { text: '否', value: '0' },
    ],
  },
  {
    type: EFormItemType.SELECT,
    default: '1',
    key: 'predictType',
    label: '预测',
    attrs: {
      allowClear: false,
    },
    isHide: true,
    options: [
      { text: '集团版', value: '0' },
      { text: '运营版', value: '1' },
    ],
  },
];

let currentYear: number | null | undefined = null;

export const getAllColumns = ({
  dimension = ETimeDimension.MONTH,
  dateRange = [dayjs(), dayjs().subtract(1, 'week')],
  predictType = '0',
}: {
  dimension?: DimensionType;
  dateRange?: [Dayjs, Dayjs];
  predictType?: string;
} = {}): BaseVxeTableTypes.Columns => {
  const predictTypeKey = predictType == '0' ? '预测-集团版' : '预测-运营版';

  const [, endDate] = dateRange;
  const { year, monthStr, weekStr } = parseDateDetail(endDate) ?? {};
  currentYear = year;
  const endWeekStr = `WK${weekStr}`;
  const monthKey = `${currentYear}年${monthStr}月`;

  const monthColumns: BaseVxeTableTypes.Columns = [
    { ...commonSeqOption, headerAlign: 'center' },
    {
      ...commonMediumColumnOptions,
      width: 70,
      title: 'BU/SBU',
      field: 'buSbu',
      align: 'left',
      sortable: true,
      sortBy: 'sort',
      slots: { default: ESlotDefault.LINK_DEFAULT },
      params: {
        getPathUrl: ({ row }) => {
          const { buSbu } = row;
          if (!buSbu) return ''; //修复 切换bug
          const path1 = buSbu.includes('BU') || buSbu.includes('海外') ? '/dataAnalysis/financial/profit/rank' : '/dataAnalysis/financial/profit/report';
          return hasAsteriskValue(row) ? path1 : '';
        },

        getPathParams: ({ row, searchFormValue }) => ({
          orgCode: row?.key,
          timeDimension: 'month',
          dateRange: searchFormValue.dateRange,
          dimension: searchFormValue.saleOutputDim,
        }),
      },
    },
    {
      title: '同期',
      headerAlign: 'center',
      field: 'samePeriod',
      headerClassName: 'bg-purple',
      children: [
        {
          headerClassName: 'bg-purple',
          ...commonColumn('samePeriodAmount', '收入'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('samePeriodNetProfit', '净利额'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('samePeriodProfitMargin', '净利率', true),
        },
      ],
    },
    {
      title: '滚动预测-集团版',
      field: 'groupForecast',
      headerAlign: 'center',
      children: [
        {
          ...commonColumn('gropuAmountForecast', '收入'),
        },
        {
          ...commonColumn('gropuNetProfitForecast', '净利额'),
        },
        {
          ...commonColumn('gropuProfitMarginForecast', '净利率', true),
        },
      ],
    },
    {
      title: '滚动预测-运营版',
      field: 'operatForecast',
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          headerClassName: 'bg-purple',
          ...commonColumn('operatAmountForecast', '收入'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('operatNetProfitForecast', '净利额'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('operatProfitMarginForecast', '净利率', true),
        },
      ],
    },
    {
      field: 'budgetForecast',
      title: '预算',
      headerAlign: 'center',
      children: [
        {
          ...commonColumn('gropuAmountBudget', '收入'),
        },
        {
          ...commonColumn('gropuNetProfitBudget', '净利额'),
        },
        {
          ...commonColumn('gropuProfitMarginBudget', '净利率', true),
        },
      ],
    },
    {
      title: '实际损益',
      field: 'actualProfit',
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          headerClassName: 'bg-purple',
          ...commonColumn('actualAmount', '收入'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('actualNetProfit', '净利额'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('actualProfitMargin', '净利率', true),
        },
      ],
    },
    {
      field: 'samePeriodForecast',
      title: '较同期',
      headerAlign: 'center',
      children: [
        {
          ...commonColumn('samePeriodNetProfitGap', '净利额GAP'),
        },
        {
          ...commonColumn('samePeriodProfitMarginGap', '净利率GAP', true),
        },
        {
          ...commonColumn('samePeriodAchievementRate', '达成率', true, true),
        },
      ],
    },
    {
      field: 'operatForecastGap',
      title: '较滚动预测-运营版',
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          headerClassName: 'bg-purple',
          ...commonColumn('operatForecastNetProfitGap', '净利额GAP'),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('operatForecastProfitMarginGap', '净利率GAP', true),
        },
        {
          headerClassName: 'bg-purple',
          ...commonColumn('operatForecastAchievementRate', '达成率', true, true),
        },
      ],
    },
    {
      field: 'budgetForecastGap',
      title: '较预算',
      headerAlign: 'center',
      children: [
        {
          ...commonColumn('budgetNetProfitGap', '净利额GAP'),
        },
        {
          ...commonColumn('budgetProfitMarginGap', '净利率GAP', true),
        },
        {
          ...commonColumn('budgetAchievementRate', '达成率', true, true),
        },
      ],
    },
    {
      field: `analysis${dimension}`,
      title: `${monthKey}损益分析总结`,
      type: 'html',
      headerAlign: 'center',
      width: 450,
      className: 'bg-white font-normal',
      showOverflow: false,
      // // 用mergeConfig最后一个分析合不上
    },
  ];

  const weekColumns: BaseVxeTableTypes.Columns = [
    {
      ...commonMiniTextOption,
      width: 64,
      field: 'buName',
      title: 'BG/BU',
      className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonMiniTextOption,
      field: 'factory',
      title: '工厂',
      mergeConfig: {
        needMergeRow: true,
      },

      slots: {
        default: ESlotDefault.LINK_DEFAULT,
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
      params: {
        getPathUrl: ({ row }) => {
          // const { buSbu } = row;
          // if (!buSbu) return ''; //修复 切换bug
          const path1 = '/dataAnalysis/financial/profit/report';
          return hasAsteriskValue(row) ? path1 : '';
        },

        getPathParams: ({ row, searchFormValue }) => ({
          orgCode: row?.orgCode,
          timeDimension: 'week',
          dateRange: searchFormValue.dateRange,
        }),
      },
    },
    {
      ...commonMiniTextOption,
      field: 'project',
      title: '项目',
    },
    {
      field: 'weekList',
    },
    {
      field: '达成',
      title: `${monthKey}${endWeekStr}达成`,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          field: 'weekTarGet',
          title: '周目标',
          headerClassName: 'bg-purple',
          ...commonValueOptionPlus,
          width: 61,
        },
        {
          field: 'weekActual',
          title: '周实际',
          headerClassName: 'bg-purple',
          ...commonValueOptionPlus,
          width: 61,
        },

        {
          ...commonValueOption,
          width: 61,
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
      field: '（实际+预测）月累计达成',
      title: `${monthKey}（实际+预测）月累计达成`,
      headerAlign: 'center',
      children: [
        {
          field: 'sameActual',
          title: '同期实际',
          ...commonValueOptionPlus,
        },
        {
          field: 'groupTarGet',
          title: '集团预算',
          ...commonValueOptionPlus,
        },
        {
          ...commonValueOptionPlus,
          field: 'operationTarGet',
          width: 65,
          // title: '运营目标',
          title: predictTypeKey,
        },
        {
          field: 'monthSum',
          title: '月度预估',
          ...commonValueOptionPlus,
        },
        {
          ...commonValueOption,
          field: 'monthActualGroup',
          title: '月实际较预算',
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
          title: '月实际较预测',
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
    {
      field: `analysis${dimension}`,
      title: `${endWeekStr}损益分析总结`,
      type: 'html',
      headerAlign: 'center',
      width: 450,
      visible: true,
      className: 'bg-white font-normal',
      showOverflow: false,
      // 用mergeConfig最后一个分析合不上
    },
  ];

  return dimension === ETimeDimension.WEEK ? weekColumns : monthColumns;
};

function hasAsteriskValue(row: object) {
  // 遍历对象的每个属性值
  for (let key in row) {
    if (row.hasOwnProperty(key)) {
      if (row[key] === '***') {
        return false;
      }
    }
  }
  return true; // 未找到返回 true
}
// 通用数值列配置
const commonColumn = (field: string, title: string, isRate = false, isAchievementRate = false): BaseVxeTableTypes.Column => ({
  ...commonValueOption,
  width: 65,
  headerAlign: 'center',
  field,
  title,
  formatter: getFormatter(isRate ? { decimal: 1, isRate: true } : {}),
  className: getClassName(isAchievementRate ? { minValue: 100 } : {}),
});

const commonValueOptionPlus = {
  ...commonMiniValueOption,
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

export const customFieldOptions = {
  weekList: {
    getColumns: ({ data }) => {
      const columns = {
        field: '${currentYear}年BY周预估损益',
        title: `${currentYear}年BY周预估损益`,
        headerAlign: 'center',
        children: data.map((item, idx) => {
          //  判断是否为“排除列”（第一列 idx=0 或 合计列 item.keys === '合计'）
          let isExcludeColumn = idx === 0 || item.keys === '合计';
          let isIncludeColumn = !isExcludeColumn;
          //  非排除列时，获取“前一列的field”（用于后续数值对比）
          const prevColumnField = isIncludeColumn ? data[idx - 1].keys : null;

          return {
            ...commonValueOptionPlus,
            width: item.keys === '合计' ? 50 : 65,
            field: item.keys,
            title: item.keys,
            className: ({ row }) => {
              // 仅对行名为净利率的单元格
              const isOriginalRed = row.project === '净利率' && !Number.isNaN(Number.parseFloat(row[item.keys]));

              // 相邻列对比标红逻辑（排除列不执行）
              let isDropRed = false;
              if (!isExcludeColumn) {
                // 只对“非第一列、非合计列”执行对比
                const currentValue = Number.parseFloat(row[item.keys]);
                const prevValue = Number.parseFloat(row[prevColumnField]);
                // 核心条件：当前值 < 前一列值（下降），且两者均为有效数字
                isDropRed = !Number.isNaN(currentValue) && !Number.isNaN(prevValue) && currentValue < prevValue;
              }

              // 同时满足“原有逻辑”或“下降逻辑”，即添加红色类
              if (isOriginalRed && isDropRed) {
                return 'text-red';
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
