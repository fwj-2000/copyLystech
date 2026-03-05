import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonMiniColumnOptions,
  commonColumnOptions,
  commonMediumColumnOptions,
  commonValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

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
const commonValueOptionCopy: Partial<BaseVxeTableTypes.Column> = {
  ...commonValueOption,
  formatter: ({ cellValue, row, column }) => formatValue({ cellValue, row, column }),
  exportMethod: ({ row, column }) => formatValue({ cellValue: row[column.field], row, column }, false),
};
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonColumnOptions,
      field: 'productLine',
      title: '产品线',
    },
    {
      ...commonMiniColumnOptions,
      field: 'quarters',
      title: '季度',
    },
    {
      ...commonMediumColumnOptions,
      field: 'items',
      title: '项目',
    },
    {
      ...commonMediumColumnOptions,
      field: 'fProduct',
      width: 125,
      title: '品名',
    },

    {
      ...commonValueOptionCopy,
      field: 'proportion',
      title: '选用比例',
    },

    {
      ...commonValueOptionCopy,
      field: 'blackWifi',
      title: '黑WIFI',
    },
    {
      ...commonValueOptionCopy,
      field: 'blackWifiUsageAlloc',
      title: '黑WIFI用量分配',
    },
    {
      ...commonValueOptionCopy,
      field: 'whiteWifi',
      title: '白WIFI',
    },
    {
      ...commonValueOptionCopy,
      field: 'whiteWifiUsageAlloc',
      title: '白WIFI用量分配',
    },

    {
      ...commonValueOptionCopy,
      field: 'blackCell',
      title: '黑CELL',
    },
    {
      ...commonValueOptionCopy,
      field: 'blackCellUsageAlloc',
      title: '黑CELL用量分配',
    },

    {
      ...commonValueOptionCopy,
      field: 'whiteCell',
      title: '白CELL',
    },
    {
      ...commonValueOptionCopy,
      field: 'whiteCellUsageAlloc',
      title: '白CELL用量分配',
    },

    {
      ...commonValueOptionCopy,
      field: 'wifiUsageAlloc',
      title: 'WIFI分配',
    },
    {
      ...commonValueOptionCopy,
      field: 'cellUsageAlloc',
      title: 'CELL分配',
    },

    {
      ...commonValueOptionCopy,
      field: 'pcQty',
      title: '客户排产',
    },
    {
      ...commonValueOptionCopy,
      field: 'bzFe',
      title: '标准份额',
    },
    {
      ...commonValueOptionCopy,
      field: 'sjFe',
      title: '实际份额',
    },
    {
      ...commonValueOptionCopy,
      field: 'mpsQty',
      title: 'MPS功能用量(k)',
    },
    {
      ...commonValueOptionCopy,
      field: 'fcQty',
      title: '需求数量(k)',
    },
    {
      ...commonValueOptionCopy,
      field: 'sjlhQty',
      title: '实际拉货数(k)',
    },
    {
      ...commonValueOptionCopy,
      field: 'xqDc',
      title: '需求数量达成',
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
  const rateMetric = ['选用比例', '实际份额', '标准份额'];
  if (isString(cellValue)) {
    return cellValue;
  }
  if (rateMetric.includes(title)) {
    return `${XEUtils.round(cellValue * 100, 0)}%`;
  }
  return iscommafy ? XEUtils.commafy(cellValue, { digits: 0 }) : XEUtils.round(cellValue, 0);
};
