import type { VxeGridPropTypes } from '/@/components/VxeTable';
import Decimal from 'decimal.js';
import { useI18n } from '/@/hooks/web/useI18n';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

const { t } = useI18n();

const columnsFilter: Partial<BaseVxeTableTypes.Column> = {
  headerAlign: 'center',
  filters: [{ data: [] }],
  slots: {
    filter: EFilterSlot.MULTI_SEARCH_SELECT,
  },
};

const columnsSort: Partial<BaseVxeTableTypes.Column> = {
  sortable: true,
  sortType: 'number',
};

export const columns: VxeGridPropTypes.Columns = [
  // 保持序号列不变
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '厂区',
    field: 'factory',
    width: 160,
    align: 'center',
  },
  {
    title: '日期',
    field: 'timeDate',
    width: 160,
    align: 'center',
  },
  {
    title: '品名',
    field: 'fProduct',
    width: 160,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '计划数量（K）',
    field: 'mbCz',
    width: 120,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '实际产出',
    field: 'sjCz',
    width: 160,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '达成率',
    field: 'czDcl',
    width: 160,
    align: 'center',
    className: ({ row }) => {
      return row?.czDcl >= 0.95 ? 'text-[blue]' : 'text-[red]';
    },
    formatter: ({ cellValue }) => {
      // return cellValue ? (cellValue = (cellValue * 100).toFixed(2) + '%') : cellValue;
      return cellValue ? new Decimal(cellValue).times(100).toNumber() + '%' : cellValue;
    },
    ...columnsSort,
  },
];
