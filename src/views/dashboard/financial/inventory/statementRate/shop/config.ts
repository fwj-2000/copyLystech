import dayjs from 'dayjs';
import { getOrganization } from '/@/api/dashbord/operate';
import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
import { ETimeDimension } from '/@/views/dashboard/types';
import { getDateRangeDim } from '/@/views/dashboard/utils';
import { commonTextOption } from '/@/views/dashboard/commonComponents/BaseVxeTable/config';

// 表单配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '年', value: ETimeDimension.YEAR },
];
export const formOptions: TFormItemOption[] = [
  {
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
          id: getFieldValue(item, 'id'),
          parentId: getFieldValue(item, 'parent_Id'),
          value: getFieldValue(item, 'org_Code'),
          text: getFieldValue(item, 'org_Name'),
        };
      });
      return handleList;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.DAY,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      title: '工厂',
      field: 'Factory',
      width: 100,
      mergeConfig: {
        needGroups: true,
        needMergeRow: true,
        mergeRowField: 'WorkShop',
      },
    },
    {
      ...commonTextOption,
      title: '车间',
      field: 'WorkShop',
      width: 100,
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      title: 'MRP控制',
      field: 'MRP',
      width: 100,
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      title: '类型',
      field: 'Title',
      width: 100,
    },
    {
      field: 'List',
      width: 100,
      columnType: EColumnType.KEYS_VALUES,
      sortable: true,
      sortType: 'number',
    },
  ];
  return columns;
};
