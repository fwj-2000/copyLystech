// import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
import { getfeeAttrDimension } from '/@/api/dataAnalysis/fare';
import { commonMediumTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonDateRangeFormOptions, commonFyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { ETimeDimension } from './types';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { message } from 'ant-design-vue';
import { getCustomDefaultRange } from '/@/views/dataAnalysis/utils';

const commonColumnCellOption: BaseVxeTableTypes.Column = {
  ...commonMediumValueOption,
  formatter: ({ cellValue, column }) => {
    if (cellValue === 0) {
      return '';
    }
    const { field } = column;
    if (field.includes('占比')) {
      return `${XEUtils.toFixed(cellValue * 100, 2)}% `;
    }
    return XEUtils.commafy(cellValue);
  },
};

const columns: BaseVxeTableTypes.Columns = [
  {
    ...commonMediumTextOption,
    field: 'DimesionType',
    headerAlign: 'center',
    columnType: EColumnType.KEYS_VALUES,
    filters: [{ data: [] }],
    fixed: 'left',
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
      default: ESlotDefault.LINK_DEFAULT,
    },
    params: {
      getPathUrl: () => {
        return '/dataAnalysis/financial/expense/detail';
      },
      getPathParams: ({ row, column, columnIndex, searchFormValue }) => {
        const value = row[column.field];
        const { dimensionType } = searchFormValue;
        const dimensionKey = dimensionType[columnIndex];
        const query = {
          ...searchFormValue,
          [dimensionKey]: value,
          title: value,
        };
        return query;
      },
    },
  },
  {
    field: 'ThisYearList',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-purple',
    },
  },
  {
    field: 'Env',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-purple',
    },
  },
  {
    field: 'YearTotal',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-grey',
    },
  },
  {
    field: 'Same',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-grey',
    },
  },
  {
    field: 'LastYearList',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
  },
];
// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return columns;
};

// 通用搜索组件配置
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const formOptions: TFormItemOption[] = [
  commonFyOrgCodeFormOptions,
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
    ...commonDateRangeFormOptions,
    default: getCustomDefaultRange(),
  },
  {
    label: '维度',
    type: EFormItemType.SELECT,
    default: [],
    isOverrideDefault: true,
    key: 'dimensionType',
    attrs: {
      mode: 'multiple',
      allowClear: false,
      onChange: (value: string[]) => {
        if (value.length === 0) message.warning('查询必须至少带一个维度！');
      },
    },
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getfeeAttrDimension(params);
      // 将结果处理成下拉菜单的属性
      const handleList = Object.keys(data).map(key => {
        return {
          text: data[key],
          value: key,
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
    getParam: value => {
      return { dimensionType: value.join(';') };
    },
    setDefault(options) {
      if (options.some(item => item.value === 'dygbsywd')) {
        return ['dygbsywd'];
      }
      return [];
    },
  },
];
export const dimensionTypeKeyMap = {
  factory: '厂区',
  ywfwms: '业务范围描述',
  department: '部门',
  dygbsywd: '对应管报损益维度',
  fysx: '费用属性',
  fyxz: '费用性质',
  sjfl: '数据分类',
  kmms: '科目描述',
  mjkm: '末级科目',
  yskm: '预算科目',
  fylb: '费用类别',
  ejkm: '二级科目',
};
