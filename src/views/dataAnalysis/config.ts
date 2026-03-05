import dayjs from 'dayjs';
import { getDateRangeDim } from './utils';
import { getOrganization } from '/@/api/dashbord/operate';

import { EFormItemType, ETimeDimension, TFormItemOption } from './components/BaseSearchForm/types';
import { getSyOrganization } from '/@/api/dataAnalysis/financial';
import { getFyOrganization } from '/@/api/dataAnalysis/operation';

// 通用周选择器表单选项
export const commonSignDateFormOptions: TFormItemOption = {
  type: EFormItemType.DATE_PICKER,
  default: '',
  // default: dayjs().subtract(1, 'week'),
  key: 'week',
  label: '产值周',
  pickerKey: 'range',
  attrs: {
    allowClear: false,
  },
  getParam: value => {
    const week = value ? `${value.endOf('week').year()}WK${value.endOf('week').week().toString().padStart(2, '0')}` : '';
    return { week };
  },
};

// 通用日期范围选择器表单选项
export const commonDateRangeFormOptions: TFormItemOption = {
  type: EFormItemType.RANGE_PICKER,
  default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
  key: 'dateRange',
  pickerKey: 'dimension',
  getParam: (value, searchFormValue) => {
    const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
    return { startDim, endDim };
  },
};

// 通用费用组织代码表单选项
export const commonFyOrgCodeFormOptions: TFormItemOption = {
  type: EFormItemType.TREE_SELECT,
  default: '',
  isOverrideDefault: true,
  key: 'orgCode',
  options: [],
  getOptions: async (params = {}) => {
    const { data } = await getFyOrganization(params);
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
};

// 通用损益组织代码表单选项
export const commonSyOrgCodeFormOptions: TFormItemOption = {
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
};

// 通用组织代码表单选项
export const commonOrgCodeFormOptions: TFormItemOption = {
  type: EFormItemType.TREE_SELECT,
  default: '',
  isOverrideDefault: true,
  key: 'orgCode',
  options: [],
  getOptions: async (params = {}) => {
    const { data } = await getOrganization(params);
    const list = data.list ?? data;
    const handleList = list.map(item => {
      return {
        id: item.id,
        parentId: item.parent_Id,
        value: item.org_Code,
        text: item.org_Name,
      };
    });
    return handleList;
  },
};
// 通用组织代码表单选项(keyword=1)
export const commonOrgCode1FormOptions: TFormItemOption = {
  type: EFormItemType.TREE_SELECT,
  default: '',
  isOverrideDefault: true,
  key: 'orgCode',
  options: [],
  getOptions: async (params = {}) => {
    const { data } = await getOrganization({
      ...params,
      keyword: 1,
    });
    const list = data.list ?? data;
    const handleList = list.map(item => {
      return {
        id: item.id,
        parentId: item.parent_Id,
        value: item.org_Code,
        text: item.org_Name,
      };
    });
    return handleList;
  },
};

// 天周月维度选项
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const commonDayWeekMonthFormOptions: TFormItemOption = {
  type: EFormItemType.SELECT,
  default: 'day',
  key: 'dimension',
  options: timeDimensionOptions,
};

// 通用日期范围选择器表单选项 ：无需切换 周 月，固定天
export const commonDayFormOptions: TFormItemOption = {
  type: EFormItemType.RANGE_PICKER,
  default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
  key: 'dateRange',
  attrs: {
    picker: ETimeDimension.DAY,
  },
  getParam: value => {
    const { startDim, endDim } = getDateRangeDim(ETimeDimension.DAY, value);
    return { startDim, endDim };
  },
};
