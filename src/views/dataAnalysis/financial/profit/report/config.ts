import type { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';

import dayjs, { Dayjs } from 'dayjs';
import { h } from 'vue';

import { EFormItemType, EOrgLevel, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import {
  commonTextOption,
  commonLargeValueOption,
  commonMediumTextOption,
  commonMediumValueOption,
  commonValueOption,
  commonMiniValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getSyOrganization, getProfitandlosDownloadTemplate } from '/@/api/dataAnalysis/financial';
import { BaseVxeTableTypes, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import XEUtils from 'xe-utils';
import { getValueCellClassName } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
import { IJumpButtonOption } from './types';
import { getDateRangeDim, getCustomDefaultRange, parseDateDetail } from '/@/views/dataAnalysis/utils';
import { isString } from '/@/utils/is';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';

import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import InfoDetail from './infoDetail/index.vue';
import { predictType as predictTypeOptions } from '/@/views/dataAnalysis/financial/config';
export { getMonthDimensionDefaultDateRange } from '/@/views/dataAnalysis/financial/profit/rank/utils';

// 跳转按钮配置
export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: '周KPI',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/mqkpi';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dateRange: searchFormValue.dateRange,
        dimension: ETimeDimension.WEEK,
      };
      return query;
    },
  },
  {
    title: '月KPI',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/mqkpi';
      return url;
    },
    getPathParams: searchFormValue => {
      const [startDate, endDate] = searchFormValue.dateRange;
      let dateRange = [startDate, endDate];
      // 月KPI至少选择两个月的时间
      if (endDate.diff(startDate, 'month') < 1) {
        dateRange[0] = endDate.subtract(1, 'month');
      }
      const query = {
        orgCode: searchFormValue.orgCode,
        dateRange,
        dimension: ETimeDimension.MONTH,
      };
      return query;
    },
  },
  {
    title: '制程边贡',
    getPathUrl: () => {
      return '/dataAnalysis/financial/biangong/rank';
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dateRange: searchFormValue.dateRange,
      };
      return query;
    },
  },
  {
    title: '费用分析',
    getPathUrl: searchFormValue => {
      const [, endDate = dayjs().tz()] = searchFormValue.dateRange;
      const query = {
        dimension: searchFormValue.timeDimension,
        orgCode: searchFormValue.orgCode,
        date: endDate.format('YYYY-MM-DD'),
      };
      // 构造路由参数
      const url = `/dashboard/operate/expense?${objectToQueryParams(query)}`;
      return url;
    },
  },
  // {
  //   title: '手工数据',
  //   getPathUrl: () => {
  //     // 构造路由参数
  //     const url = `/dataAnalysis/financial/profit/manualData`;
  //     return url;
  //   },
  //   getPathParams: searchFormValue => {
  //     const query = {
  //       dateRange: searchFormValue.dateRange,
  //       orgCode: searchFormValue.orgCode,
  //     };
  //     return query;
  //   },
  // },
];
// 表单配置
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const defaultDataRange: Dayjs[] = getCustomDefaultRange();

export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    attrs: {
      disabledDate: (current: Dayjs) => {
        return current && current < dayjs('2024-01-01').tz();
      },
    },
    setDefault: (options: Array<{ value: string; disabled: boolean }>) => {
      return options.find(item => !item.disabled)?.value || '';
    },
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
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'timeDimension',
    attrs: {
      allowClear: false,
      onChange: (value: ETimeDimension) => {
        console.log(value, 'value');
      },
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    key: 'dateRange',
    default: defaultDataRange,
    pickerKey: 'timeDimension',
    attrs: { allowClear: false },
    getParam: (value, searchFormValue) => {
      const { timeDimension } = searchFormValue;
      const { startDim, endDim } = getDateRangeDim(timeDimension, value);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    default: 'cz',
    key: 'dimension',
    isHide: true,
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
    key: 'isExpandSBU',
    isHide: false,
    label: '是否展开SBU',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '是', value: '1' },
      { text: '否', value: '0' },
    ],
  },
  // predictTypeOptions,
];

// 表格字段配置
const formatValue = ({ cellValue, row, column }) => {
  if (!cellValue) {
    return '';
  }
  const { metric } = row;
  const { title } = column;

  const rateColumn = ['集团'];
  if (isString(cellValue)) {
    return cellValue;
  }
  if (title.includes('%') || title.includes('占比') || metric.includes('率') || rateColumn.includes(title)) {
    return `${cellValue.toFixed(1)}%`;
  }
  return XEUtils.commafy(cellValue, { digits: 0 });
};
const formatRate = ({ cellValue }) => {
  return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
};
export const commonColumnOptions: Record<string, BaseVxeTableTypes.Column> = {
  factory: {
    ...commonTextOption,
    title: '厂区',
    field: 'factory',
    fixed: 'left',
  },
  sort: {
    field: 'sort',
    title: '序号',
    width: 90,
    fixed: 'left',
    headerAlign: 'center',
    treeNode: true,
    // className: ({ row }) => {
    //   const { sort } = row;
    //   if (!`${sort}`.includes('.')) {
    //     return '';
    //   }
    //   return `${sort}`.split('.')[1].length > 1 ? 'text-indent-2' : 'text-indent-1';
    // },
  },
  metric: {
    ...commonTextOption,
    title: '指标',
    field: 'metric',
    fixed: 'left',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
      default: ESlotDefault.LINK_DEFAULT,
    },
    params: {
      getPathUrl: ({ searchFormValue, row }) => {
        const { /**timeDimension,*/ orgCode } = searchFormValue;
        // if (timeDimension === ETimeDimension.WEEK) {
        //   return ''; // 暂时屏蔽周损益
        // }
        // 非bg层无法查看10以下的指标排名
        if (orgCode !== 'MQ' && row.sort >= 10) {
          return '';
        }
        return '/dataAnalysis/financial/profit/detail';
      },
      getPathParams: ({ row, searchFormValue }) => {
        const { timeDimension, dimension, isExpandSBU /**predictType*/ } = searchFormValue;
        console.log('🚀 ~ searchFormValue:', searchFormValue, searchFormValue.dateRange);
        const query = {
          orgCode: searchFormValue.orgCode,
          dateRange: searchFormValue.dateRange,
          metric: row.metricKey,
          timeDimension: dimension,
          dimension: timeDimension,
          isExpandSBU,
          // predictType,
          // timeDimension: searchFormValue.timeDimension,
          // dimension: timeDimension === ETimeDimension.WEEK ? timeDimension : dimension,
        };
        return query;
      },
    },
  },
};
export const getAllColumns = ({
  dimension = ETimeDimension.WEEK,
  dateRange = [dayjs(), dayjs().subtract(1, 'week')],
}: {
  dimension?: ETimeDimension;
  dateRange?: [Dayjs, Dayjs];
} = {}): BaseVxeTableTypes.Columns => {
  const [, endDate] = dateRange;
  const { year, monthStr, weekStr } = parseDateDetail(endDate) ?? {};

  const endWeekStr = `WK${weekStr}`;
  const currentYear = year;
  const monthKey = `${currentYear}${monthStr}`;

  // 提取分析逻辑
  const getDialogueInfo = ({ row, searchFormValue }) => {
    const { timeDimension, orgCode, dimension } = searchFormValue;
    let { endDim: dateStr } = getDateRangeDim(timeDimension, searchFormValue.dateRange);
    const { analysis, code: id } = row;
    const dateType = timeDimension === 'week' ? 0 : dimension === 'cz' ? 1 : 2; //NOSONAR 0周 1月产值 2月销值
    const info = { analysis, id, orgCode, dateStr, dateType, title: id ? '编辑' : '新增' };
    return info;
  };
  const commonColumnAnalysis = {
    field: `analysis${dimension}`,
    width: 450,
    className: 'bg-white font-normal',
    showOverflow: false,
    slots: {
      default: ESlotDefault.DIALOGUE,
    },
    params: {
      dialogueCompo: InfoDetail,
      getDialogueInfo,
    },
  };

  // 周KPI
  const weekColumns: BaseVxeTableTypes.Columns = [
    commonColumnOptions.factory,
    commonColumnOptions.sort,
    commonColumnOptions.metric,
    ...getWeekColumns({ dimension, dateRange }),
    {
      field: 'weekList',
    },
    {
      title: `${endWeekStr}损益分析总结`, //WK32（截止周）损益分析总结
      type: 'html',
      ...commonColumnAnalysis,
      headerAlign: 'center',
    },
  ];
  // 月KPI
  const monthColumns: BaseVxeTableTypes.Columns = [
    commonColumnOptions.factory,
    commonColumnOptions.sort,
    commonColumnOptions.metric,
    { field: 'monthList' },
    {
      title: `${monthKey}损益分析总结`, //WK32（截止周）损益分析总结
      type: 'html',
      ...commonColumnAnalysis,
      headerAlign: 'center',
    },
  ];

  return dimension === ETimeDimension.WEEK ? weekColumns : monthColumns;
};

// 自定义格式化字段表头配置
export const customFieldOptions = {
  weekList: {
    getColumns: ({ data }) => {
      const columns = data.map((item, idx) => ({
        field: `week_list${idx}`,
        title: item.key,
        headerAlign: 'center',
        headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
        children: [
          {
            ...commonMiniValueOption,
            field: `week_list${idx}_amount`,
            title: '金额',
            headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
            formatter: formatValue,
            className: getValueCellClassName(),
          },
          {
            ...commonMiniValueOption,
            field: `week_list${idx}_propor`,
            title: '占比',
            headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
            formatter: formatRate,
            className: getValueCellClassName(),
          },
        ],
      }));
      return columns;
    },
    formatData: (values: any[]) => {
      const info = values.reduce((pre, cur, idx) => {
        return {
          ...pre,
          [`week_list${idx}_amount`]: cur.amount,
          [`week_list${idx}_propor`]: cur.propor,
        };
      }, {});
      return info;
    },
  },
  monthList: {
    getColumns: ({ data }) => {
      const columns = data.map((month, idx) => ({
        field: `month_list${idx}`,
        title: month.monthKey,
        headerAlign: 'center',
        headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
        children: month.vlist.map((list, listIdx) => ({
          field: `month_list${idx}_${listIdx}`,
          title: list.key,
          headerAlign: 'center',
          headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
          children: list.values.map((value, valueIdx) => ({
            ...commonMiniValueOption,
            field: `month_list${idx}_${listIdx}_${valueIdx}`,
            title: value.keys,
            headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
            formatter: formatValue,
            className: getValueCellClassName(),
          })),
        })),
      }));
      return columns;
    },
    formatData: (values: any[]) => {
      // 此数据格式异常复杂（三层数据嵌套
      const info = values.reduce((pre, cur, idx) => {
        const current = (cur.vlist ?? []).reduce((preValue, curValue, valueIdx) => {
          return {
            ...preValue,
            ...(curValue.values ?? []).reduce((a, b, i) => {
              return {
                ...a,
                [`month_list${idx}_${valueIdx}_${i}`]: b.values,
                [`month_list${idx}_${valueIdx}_${i}`]: b.values,
              };
            }, {}),
          };
        }, {});
        return {
          ...pre,
          ...current,
        };
      }, {});
      return info;
    },
  },
};

/** 批量导入菜单 */
const { downloadFile: DownloadProfitandlosTemplate } = useDownload({
  requestApi: getProfitandlosDownloadTemplate,
});

/** 导入按钮配置 */
export const batchMenuItems: MenuItemType[] = [
  {
    label: '手工数据',
    key: 'papers',
    children: [
      {
        label: '模版下载',
        key: 'profitTemplate',
        clickMethod: () => {
          return DownloadProfitandlosTemplate({ fileName: '手工数据导入模板' });
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/profitandlos/importManualData',
          buttonText: '导入',
        }),
        key: 'profitImport',
      },
    ],
  },
  {
    label: '目标数据',
    key: 'WeekGoalsV2',
    children: [
      {
        label: '模版下载',
        key: 'WeekGoalsV2Template',
        clickMethod: () => {
          return DownloadProfitandlosTemplate({ fileName: '目标导入模板' });
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/profitandlos/importWeekGoalsV2',
          buttonText: '导入',
        }),
        key: 'WeekGoalsV2Import',
      },
    ],
  },
];

export const getWeekColumns = ({
  dimension = ETimeDimension.WEEK,
  dateRange = [dayjs(), dayjs().subtract(1, 'week')],
}: {
  dimension?: ETimeDimension;
  dateRange?: [Dayjs, Dayjs];
} = {}) => {
  const [, endDate] = dateRange;
  const endWeekStr = `WK${endDate.week()}`;
  const endLastWeekStr = `WK${endDate.subtract(1, 'week').week()}`;
  const currentYear = endDate.year();
  const lastYear = endDate.subtract(1, 'year').year();
  const monthKey = `${currentYear}${(endDate.month() + 1).toString().padStart(2, '0')}`;

  const weekColumns: BaseVxeTableTypes.Columns = [
    {
      field: '实际环比',
      title: `${endWeekStr}实际环比`,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          ...commonMiniValueOption,
          title: endWeekStr,
          field: 'actualChainThis',
          headerClassName: 'bg-purple',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'actualChainThisPropor',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: endLastWeekStr,
          field: 'actualChainLast',
          headerClassName: 'bg-purple',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'actualChainLastPropor',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '环比差额',
          field: 'actualChainBalance',
          headerClassName: 'bg-purple',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占比',
          field: 'actualChainDifferen',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
      ],
    },
    {
      field: '${endWeekStr}目标达成',
      title: `${endWeekStr}目标达成`,
      headerAlign: 'center',
      children: [
        {
          ...commonMiniValueOption,
          title: endWeekStr,
          field: 'actualChainThis2',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'actualChainThisPropor2',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '目标',
          field: 'weekGoals',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'weekGoalsPropor',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '差额',
          field: 'weekGoalsBalance',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占比',
          field: 'weekGoalsDifferen',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
      ],
    },
    {
      field: 'monthKey目标达成',
      title: `${monthKey}目标达成`,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          ...commonMiniValueOption,
          title: '周累计',
          field: 'monthWeekGoalsTotal',
          headerClassName: 'bg-purple',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'monthWeekGoalsTotalPropor',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '目标',
          field: 'monthGoals',
          headerClassName: 'bg-purple',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'monthGoalsPropor',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '差额',
          field: 'monthGoalsBalance',
          headerClassName: 'bg-purple',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占比',
          field: 'monthGoalsDifferen',
          headerClassName: 'bg-purple',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
      ],
    },
    {
      field: 'WK01-${endWeekStr}累计同比',
      title: `WK01-${endWeekStr}累计同比`,
      headerAlign: 'center',
      children: [
        {
          ...commonMediumValueOption,
          width: 66,
          title: `${currentYear}年累计`,
          field: 'thisYearOnYear',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'thisYearOnYearPropor',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMediumValueOption,
          width: 66,
          title: `${lastYear}年累计`,
          field: 'lastYearOnYear',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占产值%',
          field: 'lastYearOnYearPropor',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
        {
          ...commonMediumValueOption,
          width: 74,
          title: `${currentYear}年-${lastYear}`,
          field: 'yearOnYearBalance',
          formatter: formatValue,
          className: getValueCellClassName(),
        },
        {
          ...commonMiniValueOption,
          title: '占比',
          field: 'yearOnYearDifferen',
          formatter: formatRate,
          className: getValueCellClassName(),
        },
      ],
    },
  ];
  return weekColumns;
};
