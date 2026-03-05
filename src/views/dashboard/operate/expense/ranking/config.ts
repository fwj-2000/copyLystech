import XEUtils from 'xe-utils';
import { EFilterSlotType, IColumnOption } from '/@/views/dashboard/operate/components/BaseVxeTable/types';
import { VxeGridPropTypes } from 'vxe-table';

export const allColumnsOptions: { [key: string]: IColumnOption } = {
  amount: {
    title: '费用',
    width: 120,
    isMergeRows: true,
    isMergeCols: true,
    align: 'right',
    sortable: true,
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}万`;
    },
  },
  proportion: {
    title: '费用占比',
    width: 80,
    align: 'center',
    sortable: true,
    filterMultiple: true,
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
    },
  },
  factory: {
    title: '厂区',
    width: 120,
    align: 'center',
    filterMultiple: true,
  },
  changes: {
    title: '变动制费',
    width: 80,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
    },
  },
  locks: {
    title: '固定制费',
    width: 80,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
    },
  },
  sales: {
    title: '销售费用',
    width: 80,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
    },
  },
  research: {
    title: '研发费用',
    width: 80,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
    },
  },
  manages: {
    title: '管理费用',
    width: 80,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    sortType: 'number',
    formatter({ cellValue }) {
      return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
    },
  },
};

// 周维度字段
export const columns: VxeGridPropTypes.Columns = [
  { field: 'factory' },
  { field: 'proportion' },
  { field: 'amount' },
  { field: 'changes' },
  { field: 'locks' },
  { field: 'sales' },
  { field: 'research' },
  { field: 'manages' },
];
