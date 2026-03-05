import type { VxeGridPropTypes } from '/@/components/VxeTable';
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
    title: '日期',
    field: 'timeDate',
    width: 160,
    align: 'center',
  },
  // {
  //   title: '班次',
  //   field: 'date',
  //   width: 120,
  //   align: 'center',
  // },
  {
    title: '机台号',
    field: 'fNumber',
    width: 120,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '主机台线体类型',
    field: 'lineType',
    width: 140,
    align: 'center',
    ...columnsFilter,
  },
  // {
  //   title: '工号',
  //   field: 'output',
  //   width: 120,
  //   align: 'center',
  // },
  // {
  //   title: '操作工',
  //   field: 'output',
  //   width: 120,
  //   align: 'center',
  // },
  {
    title: '生产类型',
    field: 'processType',
    width: 160,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '标准模切工',
    field: 'bz_rjb',
    width: 100,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '实际模切工',
    field: 'sj_rjb',
    width: 100,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '差异',
    field: 'diffqty',
    width: 100,
    align: 'center',
    className: ({ row }) => {
      return row?.diffqty < 0 ? 'text-[red]' : '';
    },
    ...columnsSort,
  },
  // {
  //   title: '备注',
  //   field: 'rate',
  //   width: 160,
  //   align: 'center',
  //   slots: {
  //     default: 'remarkIpt',
  //   },
  // },
];
