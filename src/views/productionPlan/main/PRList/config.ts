import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { useBaseStore } from '/@/store/modules/base';
import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
import { getSupplierlist } from '/@/api/engineering/mould';
import dayjs from 'dayjs';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
        // valueFormat: 'YYYY-ww',
      },
      // defaultValue: getYearWeek(),
      defaultValue: dayjs(new Date()),
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'factoryCode',
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
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
    {
      fieldName: 'projectName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
    {
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 100,
      i18nField: 'CommonCol.applyUser',
      defaultValue: useUserStore().getUserInfo?.userId,
      componentProps: {
        placeholder: '当前处理人',
      },
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '数据状态',
    field: 'orderStatus',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'orderStatus',
      props: {
        api: () => baseStore.getDictionaryData('prOrderStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.prOrderStatus.1'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.prOrderStatus.2'), theme: 'green', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.prOrderStatus.3'), theme: 'yellow', rowKey: 'statusDesc' },
        { id: 4, fullName: t('dict.prOrderStatus.4'), theme: 'purple', rowKey: 'statusDesc' },
        { id: 5, fullName: t('dict.prOrderStatus.5'), theme: 'green', rowKey: 'statusDesc' },
        { id: 6, fullName: t('dict.prOrderStatus.6'), theme: 'green', rowKey: 'statusDesc' },
        { id: 7, fullName: t('dict.prOrderStatus.7'), theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    width: 110,
  },
  {
    title: 'PR来源',
    field: 'orderTypeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: 'PR单号',
    field: 'prOrderNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '是否公开',
    field: 'isOpen',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isOpen',
      props: {
        api: () => baseStore.getDictionaryData('isOpen'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 2, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 90,
    i18nField: 'isOpenDes',
  },
  {
    title: '计划使用日期',
    field: 'planUseDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 140,
    titleSuffix: {
      content: '超过该日期，独占物料会被释放',
    },
  },
  {
    title: '独占物料说明',
    field: 'onlyMaterialDes',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '当前处理人',
    field: 'currentProcessorName',
    width: 120,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: '节点记录',
    field: 'nodeRecords',
    slots: { default: 'nodeRecords' },
    width: 100,
  },
  {
    title: '项目',
    field: 'project',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 80,
  },
  {
    title: '项目阶段',
    field: 'projectStageName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 90,
  },
  {
    title: '成本分类',
    field: 'costCategory',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 90,
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: '名称',
    field: 'name',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 70,
  },
  {
    title: '采购周期(天)',
    field: 'purchaseCycle',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 130,
  },
  {
    title: '单位',
    field: 'unit',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 70,
  },
  {
    title: '半成品及成品折算',
    field: 'conversion',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '最小请购MOQ',
    field: 'moq',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '库存',
    field: 'stock',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: 'OPEN PO',
    field: 'openPO',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 110,
    cellRender: {
      name: 'Number',
    },
  },
  // {
  //   title: '总需求量',
  //   field: 'totalDemand',
  //   width: 160,
  // },
  {
    title: 'N周需求量',
    field: 'nWeekDemand',
    width: 90,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '本周需求量',
    field: 'weekDemand',
    width: 90,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '申请数量',
    field: 'purchaseQuantity',
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '时间',
    field: 'time',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    children: [],
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '请购原因',
    field: 'purchaseReason',
    width: 80,
  },
  {
    title: '请购逻辑',
    field: 'purchaseLogic',
    width: 80,
  },
  {
    title: '供应商',
    field: 'supplierName',
    width: 120,
  },
  {
    title: '未清PO',
    field: 'unclearPO',
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '近4周出货均值',
    field: 'fourWeekAvg',
    width: 110,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '周转',
    field: 'turnover',
    width: 70,
  },
  {
    title: '类型',
    field: 'type',
    width: 80,
  },
  {
    title: 'VMI',
    field: 'vmi',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 70,
  },
  {
    title: '采购员',
    field: 'purchaserName',
    width: 120,
  },
  {
    title: 'PMC主管',
    field: 'pmcSupervisorName',
    width: 120,
  },
  {
    title: 'PMC经理',
    field: 'pmcManagerName',
    width: 120,
  },
  {
    title: '运营经理',
    field: 'opsManagerName',
    width: 120,
  },
  {
    title: '运营总监',
    field: 'opsDirectorName',
    width: 120,
  },
  {
    title: 'PC',
    field: 'pcName',
    width: 120,
  },
  {
    title: 'MC',
    field: 'mcName',
    width: 120,
  },
  {
    title: '备注',
    field: 'remark',
    width: 100,
  },
];

export function getColumn(activeKey): any {
  let columnData = cloneDeep(column);
  if (activeKey == 'handled') {
    const nodeList = [
      {
        title: 'SAP_PR单号',
        field: 'sapPrOrderNo',
        filters: [{ data: '' }],
        filterRender: {
          name: 'Input',
        },
        width: 120,
      },
    ];
    columnData.splice(3, 0, ...nodeList);
  }
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 50 });
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

export const EditColumn: any[] = [
  {
    title: '是否公开',
    field: 'isOpen',
    width: 100,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'isOpenDes',
      props: {
        api: () => baseStore.getDictionaryData('isOpen', true),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '工厂',
    field: 'factoryArea',
    width: 110,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'factoryAreaName',
      props: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
  },
  {
    title: '计划使用日期',
    field: 'planUseDate',
    width: 130,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
      },
    },
  },
  {
    title: '独占物料说明',
    field: 'onlyMaterialDes',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    width: 140,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getQuantitationApplyDetailByMaterial,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'innerMaterialCode',
        },
        resultField: 'data',
        labelField: 'InsidePartNumber',
        valueField: 'InsidePartNumber',
        immediate: false,
      },
    },
    // i18nField: 'CommonCol.insidePartNumber',
  },
  // 文档上无字段，原型上有，先不加
  // {
  //   title: '材料类型',
  //   field: 'pdUserName',
  //   width: 140,
  //   editRender: {
  //     name: 'Input',
  //   },
  // },
  // 文档上无字段，原型上有，先不加
  // {
  //   title: '材料属性',
  //   field: 'successTime',
  //   width: 140,
  //   editRender: {
  //     name: 'Input',
  //   },
  // },
  // {
  //   title: '生产类型',
  //   field: 'produceType',
  //   width: 140,
  //   editRender: {
  //     name: 'Input',
  //   },
  // },
  {
    title: '项目',
    field: 'project',
    width: 70,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '项目阶段',
    field: 'projectStage',
    width: 90,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'projectStageName',
      props: {
        api: () => baseStore.getDictionaryData('MRPProjectStage', true),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '成本分类',
    field: 'costCategory',
    width: 90,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    width: 100,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    width: 90,
    editRender: {
      name: 'Input',
    },
  },

  {
    title: '名称',
    field: 'name',
    width: 70,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '采购周期(天)',
    field: 'purchaseCycle',
    width: 110,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '单位',
    field: 'unit',
    width: 70,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '半成品及成品折算',
    field: 'conversion',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '最小请购MOQ',
    field: 'moq',
    width: 120,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '库存',
    field: 'stock',
    width: 70,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: 'OPEN PO',
    field: 'openPO',
    width: 90,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: 'N周需求量',
    field: 'nWeekDemand',
    width: 110,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '本周需求量',
    field: 'weekDemand',
    width: 100,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '申请数量',
    field: 'purchaseQuantity',
    width: 100,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '时间',
    field: 'time',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    children: [],
  },
  // {
  //   title: '客户要求交期',
  //   field: 'customerRequireDelivery',
  //   width: 140,
  //   editRender: {
  //     name: 'DatePicker',
  //     props: {
  //       format: 'YYYY-MM-DD',
  //       valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
  //     },
  //   },
  // },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    width: 140,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
      },
    },
  },
  {
    title: '请购原因',
    field: 'purchaseReason',
    width: 100,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '请购逻辑',
    field: 'purchaseLogic',
    width: 100,
    editRender: {
      name: 'Input',
    },
  },
  // {
  //   title: '供应商',
  //   field: 'supplierId',
  //   width: 140,
  //   editRender: {
  //     name: 'Input',
  //   },
  // },
  {
    title: '供应商',
    field: 'supplierId',
    width: 130,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'supplierName',
      props: {
        api: getSupplierlist,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        immediate: true,
      },
    },
    // i18nField: 'InsideProjectCode',
  },
  {
    title: '未清PO',
    field: 'unclearPO',
    width: 80,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '近4周出货均值',
    field: 'fourWeekAvg',
    width: 120,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '周转',
    field: 'turnover',
    width: 80,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '类型',
    field: 'type',
    width: 80,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: 'VMI',
    field: 'vmi',
    width: 70,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'vmiName',
      props: {
        api: () => baseStore.getDictionaryData('YesOrNo', true),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '采购员',
    field: 'purchaser',
    width: 130,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: 'PMC主管',
    field: 'pmcSupervisor',
    width: 130,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: 'PMC经理',
    field: 'pmcManager',
    width: 130,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '运营经理',
    field: 'opsManager',
    width: 140,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '运营总监',
    field: 'opsDirector',
    width: 130,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '备注信息',
    field: 'remark',
    width: 100,
    editRender: {
      name: 'Input',
    },
  },
];
export const getEditColumn = type => {
  let columnData = cloneDeep(EditColumn);
  if (type == 'add') {
    columnData.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  if (type == 'edit') {
    columnData.splice(0, 0, {
      title: 'PR来源',
      field: 'orderTypeName',
      width: 95,
    });
  }
  return columnData;
};

export const editRules = {
  // 是否公开
  isOpen: [{ required: true, message: t('common.required') }],
  // 工厂
  factoryArea: [{ required: true, message: t('common.required') }],
  // 计划使用日期
  planUseDate: [{ required: true, message: t('common.required') }],
  // 独占物料说明
  onlyMaterialDes: [{ required: true, message: t('common.required') }],
  // 产品内部料号
  innerMaterialCode: [{ required: true, message: t('common.required') }],
  // 生产类型
  // produceType: [{ required: true, message: t('common.required') }],
  // 最小请购MOQ
  // moq: [{ required: true, message: t('common.required') }],
  // N周需求量(改成总需求)
  // totalDemand: [{ required: true, message: t('common.required') }],
  nWeekDemand: [{ required: true, message: t('common.required') }],
  // 申请数量
  purchaseQuantity: [{ required: true, message: t('common.required') }],
  // 客户要求交期
  customerRequireDelivery: [{ required: true, message: t('common.required') }],
  // 要求供应商交期
  requireSupplierDelivery: [{ required: true, message: t('common.required') }],
  // 请购原因
  purchaseReason: [{ required: true, message: t('common.required') }],
  // 请购逻辑
  purchaseLogic: [{ required: true, message: t('common.required') }],
  // 供应商
  supplierId: [{ required: true, message: t('common.required') }],
  // 采购员
  purchaser: [{ required: true, message: t('common.required') }],
  // PMC主管
  pmcSupervisor: [{ required: true, message: t('common.required') }],
  // PMC经理
  pmcManager: [{ required: true, message: t('common.required') }],
  // 运营经理
  opsManager: [{ required: true, message: t('common.required') }],
  // 运营总监
  opsDirector: [{ required: true, message: t('common.required') }],
};

export const PR_TABLE_ROW_DATA = {
  isOpen: '',
  factoryArea: '',
  planUseDate: '',
  onlyMaterialDes: '',
  innerMaterialCode: '',
  // produceType: '',
  project: '',
  projectStage: '',
  costCategory: '',
  originalModel: '',
  materialSpecs: '',
  name: '',
  purchaseCycle: '',
  unit: '',
  conversion: '',
  moq: '',
  stock: '',
  openPO: '',
  totalDemand: '',
  weekDemand: '',
  purchaseQuantity: '',
  // customerRequireDelivery: '',
  requireSupplierDelivery: '',
  purchaseReason: '',
  purchaseLogic: '',
  supplierId: '',
  unclearPO: '',
  fourWeekAvg: '',
  turnover: '',
  type: '',
  vmi: '',
  purchaser: '',
  purchaseRemark: '',
  pmcSupervisor: '',
  pmcManager: '',
  opsManager: '',
  opsDirector: '',
  remark: '',
};
export const assignBOMColumn = [
  {
    title: '是否启用',
    field: 'documentNumber',
    width: 80,
  },
  {
    title: '是否默认',
    field: 'documentNumber',
    width: 80,
  },
  {
    title: '产品内部料号',
    field: 'documentNumber',
    width: 200,
  },
  {
    title: '申请数量',
    field: 'documentNumber',
    editRender: {
      name: 'InputNumber', // input编辑模式
      min: 0,
      thousands: true,
    },
    width: 120,
  },
];

export const allocateMaterialsColumn = [
  {
    title: '内部料号',
    field: 'documentNumber',
    width: 150,
  },
  {
    title: '对应产品内部料号',
    field: 'documentNumber',
    width: 150,
  },
  {
    title: '对应PC',
    field: 'documentNumber',
    width: 120,
  },
  {
    title: '对应MC',
    field: 'documentNumber',
  },
  {
    title: '申请数量',
    field: 'documentNumber',
  },
  {
    title: '已占用数量',
    field: 'documentNumber',
  },
  {
    title: '调配数量',
    field: 'documentNumber',
    editRender: {
      name: 'InputNumber', // input编辑模式
      min: 0,
      thousands: true,
    },
    width: 120,
  },
];

export const releaseMaterialsColumn = [
  {
    title: '内部料号',
    field: 'innerMaterialCode',
  },
  {
    title: 'PR单号',
    field: 'prOrderNo',
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
  },
];

export const planUseDateColumn = [
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: 140,
  },
  {
    title: 'PR单号',
    field: 'prOrderNo',
    width: 130,
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    width: 130,
  },
  {
    title: '原计划使用日期',
    field: 'planUseDate',
    i18nField: 'planUseDateOri',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 130,
  },
  {
    title: '修改计划使用日期',
    field: 'planUseDateNew',
    i18nField: 'planUseDateNew',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
      },
    },
  },
  {
    title: '延期说明',
    field: 'delayExplain',
    editRender: {
      name: 'Input',
    },
  },
];

export const planUseDateEditRules = {
  planUseDateNew: [{ required: true, message: t('common.required') }],
  delayExplain: [{ required: true, message: t('common.required') }],
};
