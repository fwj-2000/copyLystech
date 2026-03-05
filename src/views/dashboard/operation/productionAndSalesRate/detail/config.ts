import { BaseVxeTableTypes } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
import { TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';

const formatter = ({ cellValue }) => {
  if (!cellValue || Number.parseFloat(cellValue) === 0) {
    return '';
  }
  return cellValue;
};

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      fixed: 'left',
      field: 'weeks',
      title: '周别',
      width: 120,
      treeNode: true,
      align: 'left',
      headerAlign: 'center',
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
      formatter,
    },
    // {
    //   field: 'ycqty',
    //   title: '未来4周',
    //   align: 'center',
    //   width: 100,
    //   sortable: true,
    //   filterMultiple: true,
    //   formatter,
    // },

    {
      title: '出货目标（K）',
      width: 130,
      align: 'center',
      children: [
        {
          field: 'mbchqty',
          title: '当周',
          width: 65,
          sortable: true,
          formatter,
        },
        {
          field: 'ycqty',
          title: '未来4周',
          width: 65,
          sortable: true,
          formatter,
        },
        {
          field: 'ycqtytotal',
          title: '总量',
          width: 65,
          sortable: true,
          formatter,
        },
        // {
        //   field: 'mbchqty',
        //   title: 'JIT',
        //   width: 65,
        //   sortable: true,
        //   formatter,
        // },
        // {
        //   field: 'vmichqty',
        //   title: 'VMI',
        //   width: 65,
        //   sortable: true,
        //   formatter,
        // },
      ],
    },

    {
      title: '良品库存+WIP(K)+WOS(天)',
      field: 'parent1',
      width: 380,
      align: 'center',
      headerClassName: 'bg-grey',
      children: [
        {
          field: 'vmilpqty',
          title: 'VMI',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'cplpqty',
          title: '工厂',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
        },
        {
          field: 'zzje',
          title: 'WIP',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'cp_wos',
          title: '库存WOS',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'cpzz_wos',
          title: '+WIP WOS',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
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
          formatter,
        },
        {
          field: 'vmimfchqty',
          title: '免费',
          sortable: true,
          width: 70,
          align: 'right',
          formatter,
        },
        {
          field: 'vmi_total',
          title: 'Total',
          sortable: true,
          width: 70,
          align: 'right',
          formatter,
        },
        {
          field: 'vmi_diffqty',
          title: '欠数',
          sortable: true,
          width: 70,
          align: 'right',
          formatter,
        },
      ],
    },

    {
      title: '实际JIT出货',
      field: 'parent2',
      width: 240,
      align: 'center',
      headerClassName: 'bg-grey',
      children: [
        {
          field: 'jitchqty',
          title: '正常',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'jitmfchqty',
          title: '免费',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'jit_total',
          title: 'Total',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'jit_diffqty',
          title: '欠数',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
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
          formatter,
        },
        {
          field: 'sjczqty',
          title: '入库',
          sortable: true,
          width: 70,
          align: 'right',
          formatter,
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
      headerClassName: 'bg-grey',
      children: [
        {
          field: 'vmiblpqty',
          title: 'VMI',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
          formatter,
        },
        {
          field: 'cpblpqty',
          title: '工厂',
          width: 70,
          align: 'right',
          sortable: true,
          headerClassName: 'bg-grey',
        },
      ],
    },
  ];
  return columns;
};

// 搜索条件
export const searchOptions: Partial<TFormItemOption>[] = [
  {
    default: 'MQ1006001',
  },
];
