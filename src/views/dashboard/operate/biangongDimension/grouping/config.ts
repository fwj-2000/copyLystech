import { thousandsFormat } from '/@/utils/lydc';
import { EColumnsType, EFilterSlotType, IColumnOption } from '/@/views/dashboard/operate/components/BaseVxeTable/types';
import { VxeGridPropTypes } from 'vxe-table';

export const allColumnsOptions: { [key: string]: IColumnOption } = {
  category: {
    field: 'category',
    title: '指标',
    width: 100,
    isMergeRows: true,
    isMergeCols: true,
    align: 'center',
    filterMultiple: true,
  },
  metric: {
    field: 'metric',
    title: '类目',
    width: 120,
    align: 'center',
    filterMultiple: true,
  },
  dimesionType: {
    field: 'dimesionType',
    customColumnType: EColumnsType.DIMENTION_LIST,
    width: 120,
    align: 'center',
    slots: {
      filter: EFilterSlotType.MULTI_SEARCH_FILTER,
    },
    // filterMultiple: true,
    isMergeRows: true,
  },
  vList: {
    field: 'vList',
    customColumnType: EColumnsType.DATE_VALUE_LIST,
    width: 120,
    align: 'right',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    formatter: ({ cellValue, row }) => {
      const { metric } = row;
      if (!cellValue || !metric) return '';
      if (metric.includes('(万)')) {
        return `${thousandsFormat(cellValue.toFixed(2))}`;
      }
      return `${cellValue.toFixed(1)}%`;
    },
  },
};

// 周维度字段
export const columns: VxeGridPropTypes.Columns = [{ field: 'dimesionType' }, { field: 'category' }, { field: 'metric' }, { field: 'vList' }];
