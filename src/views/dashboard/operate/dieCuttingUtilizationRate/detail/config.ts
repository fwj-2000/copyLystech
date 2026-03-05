import { sectionValOptions } from '../Content/config';
import { thousandsFormat } from '/@/utils/lydc';
import { ECellSlotType, EColumnsType, EFilterSlotType, IColumnOption } from '/@/views/dashboard/operate/components/BaseVxeTable/types';
import { VxeGridPropTypes } from 'vxe-table';
import { allOptions as baseAllOption } from '../config';
import { getUtilizationrateDimesionname } from '/@/api/dashbord/report';

import DetailDialog from './DetailDialog.vue';
export const allColumnsOptions: { [key: string]: IColumnOption } = {
  target: {
    field: 'target',
    title: '目标',
    width: 100,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    formatter: ({ cellValue }) => {
      return `${thousandsFormat(cellValue.toFixed(2))}`;
    },
  },
  difference: {
    field: 'difference',
    title: '差异',
    width: 100,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    formatter: ({ cellValue }) => {
      return `${thousandsFormat(cellValue.toFixed(2))}`;
    },
  },
  actual: {
    field: 'actual',
    title: '实际',
    width: 120,
    align: 'center',
    sortable: true,
    slots: {
      filter: EFilterSlotType.FILTER_VALUE,
    },
    formatter: ({ cellValue }) => {
      return `${thousandsFormat(cellValue.toFixed(2))}`;
    },
  },
  details: {
    title: '停机明细',
    align: 'center',
  },
  dimesionType: {
    field: 'dimesionType',
    customColumnType: EColumnsType.DIMENTION_LIST,
    width: 120,
    align: 'center',
    filterMultiple: true,
    slots: {
      default: ECellSlotType.DIALOG,
      // filter: EFilterSlotType.MULTI_SEARCH_FILTER,
    },
    config: {
      dialogCompo: DetailDialog,
      dialogAttrs: {
        title: '明细',
      },
    },
    getQuery: ({ row }) => {
      return {
        dimensionType: row.dimesionType,
      };
    },
  },
};

// 维度字段
export const columns: VxeGridPropTypes.Columns = [
  { field: 'dimesionType' },
  { field: 'target' },
  { field: 'actual' },
  { field: 'difference' },
  { field: 'details' },
];

export const staticAllOptions = [
  {
    label: '维度',
    field: 'dimensionType',
    width: 74,
    default: ['flocAtion'],
    $attrs: { mode: 'multiple' }, // 透传下拉组件配置
    options: [
      { label: '车间', value: 'flocAtion' },
      { label: '产品线', value: 'productLine' },
      { label: '机台号', value: 'machineNo' },
    ],
  },
  {
    label: '类型',
    field: 'metricKey',
    width: 74,
    default: '综合',
    options: [
      { label: '综合', value: '综合' },
      { label: '圆刀', value: '圆刀' },
      { label: '平板', value: '平板' },
    ],
    $attrs: {},
  },
  {
    label: '稼动率',
    field: 'sectionVal',
    width: 74,
    default: '',
    options: sectionValOptions,
    $attrs: {},
  },
  ...baseAllOption,
];

// 获取所有下拉配置
export const getAllOptions = async (params: any) => {
  const { data } = await getUtilizationrateDimesionname(params).catch(() => ({ data: {} }));
  return [
    {
      label: '维度',
      field: 'dimensionType',
      width: 74,
      default: ['flocAtion'],
      $attrs: { mode: 'multiple' }, // 透传下拉组件配置
      options: Object.keys(data).map(key => ({
        label: data[key],
        value: key,
      })),
    },
    ...staticAllOptions.filter(item => !['dimensionType'].includes(item.field)),
  ];
};
