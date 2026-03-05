import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonColumnOptions, commonMiniColumnOptions, commonMediumValueOption, commonValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, getDateRangeDim } from '/@/views/dataAnalysis/utils';
import dayjs from 'dayjs';

import XEUtils from 'xe-utils';
import { isString } from '/@/utils/is';

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,

  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, 'quarter'), dayjs().subtract(1, 'quarter')],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.QUARTER,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.QUARTER, value);
      return { startDim, endDim };
    },
  },

  {
    type: EFormItemType.INPUT,
    label: '产品线',
    key: 'productLine',
  },
  {
    type: EFormItemType.INPUT,
    label: '项目',
    key: 'project',
  },
  {
    type: EFormItemType.INPUT,
    label: '品名',
    key: 'itemNumber',
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonColumnOptions,
      width: 70,
      field: 'productLine',
      title: '产品线',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: () => {
          return '/dashboard/operate/custschedul/quarAchieveDetail';
        },
        getPathParams: ({ row, searchFormValue }) => {
          const query = {
            orgCode: row.orgCode ?? searchFormValue.orgCode,
            dateRange: searchFormValue.dateRange,
            productLine: row.productLine,
          };
          return query;
        },
      },
    },
    {
      ...commonMiniColumnOptions,
      field: 'totalQuantity',
      title: '总料件数',
    },

    {
      field: 'list',
    },
  ];
  return columns;
};
// 表格字段配置
const formatValue = ({ cellValue, row, column }, iscommafy = true) => {
  if (!cellValue) {
    return '';
  }
  const { title } = column;
  const rateMetric = ['标准份额', '实际份额', '需求数量达成'];
  if (isString(cellValue)) {
    return cellValue;
  }
  if (rateMetric.includes(title)) {
    return `${XEUtils.round(cellValue * 100, 0)}%`;
  }
  return iscommafy ? XEUtils.commafy(cellValue, { digits: 0 }) : XEUtils.round(cellValue, 0);
};

export const customFieldOptions = {
  list: {
    getColumns: ({ data }: { data: any[] }): BaseVxeTableTypes.Columns => {
      const columns: BaseVxeTableTypes.Columns = []; // 明确声明类型
      let fieldIndex = 0; // 跟踪一级field的编号（list0, list1...）

      data.forEach(item => {
        // 处理share部分
        item.share.forEach((shareItem: { keys: string }) => {
          columns.push({
            ...commonMediumValueOption,
            field: `list${fieldIndex}`,
            title: shareItem.keys,
            formatter: ({ row, column, cellValue }) => formatValue({ cellValue, row, column }),
            exportMethod: ({ row, column }) => formatValue({ cellValue: row[column.field], row, column }, false),
          });
          fieldIndex++;
        });

        // 处理metricList部分
        item.metricList.forEach((metric: { dimKey: string; list: any[] }) => {
          const parentFieldIndex = fieldIndex; // 记录当前父级field索引
          const metricColumn: BaseVxeTableTypes.Column = {
            field: `list${parentFieldIndex}`,
            title: metric.dimKey,
            headerAlign: 'center',
            children: [],
          };

          // 处理metricList的list部分（数量维度(K)）
          metric.list.forEach((listItem: { key: string; values: any[] }, listIdx: number) => {
            const listColumn: BaseVxeTableTypes.Column = {
              field: `list${parentFieldIndex}_${listIdx}`,
              title: listItem.key,
              headerAlign: 'center',
              children: [],
            };

            // 处理values部分（MPS功能用量等）
            listItem.values.forEach((value: { keys: string }, valueIdx: number) => {
              listColumn.children?.push({
                ...commonValueOption,
                width: 100,
                field: `list${parentFieldIndex}_${listIdx}_${valueIdx}`,
                title: value.keys,
                formatter: ({ row, column, cellValue }) => formatValue({ cellValue, row, column }),
                exportMethod: ({ row, column }) => formatValue({ cellValue: row[column.field], row, column }, false),
              });
            });

            metricColumn.children?.push(listColumn);
          });

          columns.push(metricColumn); // 确保类型匹配
          fieldIndex++;
        });
      });
      console.log(columns, 'columns');
      return columns;
    },
    formatData: (values: any[]) => {
      // console.log(values, 'values');
      const result = {};
      let globalIdx = 0; // 全局计数器：统一管理所有键名的索引（list0、list1、list2...）

      values.forEach(item => {
        // 1. 处理 share 部分（Q1标准份额、Q1实际份额、Q2标准份额、Q2实际份额）
        if (item.share && item.share.length > 0) {
          item.share.forEach((shareItem: any[]) => {
            result[`list${globalIdx}`] = shareItem.values; // 按顺序分配键名
            globalIdx++; // 每处理一个 share 项，索引+1
          });
        }

        // 2. 处理 metricList 部分（嵌套的 values 项）
        if (item.metricList && item.metricList.length > 0) {
          item.metricList.forEach((metric: { list: any[] }) => {
            if (metric.list && metric.list.length > 0) {
              metric.list.forEach((listItem: { values: any[] }, lIdx: any) => {
                // lIdx：metric.list 的索引（当前结构中固定为 0）
                if (listItem.values && listItem.values.length > 0) {
                  listItem.values.forEach((valueItem: any[], vIdx: any) => {
                    // 键名格式：list[全局索引]_[lIdx]_[vIdx]
                    const key = `list${globalIdx}_${lIdx}_${vIdx}`;
                    result[key] = valueItem.values;
                  });
                  // 处理完当前 metric 的 values 后，全局索引+1（因为一个 metric 对应一个“前缀索引”）
                  globalIdx++;
                }
              });
            }
          });
        }
      });

      // console.log(result, 'formatted data');
      return result;
    },
  },
};
