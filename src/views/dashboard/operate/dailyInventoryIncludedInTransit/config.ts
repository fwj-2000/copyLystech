import { cloneDeep } from 'lodash-es';
// 片卷下拉
export const typeOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: 'AE',
    value: 'AE',
  },
  {
    label: 'ME',
    value: 'ME',
  },
];

export const column = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: '日期',
    field: 'DateDay',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    //   searchField: 'DateDay',
    // },
  },
  {
    title: '厂区',
    field: 'Factory',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'Factory',
    },
  },
  // {
  //   title: '小项目',
  //   field: 'MinItem',
  //   width: 140,
  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //     searchField: 'minItem',
  //   },
  // },
  {
    title: '成品库存',
    field: 'CpQty',
    width: '160',
    filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    //   searchField: 'CpQty',
    // },
    // sortable: true,
  },
  {
    title: '良品库存',
    field: 'CplpQty',
    width: '160',
  },
  {
    title: '不良品库存',
    field: 'CpblpQty',
    width: '160',
    filters: [{ data: '' }],
  },
  {
    title: '跨厂调拨在途',
    field: 'DbztQty',
    width: '160',
    filters: [{ data: '' }],
  },
  {
    title: '总在制',
    field: 'ZzzQty',
    width: '160',
    filters: [{ data: '' }],
  },
  {
    title: '已下单待模切',
    field: 'YxddmqQty',
    width: '160',
    filters: [{ data: '' }],
  },
  {
    title: '模切完成待手工',
    field: 'MqwcdsgQty',
    width: '160',
    filters: [{ data: '' }],
  },
  {
    title: '手工完成待入库',
    field: 'SgwcdrkQty',
    width: '160',
    filters: [{ data: '' }],
  },
  {
    title: '7天内出货未扣账',
    field: 'Chwkz7Day',
    width: '160',
    filters: [{ data: '' }],
  },
];

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}
