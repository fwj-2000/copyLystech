import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { debounce } from 'lodash-es';

const { t } = useI18n();

function distributeInQtyToPoList(outerItem) {
  // 如果传入的不是对象或者是空值，返回空数组
  if (!outerItem || typeof outerItem !== 'object') {
    return [];
  }

  const inQtyTotal = outerItem.inQtyTotal;
  let remainingQty = Number(inQtyTotal) || 0;

  // 如果没有poList或poList不是数组，返回空数组
  if (!outerItem.poList || !Array.isArray(outerItem.poList)) {
    return [];
  }

  // 如果inQtyTotal无效，返回所有PO的inQty设为0
  if (remainingQty <= 0) {
    return outerItem.poList.map(poItem => ({
      ...poItem,
      inQty: 0,
    }));
  }

  // 按顺序分配inQtyTotal到poList
  return outerItem.poList.map(poItem => {
    const poCopy = { ...poItem };
    const notInQty = Number(poCopy.notInQty) || 0;

    if (remainingQty <= 0) {
      // 如果剩余数量为0，设置inQty为0
      poCopy.inQty = 0;
    } else if (remainingQty >= notInQty) {
      // 如果剩余数量大于等于notInQty，分配全部notInQty
      poCopy.inQty = notInQty;
      remainingQty -= notInQty;
    } else {
      // 如果剩余数量小于notInQty，分配全部剩余数量
      poCopy.inQty = remainingQty;
      remainingQty = 0;
    }

    return poCopy;
  });
}

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'innerMaterialNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FeedPlanColumn.innerMaterialCode'),
      },
    },
    {
      fieldName: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        immediate: true,
        placeholder: t('dict.FeedPlanColumn.factoryArea'),
      },
    },
    // {
    //   fieldName: 'poOrderNo',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: 'PO单号',
    //   },
    // },
    {
      fieldName: 'supplierName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FeedPlanColumn.supplierId'),
      },
    },
    {
      fieldName: 'buyer',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FeedPlanColumn.buyer'),
      },
    },
  ];
}

// 主页表格column配置
export const column = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  // {
  //   field: 'seq',
  //   title: t('component.table.index'),
  //   type: 'seq',
  //   width: '50',
  //   align: 'center',
  // },
  {
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'isBondedDes',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'ASelect',
    //   props: {
    //     options: [
    //       { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
    //       { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
    //     ],
    //   },
    // },
    width: 80,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: '供应商',
    field: 'supplierId',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: '单位',
    field: 'unit',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 90,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '名称',
    field: 'name',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: '未进料数量',
    field: 'totalNotInQty',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '审批中数量',
    field: 'auditQty',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 140,
    slots: { default: 'poOrderNo' },
  },
  {
    title: '采购员',
    field: 'buyer',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
];

export const columnExport = [
  {
    title: '工厂',
    field: 'factoryAreaName',
    width: 140,
  },
  {
    title: '是否保税',
    field: 'isBondedDes',
    width: 100,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 160,
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    width: 160,
  },
  {
    title: '供应商',
    field: 'supplierId',
    width: 140,
  },
  {
    title: '单位',
    field: 'unit',
    width: 90,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    width: 180,
  },
  {
    title: '名称',
    field: 'name',
    width: 140,
  },
  {
    title: '未进料数量',
    field: 'purchaseQuantity',
    width: 120,
  },
  {
    title: '审批中数量',
    field: 'auditQty',
    width: 120,
  },
  // {
  //   title: 'PO单号',
  //   field: 'poOrderNo',
  //   width: 160,
  //   slots: { default: 'poOrderNo' },
  // },
  {
    title: '采购员',
    field: 'buyer',
    minWidth: 160,
  },
];

export const selectPOColumn = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 140,
  },
  {
    title: '责任PC/MC',
    field: 'responsiblePcMc',
    width: 140,
  },
  {
    title: '是否公开',
    field: 'isOpen',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '该PO单可进料数量',
    field: 'curPOFedNumber',
    width: 180,
  },
  {
    title: '分配数量',
    field: 'allocatedQty',
    width: 80,
  },
  {
    title: '供应商',
    field: 'supplierName',
    width: 120,
  },
  {
    title: 'PO单日期',
    field: 'creatorTime',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '处理时间',
    field: 'processTime',
    width: 120,
    cellRender: {
      name: 'Date',
    },
  },
];

export const POListColumn = [
  // {
  //   field: 'checkbox',
  //   type: 'checkbox',
  //   width: '50',
  //   align: 'center',
  // },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 150,
  },
  {
    title: '责任PC/MC',
    field: 'responsiblePcmcName',
    minwidth: 140,
  },
  {
    title: '是否公开',
    field: 'isOpen',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 2, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '该PO单可进料数量',
    field: 'canQuantity',
    width: 140,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '已分配数量',
    field: 'fpQuantity',
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '供应商',
    field: 'supplierId',
    width: 120,
  },
  {
    title: 'PO单日期',
    field: 'creatorTime',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  // {
  //   title: '处理时间',
  //   field: 'processTime',
  //   width: 120,
  //   cellRender: {
  //     name: 'Date',
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //   },
  // },
];

export const PushMaterialColumn = [
  {
    type: 'expand',
    width: '50',
    align: 'center',
    // fixed: 'left',
    slots: { content: 'expand_content' },
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
    // fixed: 'left',
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    i18nField: 'supplierLastTime',
    width: 180,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '进料数量',
    field: 'inQtyTotal',
    width: 100,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
      props: {
        onChange: async (_value, { $grid, data, row }) => {
          // 获取可用PO单列表
          const debounceFunc = debounce(async row => {
            const poListFormat = distributeInQtyToPoList(row);
            row.poList = poListFormat;
            $grid.refreshColumn();
          }, 300);
          debounceFunc(row);
        },
      },
    },
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '采购员(下个节点处理人)',
    field: 'buyer',
    width: 200,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '进料备注',
    field: 'inRemark',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '未进料数量',
    field: 'totalNotInQty',
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '周别',
    field: 'week',
    width: 60,
  },
  {
    title: '进料PC/MC',
    field: 'inPcMcUserName',
    width: 120,
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
    width: 120,
  },
  {
    title: '安排进料日期',
    field: 'scheduleDate',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    width: 120,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 140,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    width: 120,
  },
  {
    title: '单位',
    field: 'unit',
    width: 60,
  },
  // {
  //   title: '操作',
  //   field: 'action',
  //   width: 50,
  //   fixed: 'right',
  //   slots: { default: 'action' },
  // },
];

export const childColumn = [
  {
    title: 'PO单号',
    field: 'poOrderNo',
    minwidth: 160,
  },
  {
    title: '本次分配数量',
    field: 'inQty',
    i18nField: 'currentAllocQty',
    minwidth: 140,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '责任PC/MC',
    field: 'responsiblePcmcName',
    minwidth: 140,
  },
  {
    title: '是否公开',
    field: 'isOpen',
    minwidth: 120,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 2, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    // editRender: {
    //   name: 'ASelect',
    //   cacheField: 'isOpen',
    //   props: {
    //     fieldNames: {
    //       label: 'fullName',
    //       value: 'enCode',
    //     },
    //     options: [
    //       { fullName: '是', enCode: 1 },
    //       { fullName: '否', enCode: 2 },
    //     ],
    //   },
    // },
  },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'isBondedDes',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    minwidth: 120,
  },
  {
    title: '该PO单可进料数量',
    field: 'notInQty',
    i18nField: 'canQuantity',
    minwidth: 140,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '供应商',
    field: 'supplierId',
    minwidth: 100,
  },
  {
    title: 'PO单日期',
    field: 'creatorTime',
    i18nField: 'poDate',
    minwidth: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  // {
  //   title: '处理时间',
  //   field: 'processTime',
  //   width: 140,
  // editRender: {
  //   name: 'DatePicker',
  //   props: {
  //     format: 'YYYY-MM-DD',
  //     valueFormat: 'YYYY-MM-DD',
  //   },
  // },
  // },
  // {
  //   title: '操作',
  //   field: 'action',
  //   width: 50,
  //   fixed: 'right',
  //   slots: { default: 'action' },
  // },
];

export const PushMaterialColumnEditRules = {
  requireSupplierDelivery: [{ required: true, message: t('common.required') }],
  inQtyTotal: [
    { required: true, message: t('common.required') },
    {
      trigger: 'change',
      validator: ({ row }) => {
        if (row.inQtyTotal > row.totalNotInQty) {
          return new Error('复核进料数量');
        }
      },
    },
  ],
  buyer: [{ required: true, message: t('common.required') }],
};

export const childColumnEditRules = {
  inQty: [
    { required: true, message: t('common.required') },
    {
      trigger: 'change',
      validator: ({ row }) => {
        if (row.inQty > row.notInQty) {
          return new Error('复核分配数量');
        }
      },
    },
  ],
};
