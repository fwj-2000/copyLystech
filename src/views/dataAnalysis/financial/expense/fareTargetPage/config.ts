// import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
import { getfeeAttrDimension } from '/@/api/dataAnalysis/fare';
import { commonMediumTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonDateRangeFormOptions, commonFyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, getCustomDefaultRange } from '/@/views/dataAnalysis/utils';
import { dimensionTypeKeyMap } from '/@/views/dataAnalysis/financial/expense/detail/config';
import { keys, values, zipObject, pickBy, startsWith, mapKeys } from 'lodash-es';
import { IJumpButtonOption } from '/@/views/dataAnalysis/components/TableLayout/types';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// 跳转按钮配置
export const jumpButtonOptions: IJumpButtonOption[] = [
  {
    title: t('routes.dataAnalysis-financial-expense-fareTargetDetail'), //	费用目标
    getPathUrl: () => {
      return '/dataAnalysis/financial/expense/fareTargetDetail';
    },
    getPathParams: (_, searchFormValue) => {
      const { dateRange, orgCode, dimension } = searchFormValue;
      const query = {
        dateRange,
        orgCode,
        dimension,
      };
      return query;
    },
  },
];
// 通用搜索组件配置

export const formOptions: TFormItemOption[] = [
  commonFyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: 'week',
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '周', value: ETimeDimension.WEEK },
      { text: '月', value: ETimeDimension.MONTH },
    ],
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
    },
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getfeeAttrDimension(params);
      const handleList = Object.keys(data).map(key => {
        return {
          text: data[key],
          value: key,
        };
      });
      return handleList;
    },
    getParam: value => {
      return { dimensionType: value.join(';') };
    },
    setDefault(options) {
      if (options.some(item => item.value === 'mjkm')) {
        return ['mjkm'];
      }
      return [];
    },
  },
];
const commonColumnCellOption: BaseVxeTableTypes.Column = {
  ...commonMediumValueOption,
  width: 75,
  commonOption: {
    headerClassName: 'bg-grey',
  },
  formatter: ({ cellValue, column }) => formatValue(cellValue, column.field),
  // exportMethod: ({ row, column }) => formatValue(row[column.field], column.field, false),
};
const commonColumnCellOption2: BaseVxeTableTypes.Column = {
  width: 75,
  commonOption: {
    headerClassName: 'bg-grey',
  },
};
const formatValue = (value: number, field: string, isxiaosh: boolean = true) => {
  if (!value) return '';
  if (field.includes('目标管控')) return value;
  if (field.includes('占比') || field.includes('%')) {
    return `${XEUtils.toFixed(value * 100, 2)}% `;
  }
  return isxiaosh ? XEUtils.commafy(value) : transThouIntEx(value, '', 4);
};

// 表格字段配置
export const getAllColumns = (isDimensionType: boolean): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'DimesionType',
      // headerAlign: 'center',
      columnType: EColumnType.KEYS_VALUES,
      filters: [{ data: [] }],
      // fixed: 'left',
      mergeConfig: {
        maxMergeColCount: 2,
        needMergeRow: true,
      },
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dataAnalysis/financial/expense/fareTargetPage';
        },
        getPathParams: ({ row, column, searchFormValue, columnIndex }) => {
          //   1. 提取并转换所有以"DimesionType_"为前缀的属性
          const fullDimesionTypeObj = mapKeys(
            pickBy(row, (_, key) => startsWith(key, 'DimesionType_')),
            (_, key) => {
              const newKey = key.replace('DimesionType_', '');
              return reversedDimTypeKeyMap[newKey];
            },
          );

          // 2. 根据columnIndex过滤，只保留对应索引及之前的维度
          const { dimensionType } = searchFormValue || {};
          const filteredDimesionTypeObj = {};

          if (dimensionType && Array.isArray(dimensionType)) {
            // 获取需要保留的维度键数组（从开始到columnIndex）
            const keysToKeep = dimensionType.slice(0, columnIndex + 1);

            // 只保留这些键对应的键值对
            keysToKeep.forEach(key => {
              if (fullDimesionTypeObj.hasOwnProperty(key)) {
                filteredDimesionTypeObj[key] = fullDimesionTypeObj[key];
              }
            });
          }

          // console.log(
          //   '🚀 ~ getAllColumns ~  row, column, searchFormValue, columnIndex:',
          //   row,
          //   column,
          //   searchFormValue,
          //   columnIndex,
          //   fullDimesionTypeObj,
          //   filteredDimesionTypeObj,
          // );
          const value = row[column.field];
          // const dimensionKey = dimensionType[columnIndex];
          const query = {
            ...searchFormValue,
            ...filteredDimesionTypeObj,
            // [dimensionKey]: value,
            title: value,
          };
          return query;
        },
      },
    },

    {
      field: 'ThisYearList',
      columnType: EColumnType.Dim_KEYS_VALUES,
      // childOption: commonColumnCellOption,
      getChildConfig: value => {
        const isflag = value.keys !== '分析' && value.keys !== '对策';
        return {
          ...(isflag ? commonColumnCellOption : commonColumnCellOption2),
          editRender: isflag
            ? { enabled: false }
            : {
                enabled: isDimensionType,
                name: 'Textarea',
                props: {
                  autoSize: true,
                },
              },
          align: isflag ? 'right' : 'left',
          showOverflow: isflag,
          visible: isflag,
        };
      },
    },
    {
      field: 'Env',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: commonColumnCellOption,
    },
    {
      field: 'YearTotal',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: commonColumnCellOption,
    },
    {
      field: 'Same',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: commonColumnCellOption,
    },
    {
      field: 'LastYearList',
      columnType: EColumnType.Dim_KEYS_VALUES,
      // childOption: commonColumnCellOption,
      getChildConfig: value => {
        const isflag = value.keys !== '分析' && value.keys !== '对策';
        return {
          ...(isflag ? commonColumnCellOption : commonColumnCellOption2),
          editRender: isflag
            ? { enabled: false }
            : {
                enabled: isDimensionType,
                name: 'Textarea',
                props: {
                  autoSize: true,
                },
              },
          align: isflag ? 'right' : 'left',
          showOverflow: isflag,
          visible: isflag,
        };
      },
    },
    {
      field: 'Analysis',
      columnType: EColumnType.Dim_KEYS_VALUES,
      childOption: {
        ...commonColumnCellOption,
        className: ({ row, column }) => {
          const { field, title } = column;
          const percentageValue = row[field];
          if (['占比(%)'].includes(title as string)) return percentageValue > 0 ? 'text-red' : '';
          return '';
        },
      },
    },
  ];
  return columns;
};

export const reversedDimTypeKeyMap = zipObject(values(dimensionTypeKeyMap), keys(dimensionTypeKeyMap));
