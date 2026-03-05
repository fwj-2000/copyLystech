import dayjs, { Dayjs } from 'dayjs';
import { commonColumnOptions, getWeekColumns } from '../report/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { getSyOrganization } from '/@/api/dataAnalysis/financial';
import { commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { EFormItemType, EOrgLevel, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export let endWeekStr: string = '';

// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    attrs: {
      disabledDate: (current: Dayjs) => {
        return current && current < dayjs('2024-01-01').tz();
      },
    },
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
    // getParam: value => {
    //   const orgCode = value === 'MQ' ? '' : value;
    //   return { orgCode };
    // },
  },
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
      disabled: true,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: { allowClear: false },
    getParam: (value, searchFormValue) => {
      const { dimension } = searchFormValue;
      const { startDim, endDim } = getDateRangeDim(dimension, value);
      return { startDim, endDim };
    },
  },
];

// 表格表头配置
export const getAllColumns = ({
  dimension = ETimeDimension.WEEK,
  dateRange = [dayjs(), dayjs().subtract(1, 'week')],
}: {
  dimension?: ETimeDimension;
  dateRange?: [Dayjs, Dayjs];
} = {}): BaseVxeTableTypes.Columns => {
  const [, endDate] = dateRange;
  endWeekStr = `WK${endDate.week()}`;
  const weekolumns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      title: '厂区',
      field: 'factory',
      fixed: 'left',
    },
    // commonColumnOptions.metric,
    {
      ...commonMediumTextOption,
      title: '指标',
      field: 'metric',
      fixed: 'left',
    },
    ...getWeekColumns({ dimension, dateRange }),
    { field: 'weekList' },
  ];
  const monthColumns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      title: '厂区',
      field: 'factory',
      fixed: 'left',
    },
    // commonColumnOptions.metric,
    {
      ...commonMediumTextOption,
      title: '指标',
      field: 'metric',
      fixed: 'left',
    },
    { field: 'monthList' },
  ];
  console.log('🚀 ~ getAllColumns ~ dimension:', dimension);
  return dimension === ETimeDimension.WEEK ? weekolumns : monthColumns;
};
