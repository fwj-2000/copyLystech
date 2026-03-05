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
    title: '厂区',
    field: 'OrgName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'orgName',
    },
  },
  {
    title: '大项目',
    field: 'MaxItem',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'maxItem',
    },
  },
  {
    title: '小项目',
    field: 'MinItem',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'minItem',
    },
  },
  {
    title: 'APN',
    field: 'APN',
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'apn',
    },
    sortable: true,
  },
  {
    title: '片/卷',
    field: 'Type',
    width: 100,
    filters: [{ data: '' }],
    sortable: true,
    filterRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'label',
          value: 'value',
        },
        options: typeOptions,
      },
    },
  },
  {
    title: 'LS PN',
    field: 'FProduct',
    width: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'fProduct',
    },
  },
  {
    title: 'PM DRI',
    field: 'PMName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'pmName',
    },
  },
  {
    title: 'PMC DRI',
    field: 'PMCName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'pmcName',
    },
  },
  {
    title: '昨日入库数',
    field: 'LastQty',
    width: 120,
    sortable: true,
  },
  {
    title: '即时库存',
    field: 'CplpQty',
    width: 120,
    sortable: true,
  },
  {
    title: '品质分类仓',
    field: 'CpblpQty',
    width: 120,
    sortable: true,
  },
  {
    title: '返工在制',
    field: 'NogdQty',
    width: 120,
    sortable: true,
  },
  {
    title: '正常工单在制-WIP',
    field: 'YesgdQty',
    width: 160,
    sortable: true,
  },
  {
    title: '备注',
    field: 'Remark',
    width: 220,
    slots: { default: 'Remark' },
  },
];

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}
