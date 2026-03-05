import { cloneDeep, isEmpty, omit } from 'lodash-es';
import { EColumnsType, EConditionValue, EFilterSlotType, ECellSlotType, IFormatValueParmas, IGetCellStyleParams } from './types';
import { thousandsFormat } from '/@/utils/lydc';

// 格式化数值
const formatValueMth = ({ val, decimal = 2, isH = false, isRate = false }: IFormatValueParmas): string => {
  if (!val) return '';
  const value = (val || '0').toString();
  if (value === '***') {
    return value;
  }
  if (isRate) {
    const percentageValue = Number.parseFloat(value);
    return `${(isH ? percentageValue * 100 : percentageValue).toFixed(decimal)}%`;
  }
  return thousandsFormat(Number.parseFloat(value).toFixed(decimal));
};

// 获取单元格样式
const getCellStyleMth = ({ val, isAbs = false, rollback = false, minValue = 0 }: IGetCellStyleParams) => {
  const percentageValue = Number.parseFloat(val || '0');
  const minV = isAbs ? Math.abs(minValue) : minValue;
  const condition = rollback ? percentageValue > minV : percentageValue < minV; // 反转标红条件
  return {
    ...(condition ? { color: 'red' } : {}),
  };
};

// 格式化单个表头配置
const getColumn = columnOption => {
  const { slots = {}, config = {} } = columnOption;
  const { style: styleConfig = {}, format: formatConfig = {}, dialogCompo = null, dialogAttrs = {} } = config;
  const { default: defaultSlot = '', filter: filterSlot = '' } = slots;
  // 去掉多余的字段
  const baseOption = omit(columnOption, ['config', 'customColumnType']);
  return {
    ...baseOption,
    // 挂载自定义弹窗组件
    ...(defaultSlot === ECellSlotType.DIALOG
      ? {
          dialogCompo,
          dialogAttrs,
        }
      : {}),
    // 挂载格式化数值方法
    ...(defaultSlot === ECellSlotType.FORMAT_VALUE
      ? {
          formatValue: (val: string | number) => formatValueMth({ val, ...formatConfig }),
          getCellStyle: (val: string | number) => getCellStyleMth({ val, ...styleConfig }),
        }
      : {}),
    // 挂载筛选方法
    ...(filterSlot === EFilterSlotType.FILTER_VALUE
      ? {
          filters: [{ value: '', condition: EConditionValue.GREATER_THAN }],
          filterMethod: ({ option, row, column }) => {
            const { condition = '', value = 0 } = option || {};
            if (condition === EConditionValue.GREATER_THAN) {
              return Number.parseFloat(row[column.field]) > value;
            } else if (condition === EConditionValue.LESS_THAN) {
              return Number.parseFloat(row[column.field]) < value;
            }
            return row[column.field] === value;
          },
          filterResetMethod: ({ options }) => {
            options[0].condition = '';
            options[0].value = 0;
          },
        }
      : {}),
    // 挂载多选搜索下拉筛选方法
    ...(filterSlot === EFilterSlotType.MULTI_SEARCH_FILTER
      ? {
          filters: [{ values: '' }],
          filterMethod: ({ option, row, column }) => {
            const { values = [] } = option || {};
            return values.includes(row[column.field]);
          },
          filterResetMethod: ({ options }) => {
            options[0].values = [];
          },
        }
      : {}),
  };
};

// 根据dataIndex列表获取表头配置
export const getColumnsOptions = ({ dataSource = [], showColumns = [], allColumnsOptions = {} }: any) => {
  if (isEmpty(dataSource) || isEmpty(showColumns) || isEmpty(allColumnsOptions)) {
    return [];
  }
  return showColumns
    .map(col => {
      const { field } = col;
      return {
        ...allColumnsOptions[field],
        ...col,
      };
    })
    .reduce((pre, cur) => {
      const { field, customColumnType } = cur;
      const column = getColumn(cur);
      if (customColumnType === EColumnsType.DATE_VALUE_LIST) {
        // 特殊字段处理，每天的数据项
        const dataList = cloneDeep(dataSource).sort((a, b) => b[field].length - a[field].length)[0][field] || [];
        return [
          ...pre,
          {
            title: '周结',
            align: 'center',
            field: 'weekly',
            children: dataList.map(item => ({
              ...column,
              title: item.keys,
              field: item.keys,
            })),
          },
        ];
      } else if (customColumnType === EColumnsType.DIMENTION_LIST) {
        // 动态生成的维度列表
        const dataList = dataSource[0][field] || [];
        return [
          ...pre,
          ...dataList.map(item => ({
            ...column,
            title: item.keys,
            field: item.keys,
          })),
        ];
      }
      return [
        ...pre,
        {
          ...column,
          field,
        },
      ];
    }, []) as any[];
};
