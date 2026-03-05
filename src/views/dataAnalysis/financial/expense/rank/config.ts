import XEUtils from 'xe-utils';
import dayjs from 'dayjs';
import { commonLargeValueOption, commonMediumTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getAllOrganization } from '/@/api/dataAnalysis/fare';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';

import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

// 表单配置
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getAllOrganization(params);
      const list = data.list ?? data;
      const handleList = list.map(item => {
        return {
          id: item.ID,
          parentId: item.Parent_Id,
          value: item.Org_Code,
          text: item.Org_Name,
        };
      });
      return handleList;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: '4',
    key: 'orgLevel',
    isHide: false,
    attrs: {
      allowClear: false,
    },
    options: [
      { text: 'BU', value: '3' },
      { text: 'SBU', value: '4' },
    ],
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
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(7, 'day'),
    key: 'date',
    pickerKey: 'dimension',
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, [value, value]);
      return { startDim, endDim };
    },
  },
];

// 导出表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'factory',
      title: '厂区',
    },
    {
      ...commonMediumValueOption,
      field: 'proportion',
      title: '费用占比',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
    },
    {
      ...commonLargeValueOption,
      field: 'amount',
      title: '费用',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}`;
      },
    },
    {
      ...commonMediumValueOption,
      field: 'changes',
      title: '变动制费',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
    },
    {
      ...commonMediumValueOption,
      field: 'locks',
      title: '固定制费',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
    },
    {
      ...commonMediumValueOption,
      field: 'sales',
      title: '销售费用',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
    },
    {
      ...commonMediumValueOption,
      field: 'research',
      title: '研发费用',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
    },
    {
      ...commonMediumValueOption,
      field: 'manages',
      title: '管理费用',
      formatter({ cellValue }) {
        return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
      },
    },
  ];
  return columns;
};
