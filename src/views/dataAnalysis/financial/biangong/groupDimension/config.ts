import XEUtils from 'xe-utils';
import { dimensionCommonFormOptions_8Week, timeRangeClosures } from '/@/views/dataAnalysis/financial/config';
import { commonMediumValueOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDimensionDimensionTypeparameter } from '/@/api/dashbord/report';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault, EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import dayjs, { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { getSyOrganization } from '/@/api/dataAnalysis/financial';

export let SyOrganization = {};
const excludeOrgCodeOption = dimensionCommonFormOptions_8Week.filter(item => item.key !== 'orgCode');
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
      SyOrganization = {};
      const handleList = list.map(item => {
        SyOrganization[item.Org_Code] = item.Org_Name;
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
  ...excludeOrgCodeOption,
  {
    label: '目标时间',
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(56, 'day'),
    key: 'date',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
      disabledDate: (current: Dayjs) => {
        const tooEarly = timeRangeClosures[0]; // 如何获取动态值？
        const tooLate = timeRangeClosures[1];
        return current < tooEarly || current > tooLate;
      },
    },
    getParam: (value, searchFormValue) => {
      let dataRangeP: Dayjs[] = [];
      const { dateRange, dimension } = searchFormValue;
      if (value > dateRange[0] && value < dateRange[1]) {
        dataRangeP = [value, value];
      } else {
        dataRangeP = [dateRange[0], dateRange[0]];
      }
      const { endDim } = getDateRangeDim(dimension, dataRangeP);
      return { tarGetWeek: endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '维度',
    default: ['factory'],
    isOverrideDefault: false,
    key: 'dimensionType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getOptions: async () => {
      const { data } = await getDimensionDimensionTypeparameter({});
      return Object.entries(data).map(([key, value]) => ({
        text: value as string,
        value: key,
      }));
    },
    getParam: value => {
      return { dimensionType: value.join(';') };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '工单类型',
    default: [],
    key: 'workNoType',
    attrs: {
      allowClear: false,
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { workNoType: value.join(';') };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '维度',
    default: '1',
    key: 'showType',
    attrs: {
      allowClear: false,
    },
    // 目标维度 2、环比维度 1
    options: [
      {
        text: '目标维度',
        value: '2',
      },
      {
        text: '环比维度',
        value: '1',
      },
    ],
    // getParam: value => {
    //   return { showType: value.join(';') };
    // },
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'dimesionType',
      columnType: EColumnType.KEYS_VALUES,
      align: 'center',
      className: 'bg-white',
      fixed: 'left',
      mergeConfig: {
        needMergeRow: true,
      },
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      headerAlign: 'center',
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/biangong/papersDimension';
        },
        getPathParams: ({ row, column, searchFormValue, columnIndex }) => {
          const { dimensionType, ...res } = searchFormValue;
          const filterKeyMap = {
            zzdkh: 'customerType', //客户
            zzrgcs: 'engineer', //"工程师",
            zcplb: 'productType', //"产品类别",
            znbxm: 'programType', //"项目",
            zj6m: 'sixCodes', //中间6码
            workshop: 'workShopType', //"车间",
            aufnr: 'orderNo', //"订单号",
            zxlxm: 'newOldProject', //"新老项目",
            xxm: 'smallProject', //小项目
            cpx: 'productLine', //产品线
            matnr: 'productNo', //成品料号
            other1: 'general1',
            other2: 'general2',
            other3: 'general3',
            other4: 'general4',
            other5: 'general5',
            largeproject: 'largeProject', //大项目
            factory: 'factory', //厂区
            zj10m: 'zj10m', //中间10码
          };
          const dimensionKey = filterKeyMap[dimensionType[columnIndex]] ?? '';
          const query = {
            ...res,
          };
          if (dimensionKey && dimensionKey === 'factory') {
            query.orgCode = row.orgCode;
          } else if (dimensionKey) {
            query[dimensionKey] = row[column.field];
          }
          // console.log(query, 'query11');
          return query;
        },
      },
    },
    {
      ...commonMediumTextOption,
      field: 'category',
      title: '指标',
      align: 'center',
      fixed: 'left',
      mergeConfig: {
        needMergeRow: true,
      },
      width: 70,
      headerAlign: 'center',
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ row }) => {
          const { category } = row;
          return category === '人工' ? '/dataAnalysis/financial/biangong/laborEfficiency' : '';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const { orgCode, ...res } = searchFormValue;
          console.log(orgCode, 'query11', searchFormValue);
          const query = {
            orgCode: row.orgCode,
            ...res,
          };
          return query;
        },
      },
    },
    {
      ...commonMediumTextOption,
      field: 'metric',
      title: '类目',
      fixed: 'left',
      // slots: {
      //   filter: EFilterSlot.MULTI_SEARCH_SELECT_REMOTE,
      // },
      // params: {
      //   getFilters: () => {
      //     return [
      //       {
      //         text: '2025WK28',
      //         value: '2025WK28',
      //       },
      //     ];
      //   },
      //   getDefaultFilterValues: () => {
      //     return '2025WK28';
      //   },
      // },
      width: 90,
      headerAlign: 'center',
    },
    {
      ...commonMediumValueOption,
      field: 'vList',
      width: 90,
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue, row, column: { title } }) => {
        const { metric } = row;
        if (!cellValue || !metric) return '';
        if (metric.includes('(万)') || title === '提升金额') return XEUtils.commafy(cellValue, { digits: 0 });
        if (metric.includes('产值均价')) return XEUtils.commafy(cellValue, { digits: 4 });
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
      exportMethod: ({ row, column }) => {
        const { metric } = row;
        if (!row[column.field] || !metric) return '';
        if (metric.includes('(万)') || column.title === '提升金额' || metric.includes('产值均价')) return XEUtils.toFixed(row[column.field], 4);
        return `${XEUtils.toFixed(Number(row[column.field]), 1)}%`;
      },
      className: params => {
        const { row, column } = params;
        const classList: string[] = [];

        // 逻辑 1: 趋势类名
        const trendClass = getTrendClass(params);
        if (trendClass) classList.push(trendClass);

        // 逻辑 2: 红黑类名
        if (checkIsRedText(row, column.title as string, row[column.field])) {
          classList.push('text-red');
        }

        return classList.join(' ');
      },
    },
  ];

  return columns;
};

export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '项目',
    default: '',
    key: 'programType',
  },
  {
    type: EFormItemType.INPUT,
    label: '客户',
    default: '',
    key: 'customerType',
  },
  {
    type: EFormItemType.INPUT,
    label: '工程师',
    default: '',
    key: 'engineer',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品类别',
    default: '',
    key: 'productType',
  },
  {
    type: EFormItemType.INPUT,
    label: '中间6码',
    default: '',
    key: 'sixCodes',
  },

  {
    type: EFormItemType.INPUT,
    label: '车间',
    default: '',
    key: 'workShopType',
  },

  {
    type: EFormItemType.INPUT,
    label: '新老项目',
    default: '',
    key: 'newOldProject',
  },
  {
    type: EFormItemType.INPUT,
    label: '小项目',
    default: '',
    key: 'smallProject',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品线',
    default: '',
    key: 'productLine',
  },

  {
    type: EFormItemType.INPUT,
    label: '通用1',
    default: '',
    key: 'generall1',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用2',
    default: '',
    key: 'generall2',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用3',
    default: '',
    key: 'generall3',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用4',
    default: '',
    key: 'generall4',
  },
  {
    type: EFormItemType.INPUT,
    label: '通用5',
    default: '',
    key: 'generall5',
  },
];

/**
 * 判断是否需要显示下降箭头
 */
const getTrendClass = (params: any): string => {
  const { row, column, $grid } = params;
  const { field } = column;

  // 1. 基础条件过滤
  // 过滤行 相当于&&条件
  if (!['边贡', '材料', '损耗', '人工'].includes(row.category)) return '';
  if (!['制程提升%', '制程损失（万）'].includes(row.metric)) return '';
  // 过滤列
  const isWeekColumn = field.startsWith('vList_') && !['累计', '增长幅', '制程提升', '提升金额', '目标'].some(k => field.includes(k));
  if (!isWeekColumn) return '';

  // 2. 获取列索引
  const visibleColumns = $grid?.getColumns();
  if (!visibleColumns) return '';

  const currIndex = visibleColumns.findIndex((col: any) => col.field === field);
  if (currIndex <= 0) return '';

  // 3. 环比数据比较
  const prevField = visibleColumns[currIndex - 1].field;
  if (!prevField?.startsWith('vList_') || prevField.includes('目标')) return '';

  const prevValue = Number(row[prevField]);
  const currValue = Number(row[field]);

  // 1. 先排除无效数据
  if (Number.isNaN(prevValue) || Number.isNaN(currValue)) return '';
  // 2. 边贡下降 -> 报警
  if (row.category === '边贡' && currValue < prevValue) return 'text-after-icon';
  // 3. 成本(非边贡)上升 -> 报警
  if (row.category !== '边贡' && currValue > prevValue) return 'text-after-icon';

  return '';
  // return !Number.isNaN(prevValue) && !Number.isNaN(currValue) && currValue < prevValue ? 'text-after-icon' : '';
};

/**
 * 判断是否为红色文本
 */
const checkIsRedText = (row: any, title: string, value: any): boolean => {
  const val = Number.parseFloat(value);
  if (Number.isNaN(val)) return false;

  if (['边贡'].includes(row.category)) {
    return val < 0;
  }

  const isSpecialColumn = row.metric === '差异' || ['提升金额', '增长幅', '制程提升'].includes(title);
  const isSpecialColumn1 = ['材料', '损耗', '人工'].includes(row.category) && ['制程提升%', '制程损失(万)'].includes(row.metric);
  if (isSpecialColumn || isSpecialColumn1) {
    return val > 0;
  }

  return val < 0;
};
