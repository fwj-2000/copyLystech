import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import { commonTextOption, commonValueOption } from '/@/views/dashboard/commonComponents/BaseVxeTable/config';
import { BaseVxeTableTypes, EFilterSlot } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import dayjs, { Dayjs } from 'dayjs';
import { getSyOrganization } from '/@/api/dashbord/operate';
import XEUtils from 'xe-utils';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import { isString } from '/@/utils/is';

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
export const getAllColumns = (dateRange: [Dayjs, Dayjs] = [dayjs(), dayjs().subtract(1, 'week')]): BaseVxeTableTypes.Columns => {
  const [, endDate] = dateRange;
  const endWeekStr = `WK${endDate.week()}`;
  const endLastWeekStr = `WK${endDate.subtract(1, 'week').week()}`;
  const currentYear = endDate.year();
  const lastYear = endDate.subtract(1, 'year').year();
  const monthKey = `${currentYear}${(endDate.month() + 1).toString().padStart(2, '0')}`;

  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'sort',
      title: '序号',
      fixed: 'left',
      headerAlign: 'center',
      width: 60,
      className: ({ row }) => {
        const { sort } = row;
        if (!`${sort}`.includes('.')) {
          return '';
        }
        return `${sort}`.split('.')[1].length > 1 ? 'text-indent-2' : 'text-indent-1';
      },
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
      title: `${endWeekStr}实际环比`,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          title: endWeekStr,
          ...commonValueOption,
          field: 'actualChainThis',
          width: 80,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          ...commonValueOption,
          field: 'actualChainThisPropor',
          width: 100,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: endLastWeekStr,
          ...commonValueOption,
          field: 'actualChainLast',
          width: 80,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          ...commonValueOption,
          field: 'actualChainLastPropor',
          width: 100,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: '环比差额',
          ...commonValueOption,
          field: 'actualChainBalance',
          width: 100,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          ...commonValueOption,
          field: 'actualChainDifferen',
          width: 80,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
      ],
    },
    {
      title: `${endWeekStr}目标达成`,
      headerAlign: 'center',
      children: [
        {
          title: endWeekStr,
          field: 'actualChainThis',
          width: 80,
          ...commonValueOption,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'actualChainThisPropor',
          width: 100,
          ...commonValueOption,
          formatter: formatRate,
        },
        {
          title: '目标',
          field: 'weekGoals',
          width: 80,
          ...commonValueOption,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'weekGoalsPropor',
          width: 100,
          ...commonValueOption,
          formatter: formatRate,
        },
        {
          title: '差额',
          field: 'weekGoalsBalance',
          width: 80,
          ...commonValueOption,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          field: 'weekGoalsDifferen',
          width: 80,
          ...commonValueOption,
          formatter: formatRate,
        },
      ],
    },
    {
      title: `${monthKey}目标达成`,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          title: '周累计',
          field: 'monthWeekGoalsTotal',
          width: 80,
          ...commonValueOption,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'monthWeekGoalsTotalPropor',
          width: 100,
          ...commonValueOption,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: '目标',
          field: 'monthGoals',
          width: 80,
          ...commonValueOption,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'monthGoalsPropor',
          width: 100,
          ...commonValueOption,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
        {
          title: '差额',
          field: 'monthGoalsBalance',
          width: 80,
          ...commonValueOption,
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          field: 'monthGoalsDifferen',
          width: 80,
          ...commonValueOption,
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
      ],
    },
    {
      title: `WK01-${endWeekStr}累计同比`,
      headerAlign: 'center',
      children: [
        {
          title: `${currentYear}年累计`,
          field: 'thisYearOnYear',
          ...commonValueOption,
          width: 115,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'thisYearOnYearPropor',
          ...commonValueOption,
          width: 100,
          formatter: formatRate,
        },
        {
          title: `${lastYear}年累计`,
          field: 'lastYearOnYear',
          ...commonValueOption,
          width: 115,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占产值%',
          field: 'lastYearOnYearPropor',
          ...commonValueOption,
          width: 100,
          formatter: formatRate,
        },
        {
          title: `${currentYear}年-${lastYear}`,
          field: 'yearOnYearBalance',
          ...commonValueOption,
          width: 115,
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          title: '占比',
          field: 'yearOnYearDifferen',
          ...commonValueOption,
          width: 100,
          formatter: formatRate,
        },
      ],
    },
    {
      field: 'weekList',
    },
  ];

  return columns;
};

// 通用搜索组件配置
export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: 'MQ1001001',
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
    // getOptions: async (params = {}) => {
    //   const { data } = await getSyOrganization({
    //     ...params,
    //     keyword: '1',
    //   });
    //   const list = data.list ?? data;
    //   // 将结果处理成下拉菜单的属性
    //   const handleList = list.map(item => {
    //     return {
    //       id: getFieldValue(item, 'id'),
    //       parentId: getFieldValue(item, 'parent_Id'),
    //       value: getFieldValue(item, 'org_Code'),
    //       text: getFieldValue(item, 'org_Name'),
    //     };
    //   });
    //   // 转换成树形结构数据
    //   return handleList;
    // },
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(4, 'week'), dayjs().tz().subtract(3, 'week')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      picker: 'week',
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
            width: 80,
            ...commonValueOption,

            headerClassName: idx % 2 === 0 ? 'bg-purple' : '',
            formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
            exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
          },
          {
            field: `weekList${idx}_propor`,
            title: '占比',
            width: 80,
            ...commonValueOption,

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
