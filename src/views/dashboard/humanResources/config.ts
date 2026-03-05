import dayjs from 'dayjs';
import { getOrganization } from '/@/api/dashbord/operate';
import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import { cloneDeep, merge } from 'lodash-es';

import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { VxeGridPropTypes } from 'vxe-table';
import { EFilterSlot } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

type TFormItemOptions = TFormItemOption[];

export const commonOptions: TFormItemOptions = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getOrganization(params);
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        // const idValue = item.id || item.ID;
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
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateDim',
    attrs: {
      picker: 'week',
    },
  },
];

// 通用字段配置
export const allColumns = {
  seq: {
    width: 60,
    type: 'seq',
    headerAlign: 'center',
  },
  Factory: {
    title: '厂区',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
    width: 100,
  },
  DeptNameLevel51: {
    title: '厂区',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
    width: 100,
  },
  DeptNameLevel5: {
    title: '部门',
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
    width: 100,
  },
  Nationality: {
    title: '中方/越方',
    width: 100,
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
  },
  MarkType: {
    title: '直间接分类',
    width: 100,
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
  },
  PostName: {
    title: '岗位类型',
    width: 100,
    filters: [{ data: [] }],
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
  },
};

// 获取表头配置
type TGetColumnsParams = Omit<VxeGridPropTypes.Column, 'field'> & { field: string }[];
export const getColumns = (columns: TGetColumnsParams) => {
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field]), item);
  });
};
