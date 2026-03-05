import dayjs from 'dayjs';
import { cloneDeep, merge } from 'lodash-es';
import { getOrganization } from '/@/api/dashbord/operate';

import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import { ETimeDimension } from './types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

// 通用字段配置
export const allColumns: Record<string, BaseVxeTableTypes.Column> = {
  // 主要报表
  factory: {
    width: 80,
    fixed: 'left',
    title: '厂区',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
    mergeConfig: {
      needMergeRow: true,
    },
  },
  category: {
    width: 120,
    fixed: 'left',
    title: '指标类型',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
    mergeConfig: {
      needMergeRow: true,
    },
  },
  metric: {
    width: 120,
    fixed: 'left',
    title: '指标',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
  },
  vlist: {
    width: 100,
    sortable: true,
    columnType: EColumnType.DATA_LIST,
    formatTitle: dataS => {
      return dataS.slice(4);
    },
  },
  // 产销率分组
  prodline: {
    width: 100,
    title: '产品线',
    fixed: 'left',
    mergeConfig: {
      needMergeRow: true,
      mergeRowField: 'groupid',
    },
  },
  item: {
    width: 100,
    title: '项目',
    fixed: 'left',
    mergeConfig: {
      needMergeRow: true,
      mergeRowField: 'groupid',
    },
  },
};

// 获取表头配置
type TGetColumnsParams = Omit<BaseVxeTableTypes.Column, 'field'> & { field: string }[];
export function getColumns(columns: TGetColumnsParams): BaseVxeTableTypes.Columns {
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field as string] ?? {}), item);
  });
}

// 通用搜索组件配置
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const PRODAND_ORG_CODE_KEY = 'PRODAND_ORG_CODE_KEY';
export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    setDefault: (options, routeQuery) => {
      const isIncludeOrgCode = options.some(item => item.value === localStorage.getItem(PRODAND_ORG_CODE_KEY));
      return isIncludeOrgCode ? localStorage.getItem(PRODAND_ORG_CODE_KEY) : options[0].value ?? '';
    },
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getOrganization({
        ...params,
        keyword: '1',
      });
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        return {
          id: getFieldValue(item, 'id'),
          parentId: getFieldValue(item, 'parent_Id'),
          value: getFieldValue(item, 'org_Code'),
          text: getFieldValue(item, 'org_Name'),
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: 'week',
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(4, 'week'), dayjs().tz().add(4, 'week')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
  },
];
