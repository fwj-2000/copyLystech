import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';

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
    title: '岗位',
    field: 'jobTitle',
    width: 240,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '标准',
    field: 'bz_rjb',
    width: 130,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '实际',
    field: 'sj_rjb',
    width: 130,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '差异',
    field: 'diffqty',
    width: 130,
    align: 'center',
    className: ({ row }) => {
      return row?.diffqty < 0 ? 'text-[red]' : '';
    },
    ...columnsSort,
  },
  // {
  //   title: '备注',
  //   field: 'num',
  //   width: 160,
  //   align: 'center',
  // },
];
