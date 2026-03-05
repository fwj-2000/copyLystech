import XEUtils from 'xe-utils';
import { IColumnOption } from '/@/views/dashboard/operate/components/BaseVxeTable/types';
import { VxeGridPropTypes } from 'vxe-table';

export const allColumnsOptions: { [key: string]: IColumnOption } = {
  amount: {
    title: '费用',
    width: 120,
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
  allocationType: {
    title: '费用类型',
    width: 80,
    align: 'center',
    isMergeRows: true,
  },
  allocationDetail: {
    title: '详细费用',
    width: 120,
    align: 'center',
  },
};

// 周维度字段
export const columns: VxeGridPropTypes.Columns = [{ field: 'allocationType' }, { field: 'allocationDetail' }, { field: 'amount' }, { field: 'proportion' }];
