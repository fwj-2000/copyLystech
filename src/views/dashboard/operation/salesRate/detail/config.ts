import { VxeGridPropTypes } from 'vxe-table';

// 所有字段
export const columnsOptions: VxeGridPropTypes.Columns = [
  {
    fixed: 'left',
    field: 'weeks',
    title: '周别',
    width: 120,
    treeNode: true,
    align: 'left',
    filterMultiple: true,
  },
  {
    fixed: 'left',
    title: '产品线',
    field: 'productline',
    width: 80,
    align: 'center',
    filterMultiple: true,
  },
  {
    fixed: 'left',
    title: '项目',
    field: 'items',
    width: 80,
    align: 'center',
    filterMultiple: true,
  },
  {
    fixed: 'left',
    title: '品名',
    field: 'fproduct',
    width: 130,
    align: 'center',
    filterMultiple: true,
  },
  {
    fixed: 'left',
    title: '十码',
    field: 'fprocod',
    width: 100,
    align: 'center',
    filterMultiple: true,
  },
  {
    field: 'con',
    title: '多项目',
    width: 60,
    align: 'center',
    filterMultiple: true,
  },
  {
    field: 'weight',
    title: '权重',
    width: 70,
    align: 'center',
    filterMultiple: true,
  },
  {
    field: 'ycqty',
    title: '未来4周',
    align: 'center',
    width: 60,
    sortable: true,
    filterMultiple: true,
  },

  {
    title: '当周出货目标（K）',
    width: 130,
    align: 'center',
    children: [
      {
        field: 'mbchqty',
        title: 'JIT',
        width: 65,
        sortable: true,
      },
      {
        field: 'vmichqty',
        title: 'VMI',
        width: 65,
        sortable: true,
      },
    ],
  },

  {
    title: '良品库存+WIP(K)+WOS(天)',
    field: 'parent1',
    width: 380,
    align: 'center',
    children: [
      {
        field: 'vmilpqty',
        title: 'VMI',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'cplpqty',
        title: '工厂',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'zzje',
        title: 'WIP',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'cp_wos',
        title: '库存WOS',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'cpzz_wos',
        title: '+WIP WOS',
        width: 70,
        align: 'right',
        sortable: true,
      },
    ],
  },

  {
    title: '实际VMI出货',
    width: 240,
    align: 'center',
    children: [
      {
        field: 'vmisjchqty',
        title: '正常',
        sortable: true,
        width: 70,
        align: 'right',
      },
      {
        field: 'vmimfchqty',
        title: '免费',
        sortable: true,
        width: 70,
        align: 'right',
      },
      {
        field: 'vmi_total',
        title: 'Total',
        sortable: true,
        width: 70,
        align: 'right',
      },
      {
        field: 'vmi_diffqty',
        title: '欠数',
        sortable: true,
        width: 70,
        align: 'right',
      },
    ],
  },

  {
    title: '实际JIT出货',
    field: 'parent2',
    width: 240,
    align: 'center',
    children: [
      {
        field: 'jitchqty',
        title: '正常',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'jitmfchqty',
        title: '免费',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'jit_total',
        title: 'Total',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'jit_diffqty',
        title: '欠数',
        width: 70,
        align: 'right',
        sortable: true,
      },
    ],
  },

  {
    title: '当周(K)',
    width: 120,
    align: 'center',
    children: [
      {
        field: 'mbczqty',
        title: '排产',
        sortable: true,
        width: 70,
        align: 'right',
      },
      {
        field: 'sjczqty',
        title: '入库',
        sortable: true,
        width: 70,
        align: 'right',
      },
    ],
  },

  {
    field: 'reason',
    title: '原因分析',
    align: 'center',
    width: 80,
  },

  {
    title: '不良品',
    width: 120,
    field: 'parent3',
    align: 'center',
    children: [
      {
        field: 'vmiblpqty',
        title: 'VMI',
        width: 70,
        align: 'right',
        sortable: true,
      },
      {
        field: 'cpblpqty',
        title: '工厂',
        width: 70,
        align: 'right',
        sortable: true,
      },
    ],
  },
];

// 默认下拉选项
export const defaultOptionValue = {
  prodline: '',
  item: '',
};

// 表头样式配置
export const headerCellStyleOptions = [
  {
    fields: [
      'parent1',
      'vmilpqty',
      'cplpqty',
      'zzje',
      'cp_wos',
      'cpzz_wos',
      'parent2',
      'jitchqty',
      'jitmfchqty',
      'jit_total',
      'jit_diffqty',
      'reason',
      'parent3',
      'vmiblpqty',
      'cpblpqty',
    ],
    style: { backgroundColor: 'rgba(82, 196, 26, 0.2)' },
  },
];
