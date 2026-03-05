import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { useI18n } from '/@/hooks/web/useI18n';

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
    title: '类型',
    field: 'processType',
    width: 120,
    align: 'center',
  },
  {
    title: '工号',
    field: 'uId',
    width: 120,
    align: 'center',
    ...columnsSort,
    ...columnsFilter,
  },
  {
    title: '姓名',
    field: 'uName',
    width: 140,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '岗位',
    field: 'jobTitle',
    width: 140,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '状态',
    field: 'cQTypes',
    width: 100,
    align: 'center',
    className: ({ row }) => {
      return row.cQTypes == '出勤' ? 'text-[green]' : 'text-[red]';
    },
    ...columnsFilter,
  },
  {
    title: '班次',
    field: 'fTeams',
    width: 100,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '打卡时间1',
    field: 'brushTime1',
    width: 140,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '打卡时间2',
    field: 'brushTime2',
    width: 140,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '工时',
    field: 'workHours',
    width: 100,
    align: 'center',
    className: ({ row }) => {
      return row.workHours == 0 ? 'text-[red]' : '';
    },
    ...columnsSort,
  },
  {
    title: '备注',
    field: 'output',
    width: 160,
    align: 'center',
  },
];
