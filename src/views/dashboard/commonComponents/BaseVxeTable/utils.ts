import { flattenDeep, keyBy, isFunction, omit, orderBy } from 'lodash-es';
import { BaseVxeTableTypes, EColumnType, IColumn } from './types';
import type { VxeColumnPropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';
// 合并单元格
export const getMergeRow = ({ columns, data }) => {
  const spans: any = [];
  let mergeCols = 0;
  columns.forEach((column, index) => {
    const { needMergeRow = false, maxMergeColCount = 10 } = column.mergeConfig ?? {};
    if (needMergeRow && mergeCols < maxMergeColCount) {
      spans.push(...getSingleColMergeRow({ column, data, columnIdx: index }));
      mergeCols += 1;
    }
  });
  return spans.sort((a, b) => a.row - b.row);
};

// 获取单列合并行数据
function getSingleColMergeRow({ column, data, columnIdx }) {
  const spans: any = [];
  let currentIdx = 0;
  let startIdx = 0;
  const { field } = column;
  const { mergeRowField } = column.mergeConfig ?? {};
  while (currentIdx < data.length) {
    const nextIdx = currentIdx + 1;
    const mergeField = mergeRowField ?? field;
    if (nextIdx === data.length || data[currentIdx][mergeField] !== data[nextIdx][mergeField]) {
      if (currentIdx - startIdx >= 1) {
        spans.push({
          row: startIdx,
          rowspan: nextIdx - startIdx,
          col: columnIdx,
          colspan: 1,
        });
      }
      startIdx = currentIdx + 1;
    }
    currentIdx++;
  }
  return spans;
}

// 格式化表格数据
export function formatDataList({ columns, data, customFieldOptions = {} }) {
  const omitKeys: string[] = [];
  const sortFieldsSet: Set<string> = new Set([]); // 需要排序的字段（有些合并项需要先保证聚合在一起，这里做排序处理
  const res = data.map(item => {
    const columnData = columns.reduce((pre, cur) => {
      const { field, columnType, mergeConfig = {} } = cur ?? {};
      const { needGroups } = mergeConfig;
      const { formatData } = customFieldOptions[field ?? ''] ?? {};
      if (needGroups) {
        sortFieldsSet.add(field);
      }
      if (columnType === EColumnType.DATA_LIST) {
        omitKeys.push(field);
        return {
          ...pre,
          ...(item[field] ?? []).reduce((pre, cur) => {
            return {
              ...pre,
              [cur.dateS]: cur.valueS,
            };
          }, {}),
        };
      } else if (columnType === EColumnType.KEYS_VALUES) {
        omitKeys.push(field);
        return {
          ...pre,
          ...(item[field] ?? []).reduce((pre, cur, idx) => {
            const key = `${field}_${idx}_${cur.keys}`;
            if (needGroups) {
              sortFieldsSet.add(key);
            }
            return {
              ...pre,
              [key]: cur.values,
            };
          }, {}),
        };
      } else if (columnType === EColumnType.WEEK_KEYS_VALUES) {
        omitKeys.push(field);
        return {
          ...pre,
          ...getFormatWeekKeysValuesInfo(item[field]),
        };
      } else if (columnType === EColumnType.MONTH_KEY_KEYS_VALUES) {
        omitKeys.push(field);
        return {
          ...pre,
          ...getFormatMonthKeysValuesInfo(item[field]),
        };
      } else if (isFunction(formatData)) {
        return {
          ...pre,
          ...formatData(item[field]),
        };
      }
      return {
        ...pre,
        [field]: item[field],
      };
    }, {});
    return {
      ...omit(item, omitKeys),
      ...columnData,
    };
  });
  // 对数据进行聚合
  const sortedRes = orderBy(res, Array.from(sortFieldsSet));
  return sortedRes;
}

// 格式化 WEEK_KEYS_VALUES 类型的数据
function getFormatWeekKeysValuesInfo(values: any[]) {
  const info = values.reduce((pre, cur) => {
    return {
      ...pre,
      ...getSingleInfo(cur),
    };
  }, {});

  function getSingleInfo(info: Record<string, any>) {
    return info.Values.reduce((pre, cur) => {
      return {
        ...pre,
        [`${info.WeekKey}_${cur.keys}`]: cur.values,
      };
    }, {});
  }
  return info;
}

// 格式化 MONTH_KEY_KEYS_VALUES 类型的数据
function getFormatMonthKeysValuesInfo(values: any[]) {
  const info = values.reduce((pre, cur) => {
    return {
      ...pre,
      ...getSingleInfo(cur),
    };
  }, {});

  function getSingleInfo(info: Record<string, any>) {
    return info.vlist.reduce((pre, cur) => {
      return {
        ...pre,
        [`${info.monthKey}_${cur.keys}`]: cur.values,
      };
    }, {});
  }
  return info;
}

// 获取 WEEK_KEYS_VALUES 类型的表头配置
export function getFormatWeekKeysValuesColumns(firstValues: any[], columnOption: IColumn): BaseVxeTableTypes.Columns {
  if (!firstValues) {
    return [];
  }
  const { parentOption = {}, commonOption = {}, childOption = {} } = columnOption;
  const columns = firstValues.map(item => {
    return {
      field: item.WeekKey,
      title: item.WeekKey,
      headerAlign: 'center' as VxeColumnPropTypes.Align,
      ...commonOption,
      ...parentOption,
      children: item.Values.map(value => {
        return {
          ...commonOption,
          ...childOption,
          field: `${item.WeekKey}_${value.keys}`,
          title: value.keys,
        };
      }),
    };
  });
  return columns as any;
}

// 获取 MONTH_KEY_KEYS_VALUES 类型的表头配置
export function getFormatMonthKeysValuesColumns(firstValues: any[], columnOption: IColumn): BaseVxeTableTypes.Columns {
  if (!firstValues) {
    return [];
  }
  const { parentOption = {}, commonOption = {}, childOption = {} } = columnOption;
  const columns = firstValues.map(item => {
    return {
      field: item.monthKey,
      title: item.monthKey,
      headerAlign: 'center' as VxeColumnPropTypes.Align,
      ...commonOption,
      ...parentOption,
      children: item.vlist.map(value => {
        return {
          ...commonOption,
          ...childOption,
          field: `${item.monthKey}_${value.keys}`,
          title: value.keys,
        };
      }),
    };
  });
  return columns as any;
}

// 根据指定字段获取分组斑马类名
export function getRowClassNameFuncByGroupKey(groupKey: string): (params: any) => string {
  let lastValue = '';
  let lastCalss = '';
  const cacheInfo = {};
  return ({ row }) => {
    const value = row[groupKey];
    const { id } = row;
    if (cacheInfo[id]) {
      return cacheInfo[id];
    }
    if (lastValue !== value) {
      lastValue = value;
      lastCalss = lastCalss === 'bg-yellow' ? 'bg-blue' : 'bg-yellow';
    }
    cacheInfo[id] = lastCalss;
    return lastCalss;
  };
}

// 平铺多级表头
export function flattenColumns(columns: BaseVxeTableTypes.Columns): { [field: string]: BaseVxeTableTypes.Column } {
  const flatten = (column: BaseVxeTableTypes.Column): BaseVxeTableTypes.Columns => {
    if (column.children) {
      return [column, ...flattenDeep(column.children.map(flatten))];
    }
    return [column];
  };

  const flatColumns = flattenDeep(columns.map(flatten));
  return keyBy(flatColumns, 'field');
}

// 获取格式化数值显示
export const getFormatterValue = ({
  decimal = 0,
  isRate = false,
  isH = false,
}: {
  decimal?: number; // 小数点
  isRate?: boolean; // 是否带百分比
  isH?: boolean; // 是否是百分比小数值
} = {}) => {
  return ({ cellValue: value }) => {
    if (value === '***') {
      return value;
    }
    if (isRate) {
      const percentageValue = Number.parseFloat(value);
      return `${(isH ? percentageValue * 100 : percentageValue).toFixed(decimal)}%`;
    }
    return XEUtils.commafy(value, { digits: 0 });
  };
};

// 单元格数值样式设置
export const getValueCellClassName = ({
  minValue = 0,
  rollback = false,
  isAbs = false,
}: {
  minValue?: number; // 最小值
  rollback?: boolean; // 是否反转标红条件
  isAbs?: boolean; // 是否以绝对值标红
} = {}) => {
  return ({ row, column }) => {
    const value = row[column.field as string];
    const percentageValue = Number.parseFloat(value);
    const minV = isAbs ? Math.abs(minValue) : minValue;
    const condition = rollback ? percentageValue > minV : percentageValue < minV; // 反转标红条件
    return condition ? 'text-red' : '';
  };
};
