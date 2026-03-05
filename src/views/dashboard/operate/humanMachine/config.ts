import { commonDateRangeFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonLargeValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

// 通用搜索组件配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.DAY,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  commonDateRangeFormOptions,
];

const centerHeaderAlign: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 100,
  // className: 'bg-white',
};

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...centerHeaderAlign,
      field: 'module',
      title: '模块',
      className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      ...centerHeaderAlign,
      title: '指标',
      field: 'index1',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      ...centerHeaderAlign,
      field: 'index2',
      title: '指标',
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      ...commonLargeValueOption,
      ...centerHeaderAlign,
      field: 'list',
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue, row }) => {
        let metric = row.index2;
        return transThouIntEx(cellValue, metric, 1, true);
      },
      exportMethod: ({ row, column }) => {
        let metric = row.index2;
        return transThouIntEx(row[column.field], metric, 4, false);
      },
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ row }) => {
          const { module, index1, index2 } = row;
          switch (module) {
            case '产值':
              return '/dashboard/operate/humanMachine/detail/chanzhi';
            case '线体数':
              return '/dashboard/operate/humanMachine/detail/kaijilv';
            case '模切人力':
              return '/dashboard/operate/humanMachine/detail/chuqing';
            case '人机比':
              if (index2 == '模切工' || index2 == '前加工') {
                return '/dashboard/operate/humanMachine/detail/moqie';
              }
              if (index2 == '间接工') {
                return '/dashboard/operate/humanMachine/detail/jianjie';
              }
              if (index2 == '总人力') {
                return '';
              }
            case '过程指标':
              return '/dashboard/operate/humanMachine/detail/guochengzhibiao';
            default:
              return '';
          }
        },
        getPathParams: ({ row, column, searchFormValue }) => {
          // const { title } = column;
          const { module, index1, index2 } = row;
          const { title } = column;
          const { dimension, orgCode } = searchFormValue;
          const query = {
            orgCode: orgCode,
            dimension: dimension,
            startDim: title,
            endDim: title,
          };
          switch (module) {
            case '产值':
              return query;
            case '线体数':
              return query;
            case '模切人力':
              return {
                ...query,
                processType: index1,
              };
            case '人机比':
              if (index2 == '模切工' || index2 == '前加工') {
                return {
                  ...query,
                  processType: index2,
                };
              } else if (index2 == '间接工') {
                return query;
              }
            case '过程指标':
              if (index1 == '总体') {
                return {
                  ...query,
                  processType: '0',
                };
              } else {
                return {
                  ...query,
                  processType: '1',
                };
              }
            default:
              return query;
          }
        },
      },
      // formatter: ({ cellValue }) => {
      //   return transThouIntEx(cellValue, '', 0, true);
      // },
      // formatter: ({ cellValue, row }) => {
      //   let metric = row.index2;
      //   return transThouIntEx(cellValue, metric, 0, true);
      // },
      // exportMethod: ({ row, column }) => {
      //   let metric = row.index2;
      //   return transThouIntEx(row[column.field], metric, 4, false);
      // },
    },
  ];
  return columns;
};
