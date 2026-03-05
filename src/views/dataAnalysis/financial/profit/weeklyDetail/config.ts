import dayjs, { Dayjs } from 'dayjs';
import { getSyOrganization } from '/@/api/dataAnalysis/financial';
import XEUtils from 'xe-utils';
import { commonTextOption, commonValueOption } from '/@/views/dashboard/commonComponents/BaseVxeTable/config';
import { getDateDim } from '/@/views/dashboard/utils';
import { IJumpButtonOption } from '/@/views/dataAnalysis/components/TableLayout/types';
import { EFormItemType, EOrgLevel, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { ETimeDimension } from '/@/views/dashboard/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import { isString } from '/@/utils/is';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
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
export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: 'zfi019nl',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/profit/zfi019nl';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dimension: ETimeDimension.WEEK,
        dateRange: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
      };
      return query;
    },
  },
  {
    title: 'zfi008',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/profit/zfi008';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dimension: ETimeDimension.WEEK,
        dateRange: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
      };
      return query;
    },
  },
  {
    title: 'zfi080c',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/profit/zfi080c';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dimension: ETimeDimension.WEEK,
        dateRange: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
      };
      return query;
    },
  },
  {
    title: 'zmm010i',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/profit/zmm010i';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dimension: ETimeDimension.WEEK,
        dateRange: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
      };
      return query;
    },
  },
  {
    title: 'zmm023',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/profit/zmm023';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dimension: ETimeDimension.WEEK,
        dateRange: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
      };
      return query;
    },
  },
  {
    title: 'zif168',
    getPathUrl: () => {
      // 构造路由参数
      const url = '/dataAnalysis/financial/profit/zif168';
      return url;
    },
    getPathParams: searchFormValue => {
      const query = {
        orgCode: searchFormValue.orgCode,
        dimension: ETimeDimension.WEEK,
        dateRange: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
      };
      return query;
    },
  },
];

// 表格字段配置
export const getAllColumns = (date: Dayjs | null = null): BaseVxeTableTypes.Columns => {
  const currentWeek = date ? getDateDim(date) : '当周';
  const lastWeek = date ? getDateDim(date.subtract(1, 'week')) : '上周';
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
      ...commonTextOption,
      field: 'metricKey',
      title: '指标',
      fixed: 'left',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ row }) => {
          const { tCode } = row;
          return tCode === '/' ? '' : '/dataAnalysis/financial/profit/weeklyDetail/detail';
        },
        getPathParams: ({ searchFormValue, row }) => {
          return {
            dateRange: [date, date],
            orgCode: searchFormValue.orgCode,
            metric: row.metricKey,
          };
        },
      },
    },
    {
      ...commonTextOption,
      field: 'dataType',
      title: '分类',
    },
    {
      ...commonTextOption,
      field: 'source',
      title: '来源',
    },
    {
      ...commonTextOption,
      field: 'tCode',
      title: 'T-code',
    },
    {
      ...commonTextOption,
      field: 'logic',
      title: '取数逻辑',
      width: 100,
    },
    {
      field: 'currentWeek',
      title: currentWeek,
      headerAlign: 'center',
      headerClassName: 'bg-purple',
      children: [
        {
          ...commonValueOption,
          field: 'thisSap',
          title: 'SAP',
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          ...commonValueOption,
          field: 'thisManual',
          title: '手导',
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
          slots: {
            default: ESlotDefault.LINK_DEFAULT,
          },
          params: {
            getPathUrl: () => {
              return '/dataAnalysis/financial/profit/manualData';
            },
            getPathParams: ({ searchFormValue }) => {
              return {
                dateRange: [date, date],
                orgCode: searchFormValue.orgCode,
              };
            },
          },
        },
        {
          ...commonValueOption,
          field: 'thisTotal',
          title: '合计',
          headerClassName: 'bg-purple',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          ...commonValueOption,
          field: 'thisPropor',
          title: '占比',
          headerClassName: 'bg-purple',
          formatter: formatRate,
        },
      ],
    },
    {
      field: 'lastWeek',
      title: lastWeek,
      headerAlign: 'center',
      children: [
        {
          ...commonValueOption,
          field: 'lastSap',
          title: 'SAP',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          ...commonValueOption,
          field: 'lastManual',
          title: '手导',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
          slots: {
            default: ESlotDefault.LINK_DEFAULT,
          },
          params: {
            getPathUrl: () => {
              return '/dataAnalysis/financial/profit/manualData';
            },
            getPathParams: ({ searchFormValue }) => {
              return {
                dateRange: [date?.subtract(1, 'week'), date?.subtract(1, 'week')],
                orgCode: searchFormValue.orgCode,
              };
            },
          },
        },
        {
          ...commonValueOption,
          field: 'lastTotal',
          title: '合计',
          formatter: ({ cellValue, row, column }) => formatValue(cellValue, row, column),
          //exportMethod: ({ row, column }) => formatValue(row[column.field], row, column, false),
        },
        {
          ...commonValueOption,
          field: 'lastPropor',
          title: '占比',
          formatter: formatRate,
        },
      ],
    },
  ];

  return columns;
};

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
    type: EFormItemType.DATE_PICKER,
    default: dayjs().tz().subtract(1, 'week'),
    key: 'week',
    pickerKey: 'dimension',
    attrs: {
      picker: 'week',
      allowClear: false,
    },
    getParam: value => {
      return { week: getDateDim(value) };
    },
  },
];

// 自定义格式化字段表头配置
export const customFieldOptions = {};
