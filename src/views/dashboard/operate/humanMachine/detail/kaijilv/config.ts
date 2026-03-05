import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { commonLargeValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
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
  {
    title: '班次',
    field: 'fTeam',
    width: 120,
    align: 'center',
    // formatter: ({ cellValue }) => {
    //   return cellValue == 1 ? '白班' : cellValue == 2 ? '晚班' : '';
    // },
    ...columnsFilter,
  },
  {
    title: '机台号',
    field: 'fNumber',
    width: 160,
    align: 'center',
    ...columnsFilter,
  },
  {
    title: '使用状态',
    field: 'statusType',
    width: 120,
    align: 'center',
    className: ({ row }) => {
      return row.statusType == '常用' ? 'text-[green]' : 'text-[red]';
    },
    ...columnsFilter,
  },
  {
    title: '开机状态',
    field: 'kaiJiType',
    width: 120,
    align: 'center',
    className: ({ row }) => {
      return row.kaiJiType == '开机' ? 'text-[green]' : 'text-[red]';
    },
    ...columnsFilter,
  },
  {
    title: '目标1人2机',
    field: 'mb12Formatter',
    width: 120,
    align: 'center',
    className: ({ row }) => {
      return row?.mb12 == 1 ? 'text-[green]' : 'text-[red]';
    },
    ...columnsFilter,
    // formatter: ({ cellValue }) => {
    // if( cellValue ) {
    //   return cellValue == 1 ? '√' : '×';
    // } else return cellValue;
    // return cellValue == 1 ? '√' : cellValue == 0 ? '×' : '';
    // },
  },
  {
    title: '实际1人2机',
    field: 'sj12Formatter',
    width: 120,
    align: 'center',
    className: ({ row }) => {
      return row?.sj12 == 1 ? 'text-[green]' : 'text-[red]';
    },
    ...columnsFilter,
    // formatter: ({ cellValue }) => {
    //   return cellValue == 1 ? '√' : cellValue == 0 ? '×' : '';
    // },
  },
  // {
  //   title: '备注',
  //   field: 'output',
  //   width: 160,
  //   align: 'center',
  //   slots: {
  //     default: 'remarkIpt',
  //   },
  // },
];
