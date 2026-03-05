import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { getSupplierlist } from '/@/api/engineering/mould';
import dayjs from 'dayjs';
import { useBaseStore } from '/@/store/modules/base';
import { tipCont } from '../utils/constant';
const { t } = useI18n();
const baseStore = useBaseStore();

export const materialDemandPlanStatusList = [
  { id: 1, theme: 'gray', fullName: t('dict.MrpStatus.1'), rowKey: 'materialDemandPlanStatusDes' },
  { id: 2, theme: 'blue', fullName: t('dict.MrpStatus.2'), rowKey: 'materialDemandPlanStatusDes' },
  { id: 3, theme: 'green', fullName: t('dict.MrpStatus.3'), rowKey: 'materialDemandPlanStatusDes' },
  { id: 4, theme: 'green', fullName: t('dict.MrpStatus.4'), rowKey: 'materialDemandPlanStatusDes' },
  { id: 5, theme: 'blue', fullName: t('dict.MrpStatus.5'), rowKey: 'materialDemandPlanStatusDes' },
];

// 主页form配置
export function getFormSchema(type: string): any[] {
  const schemas: any = [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
      },
      defaultValue: dayjs(new Date()),
    },
    {
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
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
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
  ];
  if (type === 'masterList') {
    schemas.push({
      fieldName: 'status',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('MrpBillStatus'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: t('dict.CommonCol.status'),
      },
    });
  }
  return schemas;
}

// 主页表格column配置
const column: any = [
  {
    title: '数据状态',
    field: 'materialDemandPlanStatus',
    i18nField: 'orderStatus',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: materialDemandPlanStatusList,
    },
    width: 100,
  },
  {
    title: '状态',
    field: 'statusName',
    // sortable: true,
    width: 100,
    aqpFilter: {
      name: 'ApiSelect',
      searchField: 'status',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('MrpBillStatus'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: t('dict.CommonCol.status'),
      },
    },
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '工厂',
    field: 'factoryName',
    width: 120,
    aqpFilter: {
      enable: true,
      name: 'ApiSelect',
      searchField: 'factory',
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
        nameFormat: ['Code', '/', 'Name'],
        immediate: true,
      },
    },
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 200,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '采购周期(天)',
    field: 'purchaseCycle',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
    titleSuffix: {
      content: tipCont.purchaseCycle,
    },
    aqpFilter: {
      enable: true,
      name: 'InputNumber',
    },
  },
  {
    title: '单位',
    field: 'unit',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 60,
  },
  {
    title: '需求数量',
    field: 'requiredQty',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '申请数量',
    field: 'purchaseQuantity',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    cellRender: {
      name: 'Number',
    },
    titleSuffix: {
      content: tipCont.purchaseQuantity,
    },
  },
  {
    title: '库存',
    field: 'stock',
    // sortable: true,
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
    title: 'N周需求量',
    field: 'nWeekDemand',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '本期已申请数量',
    field: 'currentPeriodPurchaseQuantity',
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
    title: 'OPEN PO',
    field: 'openPO',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    titleSuffix: {
      content: tipCont.openPO,
    },
    aqpFilter: {
      enable: true,
      name: 'InputNumber',
    },
  },
  {
    title: '最小请购MOQ',
    field: 'moq',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'isBondedDes',
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: [
        { id: 0, fullName: t('common.no'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('common.yes'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 70,
  },
  {
    title: '客户要求交期',
    field: 'customerRequireDelivery',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    // sortable: true,
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
    title: '请购原因',
    field: 'purchaseReason',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
  },
  {
    title: '请购逻辑',
    field: 'purchaseLogic',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
  },
  {
    title: '供应商',
    field: 'supplierName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
  },
  {
    title: '采购员',
    field: 'purchaserName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: 'PR单号',
    field: 'prOrderNo',
    width: 120,
  },
  {
    title: 'PO单号',
    // sortable: true,
    field: 'poOrderNo',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: 'FC备注',
    field: 'fcRemark',
    width: 80,
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
    title: 'BOM',
    field: 'bom',
    width: 50,
  },
  {
    title: '材料类型',
    field: 'materialTypeName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 70,
  },
  // {
  //   title: '材料属性',
  //   field: 'materialAttrName',
  //   // filters: [{ data: '' }],
  //   // filterRender: {
  //   //   name: 'Input',
  //   // },
  //   // sortable: true,
  //   width: 140,
  // },
  {
    title: '生产类型',
    field: 'produceTypeName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 70,
    aqpFilter: {
      enable: true,
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('MRPProduceType', true),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '项目阶段',
    field: 'projectStageName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 90,
    aqpFilter: {
      enable: true,
      name: 'ApiSelect',
      cSharpType: 'int',
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
    title: '旧版内部料号',
    field: 'pnOld',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 130,
  },
  {
    title: '名称',
    field: 'name',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
  },
  {
    title: '成本分类',
    field: 'costCategory',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
  },
  {
    title: '终端客户料号',
    field: 'terminalCMC',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
  },
  {
    title: '项目',
    field: 'project',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 50,
  },
  {
    title: '半成品及成品折算',
    field: 'conversion',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
    aqpFilter: {
      enable: true,
      name: 'InputNumber',
    },
  },
  {
    title: '本周需求量',
    field: 'weekDemand',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '要求排产数',
    field: 'requirePPSCount',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '要求排产数更新记录',
    field: 'reqdLog',
    slots: { default: 'reqdLog' },
    width: 160,
    titleSuffix: {
      content: tipCont.reqdLog,
    },
  },
  {
    title: '未清PO',
    field: 'unclearPO',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '近4周出货均值',
    field: 'fourWeekAvg',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '周转',
    field: 'turnover',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 80,
    aqpFilter: {
      enable: true,
      name: 'InputNumber',
    },
  },
  {
    title: '类型',
    field: 'type',
    width: 80,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    titleSuffix: {
      content: '',
    },
  },
  {
    title: 'VMI',
    field: 'vmi',
    width: 60,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'vmiName' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'vmiName' },
      ],
    },
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '物料需求备注',
    field: 'remark',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 90,
  },
];

export function getColumn(activeKey): any {
  let columnData: any = cloneDeep(column);
  // masterList显示树形结构
  if (activeKey == 'masterList') {
    columnData.find(item => item.field === 'innerMaterialCode').treeNode = true;
  } else {
    const filterKey = [
      'statusName',
      'bom',
      'materialAttr',
      'requiredQty',
      'customerMaterialCode',
      'requirePPSCount',
      'updateRequirePPSCount',
      'time',
      'projectStageName',
      'costCategory',
      'terminalCMC',
      'project',
      'conversion',
      'moq',
      'nWeekDemand',
      'weekDemand',
      'stock',
      'openPO',
      'reqdLog',
      'turnover',
    ];
    columnData = columnData.filter(item => !filterKey.includes(item.field));
  }
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 40 });
  return columnData;
}

export const getEditColumn = activeKey => {
  let columns: any[] = [
    {
      title: '数据状态',
      field: 'materialDemandPlanStatus',
      i18nField: 'orderStatus',
      cellRender: {
        name: 'Tag',
        options: materialDemandPlanStatusList,
      },
      width: 100,
    },
    {
      title: 'PO单号',
      field: 'poOrderNo',
      width: 120,
    },
    {
      title: 'PR单号',
      field: 'prOrderNo',
      width: 120,
    },
    {
      title: 'BOM',
      field: 'bom',
      width: 50,
      // i18nField: 'CommonCol.oldMoldNo',
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialCode',
      width: 200,
    },
    {
      title: '材料类型',
      field: 'materialTypeName',
      width: 70,
    },
    // {
    //   title: '材料属性',
    //   field: 'materialAttr',
    //   width: 140,
    // },
    {
      title: '生产类型',
      field: 'produceTypeName',
      width: 70,
    },
    {
      title: '项目',
      field: 'project',
      width: 50,
    },
    {
      title: '项目阶段',
      field: 'projectStage',
      i18nField: 'projectStageName',
      width: 140,
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
      width: 100,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '终端客户料号',
      field: 'terminalCMC',
      width: 100,
    },
    {
      title: '原厂商型号',
      field: 'manufModel',
      width: 120,
    },
    {
      title: '材料规格',
      field: 'materialSpecs',
      width: 120,
    },
    {
      title: '名称',
      field: 'name',
      width: 100,
    },
    {
      title: '采购周期(天)',
      field: 'purchaseCycle',
      width: 120,
      editRender: {
        name: 'InputNumber',
      },
    },
    {
      title: '单位',
      field: 'unit',
      width: 60,
    },
    {
      title: '半成品及成品折算',
      field: 'conversion',
      width: 120,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '最小请购MOQ',
      field: 'moq',
      width: 140,
      editRender: {
        name: 'InputNumber',
        min: 0,
        thousands: true,
      },
    },
    {
      title: 'N周需求量',
      field: 'nWeekDemand',
      width: 140,
      editRender: {
        name: 'InputNumber',
        min: 0,
        thousands: true,
      },
    },
    {
      title: '本周需求量',
      field: 'weekDemand',
      width: 120,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '库存',
      field: 'stock',
      width: 80,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: 'OPEN PO',
      field: 'openPO',
      width: 80,
      aqpFilter: {
        enable: true,
        name: 'InputNumber',
      },
    },
    {
      title: '要求排产数',
      field: 'requirePPSCount',
      width: 80,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '更新后的要求排产数',
      field: 'updateRequirePPSCount',
      width: 140,
      aqpFilter: {
        enable: true,
        name: 'InputNumber',
      },
    },
    {
      title: '申请数量',
      field: 'purchaseQuantity',
      width: 80,
      cellRender: {
        name: 'Number',
      },
      // editRender: {
      //   name: 'InputNumber',
      //   min: 0,
      //   thousands: true,
      // },
    },
    {
      title: '本期已申请数量',
      field: 'currentPeriodPurchaseQuantity',
      width: 120,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: 'FC备注',
      field: 'fcRemark',
      width: 80,
    },
    {
      title: '时间',
      field: 'time',
      children: [],
    },
    {
      title: '客户要求交期',
      field: 'customerRequireDelivery',
      width: 140,
      editRender: {
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
        },
      },
    },
    {
      title: '要求供应商交期',
      field: 'requireSupplierDelivery',
      width: 140,
      editRender: {
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
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
    {
      title: '供应商',
      field: 'supplierId',
      i18nField: 'supplierName',
      width: 100,
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
      width: 100,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '周转',
      field: 'turnover',
      width: 80,
    },
    {
      title: '类型',
      field: 'type',
      // editRender: {
      //   name: 'ASelect',
      //   cacheField: 'isRubberPartDesc',
      //   props: {
      //     fieldNames: {
      //       label: 'fullName',
      //       value: 'enCode',
      //     },
      //     options: [
      //       { fullName: '是', enCode: 1 },
      //       { fullName: '否', enCode: 0 },
      //     ],
      //   },
      // },
      editRender: {
        name: 'Input',
      },
      width: 80,
    },
    {
      title: 'VMI',
      field: 'vmi',
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
      width: 60,
    },
    {
      title: '物料需求备注',
      field: 'remark',
      editRender: {
        name: 'Input',
      },
      width: 90,
    },
  ];
  // masterList显示树形结构和更多字段
  if (activeKey !== 'masterList') {
    const filterKey = ['bom', 'materialAttr', 'customerMaterialCode', 'requirePPSCount', 'updateRequirePPSCount', 'currentPeriodPurchaseQuantity', 'type'];
    columns = columns.filter(item => !filterKey.includes(item.field));
  }
  return columns;
};

export const releasePRColumn = [
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
    title: '计划使用日期',
    field: 'planUseDate',
    width: 120,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        dynamicDisabled: row => {
          return row.isOpen === 1;
        },
      },
    },
  },
  {
    title: '独占物料说明',
    field: 'onlyMaterialDes',
    width: 140,
    editRender: {
      name: 'Input',
      props: {
        dynamicDisabled: row => {
          return row.isOpen === 1;
        },
      },
    },
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    width: 200,
  },
  {
    title: '数据状态',
    field: 'materialDemandPlanStatus',
    cellRender: {
      name: 'Tag',
      options: materialDemandPlanStatusList,
    },
    width: 100,
  },
  {
    title: '材料类型',
    field: 'materialTypeName',
    width: 70,
  },
  {
    title: '生产类型',
    field: 'produceTypeName',
    width: 70,
  },
  {
    title: '项目',
    field: 'project',
    width: 50,
  },
  {
    title: '项目阶段',
    field: 'projectStage',
    width: 140,
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
    width: 100,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '终端客户料号',
    field: 'terminalCMC',
    width: 100,
  },
  {
    title: '原厂商型号',
    field: 'manufModel',
    width: 120,
  },
  {
    title: '材料规格',
    field: 'materialSpecs',
    width: 120,
  },
  {
    title: '名称',
    field: 'name',
    width: 100,
  },
  {
    title: '采购周期(天)',
    field: 'purchaseCycle',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '单位',
    field: 'unit',
    width: 60,
  },
  {
    title: '半成品及成品折算',
    field: 'conversion',
    width: 120,
  },
  {
    title: '最小请购MOQ',
    field: 'moq',
    width: 140,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: 'N周需求量',
    field: 'nWeekDemand',
    width: 120,
    editRender: {
      name: 'InputNumber',
      min: 0,
      thousands: true,
    },
  },
  {
    title: '本周需求量',
    field: 'weekDemand',
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '库存',
    field: 'stock',
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: 'OPEN PO',
    field: 'openPO',
    width: 80,
  },
  {
    title: '申请数量',
    field: 'purchaseQuantity',
    width: 80,
    cellRender: {
      name: 'Number',
    },
    // editRender: {
    //   name: 'InputNumber',
    //   min: 0,
    //   thousands: true,
    // },
  },
  {
    title: '本期已申请数量',
    field: 'currentPeriodPurchaseQuantity',
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '时间',
    field: 'time',
    children: [],
  },
  {
    title: '客户要求交期',
    field: 'customerRequireDelivery',
    width: 120,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    width: 130,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
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
  {
    title: '供应商',
    field: 'supplierId',
    width: 100,
    i18nField: 'InsideProjectCode',
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
        onChange: (v, data, { row }) => {
          row.supplierName = data.label;
        },
      },
    },
  },
  {
    title: '采购员',
    field: 'purchaser',
    width: 120,
    editRender: {
      cacheField: 'purchaserName',
      name: 'CustomUserSelect',
    },
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
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '周转',
    field: 'turnover',
    width: 80,
  },
  {
    title: 'VMI',
    field: 'vmi',
    width: 60,
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
    title: '类型',
    field: 'type',
    width: 80,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: 'PMC主管',
    field: 'pmcSupervisor',
    width: 160,
    editRender: {
      cacheField: 'pmcSupervisorName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: 'PMC经理',
    field: 'pmcManager',
    width: 160,
    editRender: {
      cacheField: 'pmcManagerName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '运营经理',
    field: 'opsManager',
    width: 160,
    editRender: {
      cacheField: 'opsManagerName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '运营总监',
    field: 'opsDirector',
    width: 160,
    editRender: {
      cacheField: 'opsDirectorName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '物料需求备注',
    field: 'remark',
    width: 90,
    editRender: {
      name: 'Input',
    },
  },
];

export const editRules = {
  isOpen: [{ required: true, message: t('common.required') }],
  planUseDate: [
    {
      validator: ({ row, cellValue }) => {
        const isSelf = row.isOpen === 2 && !cellValue;
        return isSelf ? new Error(t('common.required')) : Promise.resolve();
      },
    },
  ],
  onlyMaterialDes: [
    {
      validator: ({ row, cellValue }) => {
        const isSelf = row.isOpen === 2 && !cellValue;
        return isSelf ? new Error(t('common.required')) : Promise.resolve();
      },
    },
  ],
  // projectStage: [{ required: true, message: t('common.required') }],
  moq: [{ required: true, message: t('common.required') }],
  // purchaseQuantity: [{ required: true, message: t('common.required') }],
  // nWeekDemand: [{ required: true, message: t('common.required') }],
  nWeekDemand: [
    {
      validator: ({ row, cellValue }) => {
        const isSelf = row.materialType === 1 && !cellValue;
        return isSelf ? new Error(t('common.required')) : Promise.resolve();
      },
    },
  ],
  customerRequireDelivery: [{ required: true, message: t('common.required') }],
  requireSupplierDelivery: [{ required: true, message: t('common.required') }],
  purchaser: [{ required: true, message: t('common.required') }],
  pmcSupervisor: [{ required: true, message: t('common.required') }],
  pmcManager: [{ required: true, message: t('common.required') }],
  opsManager: [{ required: true, message: t('common.required') }],
  opsDirector: [{ required: true, message: t('common.required') }],
};
