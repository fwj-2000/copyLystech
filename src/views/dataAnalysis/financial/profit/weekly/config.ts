import { commonMiniValueOption, commonValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs, { Dayjs } from 'dayjs';
import XEUtils from 'xe-utils';
import { isString } from '/@/utils/is';

import { IJumpButtonOption } from './types';
import type { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import { getProfitandlosDownloadTemplate, getSyOrganization } from '/@/api/dataAnalysis/financial';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import { h } from 'vue';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { getDateRangeDim, getCustomDefaultRange, transThouIntEx } from '/@/views/dataAnalysis/utils';
export { getText, isNull } from '/@/views/dataAnalysis/financial/profit/report/utils';
import InfoDetail from './infoDetail/index.vue';

const ComDimension = ETimeDimension.WEEK;
const formatValue = (cellValue, row, column, useTrue = true, digits = 2) => {
  if (!cellValue) return '';
  const { metricKey: metric } = row;
  const { title } = column;
  const rateMetric = ['边际贡献率', '毛利率', '营运利润率', '销售毛利率', '税后利润率'];
  const rateColumn = ['集团'];
  if (isString(cellValue)) {
    return cellValue;
  }
  if (title.includes('%') || title.includes('占比') || rateMetric.includes(metric) || rateColumn.includes(title)) {
    return `${cellValue.toFixed(1)}%`;
  }
  return transThouIntEx(cellValue, '', digits, useTrue);
};

const formatRate = ({ cellValue }) => {
  return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
};

// 表格字段配置
export const getAllColumns = (dateRange: [Dayjs, Dayjs] = [dayjs(), dayjs().subtract(1, ComDimension)]): BaseVxeTableTypes.Columns => {
  const [, endDate] = dateRange;
  const endWeekStr = `WK${endDate.week()}`;
  console.log('🚀 ~ getAllColumns ~ endDate.week():', endDate.week());
  const endLastWeekStr = `WK${endDate.subtract(1, ComDimension).week()}`;
  const currentYear = endDate.year();
  const lastYear = endDate.subtract(1, 'year').year();
  const monthKey = `${currentYear}${(endDate.month() + 1).toString().padStart(2, '0')}`;
  const getDialogueInfo = ({ row, searchFormValue }) => {
    const { orgCode } = searchFormValue;
    let { endDim: dateStr } = getDateRangeDim(ComDimension, searchFormValue.dateRange);
    const { analysis, code: id } = row;
    const dateType = 0; // 0周 1月产值 2月销值
    const info = { analysis, id, orgCode, dateStr, dateType, title: id ? '编辑' : '新增' };
    return info;
  };
  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'sort',
      title: '序号',
      fixed: 'left',
      headerAlign: 'center',
      width: 90,
      treeNode: true,
      // className: ({ row }) => {
      //   const { sort } = row;
      //   if (!`${sort}`.includes('.')) {
      //     return '';
      //   }
      //   return `${sort}`.split('.')[1].length > 1 ? 'text-indent-2' : 'text-indent-1';
      // },
    },
    {
      field: 'metric',
      title: '指标',
      fixed: 'left',
      headerAlign: 'center',
      width: 80,
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      field: '实际环比',
      title: `${endWeekStr}实际环比`,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          title: endWeekStr,
          ...commonValueOption,
          field: 'actualChainThis',
          width: 70,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          ...commonMiniValueOption,
          field: 'actualChainThisPropor',
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: endLastWeekStr,
          ...commonValueOption,
          field: 'actualChainLast',
          width: 65,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          ...commonMiniValueOption,
          field: 'actualChainLastPropor',
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: '环比差额',
          ...commonMiniValueOption,
          field: 'actualChainBalance',
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          ...commonMiniValueOption,
          field: 'actualChainDifferen',
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
      ],
    },
    {
      field: '目标达成',
      title: `${endWeekStr}目标达成`,
      headerAlign: 'center',
      children: [
        {
          title: endWeekStr,
          field: 'actualChainThis2',
          ...commonMiniValueOption,
          width: 65,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'actualChainThisPropor2',
          ...commonMiniValueOption,
          formatter: formatRate,
        },
        {
          title: '目标',
          field: 'weekGoals',
          ...commonMiniValueOption,
          width: 65,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'weekGoalsPropor',
          width: 100,
          ...commonMiniValueOption,
          formatter: formatRate,
        },
        {
          title: '差额',
          field: 'weekGoalsBalance',
          ...commonMiniValueOption,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          field: 'weekGoalsDifferen',
          ...commonMiniValueOption,
          formatter: formatRate,
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
          title: '周累计',
          field: 'monthWeekGoalsTotal',
          ...commonMiniValueOption,
          width: 75,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'monthWeekGoalsTotalPropor',
          ...commonMiniValueOption,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: '目标',
          field: 'monthGoals',
          ...commonMiniValueOption,
          width: 65,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'monthGoalsPropor',
          ...commonMiniValueOption,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: '差额',
          field: 'monthGoalsBalance',
          ...commonMiniValueOption,
          width: 65,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          field: 'monthGoalsDifferen',
          ...commonMiniValueOption,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
      ],
    },
    {
      field: 'WK01-${endWeekStr}累计同比',
      title: `WK01-${endWeekStr}累计同比`,
      headerAlign: 'center',
      children: [
        {
          title: `${currentYear}年累计`,
          field: 'thisYearOnYear',
          ...commonMiniValueOption,
          width: 75,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'thisYearOnYearPropor',
          ...commonMiniValueOption,
          formatter: formatRate,
        },
        {
          title: `${lastYear}年累计`,
          field: 'lastYearOnYear',
          ...commonMiniValueOption,
          width: 75,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'lastYearOnYearPropor',
          ...commonMiniValueOption,
          formatter: formatRate,
        },
        {
          title: `${currentYear}年-${lastYear}`,
          field: 'yearOnYearBalance',
          ...commonMiniValueOption,
          width: 75,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          field: 'yearOnYearDifferen',
          ...commonMiniValueOption,
          formatter: formatRate,
        },
      ],
    },
    {
      field: 'weekList',
    },
    {
      title: `${endWeekStr}损益分析总结`, //WK32（截止周）损益分析总结
      type: 'html',
      field: 'analysis',
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
    },
  ];

  return columns;
};

// 通用搜索组件配置
export const commonOptions: TFormItemOption[] = [
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
        };
      });
      return handleList;
    },
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: getCustomDefaultRange(),
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      picker: ComDimension,
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(ComDimension, value);
      return { startDim, endDim };
    },
  },
];

// 自定义格式化字段表头配置
export const customFieldOptions = {
  weekList: {
    getColumns: ({ data }) => {
      const columns = data.map((item, idx) => ({
        field: `weekList${idx}`,
        title: item.key,
        headerAlign: 'center',
        headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
        children: [
          {
            field: `weekList${idx}_amount`,
            title: '金额',
            ...commonValueOption,
            width: 65,
            headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
            formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
            //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
          },
          {
            field: `weekList${idx}_propor`,
            title: '占比',
            ...commonValueOption,
            width: 60,
            headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
            formatter: formatRate,
          },
        ],
      }));
      return columns;
    },
    formatData: (values: any[]) => {
      const info = values.reduce((pre, cur, idx) => {
        return {
          ...pre,
          [`weekList${idx}_amount`]: cur.amount,
          [`weekList${idx}_propor`]: cur.propor,
        };
      }, {});
      return info;
    },
  },
};

export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: '手工数据',
    getPathUrl: () => {
      // 构造路由参数
      const url = `/dataAnalysis/financial/profit/manualData`;
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        dateRange: searchFormValue.dateRange,
        orgCode: searchFormValue.orgCode,
      };
      return query;
    },
  },
];

/** 导入按钮配置 */
const { downloadFile: DownloadProfitandlosTemplate } = useDownload({
  requestApi: getProfitandlosDownloadTemplate,
});
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
