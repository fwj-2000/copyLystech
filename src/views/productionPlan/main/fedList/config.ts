import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { useBaseStore } from '/@/store/modules/base';
import { getYearWeek } from '/@/views/productionPlan/main/materialPlan/weekTime';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export const formSchema = [
  {
    fieldName: 'innerMaterialNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.FeedListColumn.innerMaterialCode'),
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
      placeholder: t('dict.FeedListColumn.factoryArea'),
    },
  },
  // {
  //   fieldName: 'PONumber',
  //   label: '',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: t('dict.FeedListColumn.PONumber'),
  //   },
  // },
  {
    fieldName: 'pc',
    i18nField: 'PCOrMC',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: t('dict.FeedListColumn.responsiblePcmc'),
    },
  },
  // {
  //   fieldName: 'dutyMC',
  //   label: '',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: t('dict.FeedListColumn.dutyMC'),
  //   },
  // },
];

// 主页表格column配置
export const column = [
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
    align: 'center',
  },
  {
    title: '进料单号',
    // sortable: true,
    field: 'inMaterialNo',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '状态',
    field: 'status',
    i18nField: 'statusDes',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 3, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
        { id: 2, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 0, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
      ],
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'ASelect',
    //   props: {
    //     options: [
    //       { id: 3, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
    //       { id: 2, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
    //       { id: 1, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
    //       { id: 0, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
    //     ],
    //   },
    // },
    width: 80,
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
    width: 80,
  },
  {
    title: '是否已发邮件',
    field: 'isSentMail',
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
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 100,
  },
  {
    title: '是否已发新邮件',
    field: 'isSentNewMail',
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
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 110,
  },
  {
    title: '周别',
    field: 'week',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 60,
  },
  {
    title: '进料PC/MC',
    field: 'inPcMcName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
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
    title: '安排进料日期',
    field: 'arrangeDate',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '供应商',
    field: 'supplierName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 110,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '原材编号',
    field: 'manufModel',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 110,
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
    title: '单位',
    field: 'unit',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 60,
  },
  {
    title: '库存',
    field: 'stock',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '本次进料数量',
    field: 'inQty',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 110,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '进料备注',
    field: 'inRemark',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 110,
  },
  {
    title: '在途',
    field: 'inRoadQty',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    i18nField: 'shouldSupplierDate',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 130,
  },
  {
    title: '进料数量cover周数',
    field: 'coverWeeks',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: 'PO单号',
    field: 'PONumber',
    i18nField: 'poOrderNo',
    width: 80,
    slots: { default: 'PONumber' },
  },
  {
    title: '供应商交期',
    field: 'supplierDeliveryDate',
    i18nField: 'supplierDeliveryD',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 130,
    className: ({ row }) => {
      return row.supplierDeliveryDate >= row.requireSupplierDelivery ? 'cell-red' : '';
    },
  },
  {
    title: '采购员',
    field: 'buyerName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '责任PC/MC',
    field: 'responsiblePcmcName',
    i18nField: 'responsiblePcmc',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
];

export const columnExport = [
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
    align: 'center',
  },
  {
    title: '进料单号',
    field: 'inMaterialNo',
    width: 160,
  },
  {
    title: '状态',
    field: 'statusDes',
    width: 140,
  },
  {
    title: '是否保税',
    field: 'isBondedDes',
    width: 140,
  },
  {
    title: '是否已发邮件',
    field: 'isSentMailDes',
    width: 120,
  },
  {
    title: '是否已发新邮件',
    field: 'isSentNewMailDes',
    width: 130,
  },
  {
    title: '周别',
    field: 'week',
    width: 100,
  },
  {
    title: '进料PC/MC',
    field: 'inPcMcName',
    width: 140,
  },
  {
    title: '厂区',
    field: 'factoryArea',
    width: 140,
  },
  {
    title: '安排进料日期',
    field: 'arrangeDate',
    width: 140,
  },
  {
    title: '供应商',
    field: 'supplierName',
    width: 150,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 130,
  },
  {
    title: '原材编号',
    field: 'manufModel',
    width: 130,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    width: 120,
  },
  {
    title: '单位',
    field: 'unit',
    width: 100,
  },
  {
    title: '库存',
    field: 'stock',
    width: 120,
  },
  {
    title: '本次进料数量',
    field: 'inQty',
    width: 120,
  },
  {
    title: '在途',
    field: 'inRoadQty',
    width: 120,
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    i18nField: 'shouldSupplierDate',
    width: 150,
  },
  {
    title: '进料数量cover周数',
    field: 'coverWeeks',
    width: 160,
  },
  // {
  //   title: 'PO单号',
  //   field: 'PONumber',
  //   i18nField: 'poOrderNo',
  //   width: 140,
  //   slots: { default: 'PONumber' },
  // },
  {
    title: '供应商交期',
    field: 'supplierDeliveryDate',
    i18nField: 'supplierDeliveryD',
    width: 160,
  },
  {
    title: '采购员',
    field: 'buyerName',
    width: 160,
  },
  {
    title: '责任PC/MC',
    field: 'responsiblePcmcName',
    i18nField: 'responsiblePcmc',
    width: 160,
  },
];

export function getColumn(activeKey) {
  let columnData = cloneDeep(column);
  if (activeKey === 'handled' || activeKey === 'processing') {
    const nodeList = [
      {
        title: '供应商交期记录',
        field: 'supplierDateLog',
        width: 110,
        slots: { default: 'supplierDateLog' },
      },
    ];
    columnData.splice(6, 0, ...nodeList);
  }
  return columnData;
}

export const sendEmailColumn = [
  // {
  //   field: 'seq',
  //   title: t('component.table.index'),
  //   type: 'seq',
  //   width: '50',
  //   align: 'center',
  //   fixed: 'left',
  // },
  {
    title: '周别',
    field: 'week',
    width: 60,
  },
  {
    title: '进料MC',
    field: 'inPcMc',
    width: 120,
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
    width: 110,
  },
  {
    title: '安排进料日期',
    field: 'arrangeDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 140,
  },
  {
    title: '供应商',
    field: 'supplierName',
    width: 120,
  },
  {
    title: '原材编号',
    field: 'manufModel',
    width: 100,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 120,
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

  {
    title: '需求数量',
    field: 'inQty',
    i18nField: 'requiredQuantity',
    width: 90,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '在途',
    field: 'inRoadQty',
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '需求日期',
    field: 'arrangeDate',
    i18nField: 'requiredDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 110,
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 120,
  },
  {
    title: '第一次回复',
    field: 'firstReply',
    children: [
      {
        title: '供应商回复交付时间',
        field: 'su1SupplierDeliveryDate',
        i18nField: 'supplierReplytime',
        width: 170,
        editRender: {
          name: 'DatePicker',
          props: {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
          },
        },
      },
      {
        title: '预计交货数量',
        field: 'su1ExpectedDeliveryQty',
        i18nField: 'expectedDeliveryQ',
        width: 120,
        editRender: {
          name: 'Input',
        },
        cellRender: {
          name: 'Number',
        },
      },
      {
        title: '交货规格',
        field: 'su1DeliverySpec',
        i18nField: 'deliverySpecs',
        width: 100,
        editRender: {
          name: 'Input',
        },
      },
      {
        title: '备注',
        field: 'su1InRemark',
        i18nField: 'remark',
        width: 100,
        editRender: {
          name: 'Input',
        },
      },
    ],
  },
  {
    title: '第二次回复',
    field: 'secondReply',
    children: [
      {
        title: '供应商回复交付时间',
        field: 'su2SupplierDeliveryDate',
        i18nField: 'supplierReplytime',
        width: 170,
        editRender: {
          name: 'DatePicker',
          props: {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
          },
        },
      },
      {
        title: '预计交货数量',
        field: 'su2ExpectedDeliveryQty',
        i18nField: 'expectedDeliveryQ',
        width: 120,
        editRender: {
          name: 'Input',
        },
        cellRender: {
          name: 'Number',
        },
      },
      {
        title: '交货规格',
        field: 'su2DeliverySpec',
        i18nField: 'deliverySpecs',
        width: 100,
        editRender: {
          name: 'Input',
        },
      },
      {
        title: '备注',
        field: 'su2InRemark',
        i18nField: 'remark',
        width: 100,
        editRender: {
          name: 'Input',
        },
      },
    ],
  },
];

// 录入供应商交期
export const enterDeliveryDateColumn = [
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
    title: '进料单号',
    field: 'inMaterialNo',
    width: 140,
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 120,
  },
  {
    title: '是否已发邮件',
    field: 'isSentMail',
    width: 120,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '是否已发新邮件',
    field: 'isSentNewMail',
    width: 130,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    i18nField: 'statusName',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 3, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
        { id: 2, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 0, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
      ],
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'ASelect',
    //   props: {
    //     options: [
    //       { id: 3, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
    //       { id: 2, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
    //       { id: 1, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
    //       { id: 0, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
    //     ],
    //   },
    // },
  },

  {
    title: '周别',
    field: 'week',
    width: 60,
  },
  {
    title: '进料PC/MC',
    field: 'inPcMcName',
    width: 110,
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
    width: 110,
  },
  {
    title: '安排进料日期',
    field: 'arrangeDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },
  {
    title: '供应商',
    field: 'supplierName',
    width: 120,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 130,
  },
  {
    title: '原材编号',
    field: 'manufModel',
    width: 120,
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
  {
    title: '库存',
    field: 'stock',
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '本次进料数量',
    field: 'inQty',
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '在途',
    field: 'inRoadQty',
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    i18nField: 'shouldSupplierDate',
    width: 150,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '进料数量cover周数',
    field: 'coverWeeks',
    width: 150,
  },
  {
    title: '项目号',
    field: 'project',
    width: 120,
  },
  {
    title: '采购员',
    field: 'buyerName',
    width: 120,
  },
  {
    title: '备注',
    field: 'inRemark',
    i18nFiled: 'remark',
    width: 120,
  },
];
export const supplierDeliveryDateEditColumn = [
  {
    title: '供应商交期',
    field: 'supplierDeliveryDate',
    i18nField: 'supplierDeliveryD',
    minwidth: 140,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '预计交货数量 ',
    field: 'expectedDeliveryQty',
    i18nField: 'expectedDeliveryQ',
    minwidth: 140,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },

  {
    title: '交货规格',
    field: 'deliverySpec',
    i18nField: 'deliverySpecs',
    minwidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '供应商备注',
    field: 'supplierRemark',
    minwidth: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '进料备注',
    field: 'inRemark',
    minwidth: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '操作',
    field: 'action',
    width: 120,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
export const supplierDeliveryDateColumnEditRules = {
  supplierDeliveryDate: [{ required: true, message: t('common.required') }],
  expectedDeliveryQty: [{ required: true, message: t('common.required') }],
  deliverySpec: [{ required: true, message: t('common.required') }],
};

// 更新要求供应商交期
export const updateDeliveryDateColumn = [
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
    title: '进料单号',
    field: 'inMaterialNo',
    width: 140,
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 120,
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    i18nField: 'shouldSupplierDate',
    width: 160,
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
    title: '是否已发邮件',
    field: 'isSentMail',
    width: 120,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '是否已发新邮件',
    field: 'isSentNewMail',
    width: 120,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    i18nField: 'statusName',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 3, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
        { id: 2, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 0, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
      ],
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: [
          { id: 3, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
          { id: 2, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
          { id: 1, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
          { id: 0, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
        ],
      },
    },
  },
  {
    title: '周别',
    field: 'week',
    width: 60,
  },
  {
    title: '进料PC/MC',
    field: 'inPcMcName',
    width: 110,
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
    width: 120,
  },
  {
    title: '安排进料日期',
    field: 'arrangeDate',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '供应商',
    field: 'supplierName',
    width: 120,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 120,
  },
  {
    title: '原材编号',
    field: 'manufModel',
    width: 120,
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
  {
    title: '库存',
    field: 'stock',
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '本次进料数量',
    field: 'inQty',
    width: 110,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '在途',
    field: 'inRoadQty',
    width: 60,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '进料数量cover周数',
    field: 'coverWeeks',
    width: 140,
  },
  {
    title: '采购员',
    field: 'buyerName',
    width: 120,
  },
  {
    title: '备注',
    field: 'inRemark',
    width: 120,
  },
];
export const supplierDeliveryDateColumn = [
  {
    title: '供应商交期',
    field: 'supplierDeliveryDate',
    i18nField: 'supplierDeliveryD',
    minwidth: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '预计交货数量',
    field: 'expectedDeliveryQty',
    i18nField: 'expectedDeliveryQ',
    minwidth: 140,
  },

  {
    title: '交货规格',
    field: 'deliverySpec',
    minwidth: 120,
  },
  {
    title: '供应商备注',
    field: 'supplierRemark',
    minwidth: 140,
  },
  {
    title: '进料备注',
    field: 'inRemark',
    minwidth: 140,
  },
];

// 供应商交期记录
export const logListColumn = [
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    i18nField: 'shouldSupplierDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 140,
  },
  {
    title: '供应商交期',
    field: 'supplierDeliveryDate',
    i18nField: 'supplierDeliveryD',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },
  {
    title: '预计交货数量 ',
    field: 'expectedDeliveryQty',
    i18nField: 'expectedDeliveryQ',
    width: 110,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '交货规格',
    field: 'deliverySpec',
    i18nField: 'deliverySpecs',
    width: 100,
  },
  {
    title: '供应商备注',
    field: 'supplierRemark',
    width: 100,
  },
  {
    title: '进料备注',
    field: 'inRemark',
    width: 100,
  },
  {
    title: '修改时间',
    field: 'LastModifyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    minwidth: 120,
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
    i18nField: 'responsiblePcmc',
    minwidth: 140,
  },
  {
    title: '是否公开',
    field: 'isOpen',
    i18nField: 'isOpenDes',
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
    title: '分配数量',
    field: 'fpQuantity',
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '供应商',
    field: 'supplierId',
    i18nField: 'supplierName',
    width: 120,
  },
  {
    title: 'PO单日期',
    field: 'creatorTime',
    i18nField: 'poOrderDate',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
];
