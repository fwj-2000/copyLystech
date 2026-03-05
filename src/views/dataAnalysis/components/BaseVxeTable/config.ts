import XEUtils from 'xe-utils';
import { BaseVxeTableTypes, EFilterSlot } from './types';
import dayjs from 'dayjs';

// 格式化显示
export const getFormatter = ({
  decimal = 0,
  isRate = false,
  isH = false,
  isShowZero = false,
}: {
  decimal?: number; // 小数点
  isRate?: boolean; // 是否带百分比
  isH?: boolean; // 是否是百分比小数值
  isShowZero?: boolean; // 是否在单元格显示0值
} = {}) => {
  return ({ cellValue: value }) => {
    if (!value) {
      return isShowZero ? value : '';
    }
    if (value === '***') {
      return value;
    }
    if (isRate) {
      const percentageValue = Number.parseFloat(value);
      return `${(isH ? percentageValue * 100 : percentageValue).toFixed(decimal)}%`;
    }
    return XEUtils.commafy(value * 1, { digits: decimal });
  };
};
// 单元格样式设置
export const getClassName = ({
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

export const commonMiniColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 60,
};
export const commonColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 80,
};
export const commonMediumColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 100,
};
export const commonLargeColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 120,
};
export const commonBiggerColumnOptions: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  width: 150,
};
const textOption: Partial<BaseVxeTableTypes.Column> = {
  align: 'left',
  filters: [{ data: [] }],
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT,
  },
};
export const textOptionEasy: Partial<BaseVxeTableTypes.Column> = {
  align: 'left',
  headerAlign: 'center',
  width: 100,
};
// 序号字段
export const commonSeqOption: Partial<BaseVxeTableTypes.Column> = {
  title: '序号',
  width: 40,
  type: 'seq',
  fixed: 'left',
  headerAlign: 'center',
};
export const commonMiniTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMiniColumnOptions,
  ...textOption,
};
export const commonTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonColumnOptions,
  ...textOption,
};
export const commonMediumTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  ...textOption,
};
export const commonLargeTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonLargeColumnOptions,
  ...textOption,
};
export const commonBiggerTextOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonBiggerColumnOptions,
  ...textOption,
};
export const commonMiniValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMiniColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
};
export const commonValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
};
export const commonMediumValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
};
export const commonLargeValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonLargeColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
};
// 日期格式
export const commonDateOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumTextOption,
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT_DATE,
  },
  formatter: ({ cellValue: value }) => {
    return value ? dayjs(value).format('YYYY-MM-DD') : '';
  },
};
// 日期格式 精确到到分钟
export const commonDateTimeOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonLargeTextOption,
  // cellRender: { name: 'Date' },
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT_DATE,
  },
  formatter: ({ cellValue: value }) => {
    return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '';
  },
};
// 日期格式 精确到到秒
export const commonDateTimeSecondOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumTextOption,
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT_DATE,
  },
  formatter: ({ cellValue: value }) => {
    return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '';
  },
};

// 数值千分位
export const commonMediumFormatValueOption: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
  formatter: getFormatter(),
};
export const commonMediumFormatValueOptionShowZero: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
  formatter: getFormatter({ isShowZero: true }),
};
export const commonMediumFormatValueOptionDecimal_2: Partial<BaseVxeTableTypes.Column> = {
  ...commonMediumColumnOptions,
  align: 'right',
  sortable: true,
  sortType: 'number',
  formatter: getFormatter({ decimal: 2 }),
};
