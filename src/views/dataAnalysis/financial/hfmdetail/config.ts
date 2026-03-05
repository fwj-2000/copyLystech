import {
  commonSeqOption,
  commonTextOption,
  commonValueOption,
  commonMediumValueOption,
  getFormatter,
  commonMiniTextOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption, EOrgLevel } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import xeUtils from 'xe-utils';
import dayjs from 'dayjs';

import { getSyOrganization } from '/@/api/dataAnalysis/financial';
export const formOptions: TFormItemOption[] = [
  // commonSyOrgCodeFormOptions,
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
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateRange',
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, value);
      return { startDim, endDim };
    },
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMiniTextOption,
      field: 'factory',
      title: '厂区',
      fixed: 'left',
    },
    commonSeqOption,
    {
      ...commonTextOption,
      field: 'project',
      title: '项目',
    },
    {
      ...commonMediumValueOption,
      field: 'values',
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue, row }) => {
        if (!cellValue) {
          return '';
        }
        if (row.project.includes('率')) {
          return `${xeUtils.toFixed(cellValue * 100, 1)}%`;
        }
        return xeUtils.commafy(cellValue, { digits: 0 });
      },
    },
    {
      ...commonValueOption,
      field: 'env',
      title: '环比',
      formatter: ({ cellValue, row }) => {
        if (!cellValue) {
          return '';
        }
        if (row.project.includes('率')) {
          return `${xeUtils.toFixed(cellValue * 100, 1)}%`;
        }
        return xeUtils.commafy(cellValue, { digits: 0 });
      },
    },
    {
      ...commonTextOption,
      field: 'isbl',
      title: '是否需要补录',
    },
  ];
  return columns;
};
