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
    title: '机台号',
    field: 'fNumber',
    width: 120,
    align: 'center',
    ...columnsFilter,
  },
  // {
  //   title: '主机台线体类型',
  //   field: 'date',
  //   width: 160,
  //   align: 'center',
  // },
  {
    title: '班次',
    field: 'fTeam',
    width: 100,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '品名',
    field: 'prodNo',
    width: 120,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '1人2机',
    field: 'onepertwoMachinesFormatter',
    width: 120,
    align: 'center',
    className: ({ row }) => {
      return row?.onepertwoMachines == 1 ? 'text-[green]' : 'text-[red]';
    },
    // formatter: ({ cellValue }) => {
    //   return cellValue == 1 ? '√' : cellValue == 0 ? '×' : '';
    // },
    ...columnsFilter,
  },
  {
    title: '良品数（K）',
    field: 'sglpqty',
    width: 120,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '不良品数（K）',
    field: 'sgblpqty',
    width: 130,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '良率',
    field: 'sgll',
    width: 100,
    align: 'center',
    className: ({ row }) => {
      return row?.sgll >= 0.9 ? 'text-[blue] font-bold' : 'text-[red] font-bold';
    },
    formatter: ({ cellValue }) => {
      return cellValue ? new Decimal(cellValue).times(100).toNumber() + '%' : cellValue;
    },
    ...columnsSort,
  },
  {
    title: '标准工时',
    field: 'bz_gs',
    width: 100,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '实际工时',
    field: 'sj_gs',
    width: 100,
    align: 'center',
    ...columnsSort,
  },
  {
    title: '工时达成率',
    field: 'gs_dcl',
    width: 100,
    align: 'center',
    className: ({ row }) => {
      return row?.gs_dcl >= 0.9 ? 'text-[blue] font-bold' : 'text-[red] font-bold';
    },
    formatter: ({ cellValue }) => {
      return cellValue ? new Decimal(cellValue).times(100).toNumber() + '%' : cellValue;
    },
    ...columnsSort,
  },
  {
    title: '稼动率',
    field: 'jdl',
    width: 100,
    align: 'center',
    className: 'text-[blue] font-bold',
    formatter: ({ cellValue }) => {
      return cellValue ? new Decimal(cellValue).times(100).toNumber() + '%' : cellValue;
    },
    ...columnsSort,
  },
  {
    title: 'OEE',
    field: 'oee',
    width: 100,
    align: 'center',
    className: 'text-[blue] font-bold',
    formatter: ({ cellValue }) => {
      return cellValue ? new Decimal(cellValue).times(100).toNumber() + '%' : cellValue;
    },
    ...columnsSort,
  },
];
