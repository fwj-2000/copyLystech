import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { useBaseStore } from '/@/store/modules/base';
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
    {
      fieldName: 'project',
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
    width: 100,
    i18nField: 'urgentLevelName',
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
    // i18nField: 'urgentLevelName',
  },
  {
    title: '计划使用日期',
    field: 'planUseDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
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
  //
  {
    title: '当前处理人',
    field: 'currentProcessorName',
    width: 130,
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
    width: 80,
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
    width: 140,
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
    width: 110,
  },
  {
    title: '名称',
    field: 'name',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 90,
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
    width: 80,
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
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '本周需求量',
    field: 'weekDemand',
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '申请数量',
    field: 'purchaseQuantity',
    width: 90,
    cellRender: {
      name: 'Number',
    },
  },
  // {
  //   title: '时间',
  //   field: 'time',
  // sortable: true,
  // filters: [{ data: '' }],
  // filterRender: {
  //   name: 'Input',
  // },
  //   children: [],
  // },
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
    width: 110,
  },
  {
    title: '请购逻辑',
    field: 'purchaseLogic',
    width: 110,
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
    width: 80,
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
    width: 140,
  },
  {
    title: '采购申请备注',
    field: 'remark',
    width: 100,
  },
  {
    title: 'PMC主管',
    field: 'pmcSupervisorName',
    width: 140,
  },
  {
    title: 'PMC经理',
    field: 'pmcManagerName',
    width: 140,
  },
  {
    title: '运营经理',
    field: 'opsManagerName',
    width: 140,
  },
  {
    title: '运营总监',
    field: 'opsDirectorName',
    width: 140,
  },
  {
    title: 'PC',
    field: 'pcName',
    width: 140,
  },
  {
    title: 'MC',
    field: 'mcName',
    width: 140,
  },
];

export function getColumn(activeKey): any {
  let columnData = cloneDeep(column);

  // if (activeKey === 'pending') {
  //   const pendingFilterColumn = ['requiredBuildQty', 'updateRequiredBuildQty', 'purchaseQty', 'currentPRQty'];
  //   columnData = columnData.filter(item => !pendingFilterColumn.includes(item.field));
  // } else {
  //   const otherFilterColumn = ['allDemand', 'weekDemand'];
  //   columnData = columnData.filter(item => !otherFilterColumn.includes(item.field));
  // }
  // if (activeKey === 'masterList') {
  //   columnData.splice(2, 0, {
  //     title: 'BOM版本',
  //     field: 'oldMoldNo',
  //     width: 120,
  //   });
  // }
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 50 });
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column);
}

export const getEditColumn = (type?) => {
  const columns: any[] = [
    {
      title: '是否公开',
      field: 'documentNumber',
      width: 150,
      editRender: {
        name: 'ASelect',
        cacheField: 'isRubberPartDesc',
        props: {
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          options: [
            { fullName: '是', enCode: 1 },
            { fullName: '否', enCode: 2 },
          ],
        },
      },
    },
    {
      title: '产品内部料号',
      field: 'projectName',
      width: 150,
    },

    {
      title: '物料类型',
      field: 'pdUserName',
      width: 140,
    },
    {
      title: '材料属性',
      field: 'successTime',
      width: 140,
    },
    {
      title: '生产类型',
      field: 'pdUserName',
      width: 140,
    },
    {
      title: '项目名称',
      field: 'pdUserName',
      width: 180,
    },
    {
      title: '项目阶段',
      field: 'projectStage',
      width: 120,
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '成本分类',
      field: 'pdUserName',
      width: 180,
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '客户料号',
      field: 'pdUserName',
      width: 160,
    },
    {
      title: '原厂商型号',
      field: 'pdUserName',
      width: 200,
    },

    {
      title: '材料规格',
      field: 'status',
      width: 160,
    },
    {
      title: '名称',
      field: 'status',
      width: 160,
    },
    {
      title: '采购周期(天)',
      field: 'status',
      width: 160,
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '半成品及成品折算',
      field: 'status',
      width: 160,
    },
    {
      title: '最小请购MOQ',
      field: 'minMOQ',
      width: 160,
      // editRender: {
      //   name: 'Input',
      // },
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: 'N周需求量',
      field: 'weekDemand',
      width: 160,
      // editRender: {
      //   name: 'Input',
      // },
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '本周需求量',
      field: 'status',
      width: 160,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '库存',
      field: 'status',
      width: 160,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: 'OPEN PO',
      field: 'status',
      width: 160,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '要求排产数',
      field: 'status',
      width: 160,
    },
    {
      title: '更新后的要求排产数',
      field: 'status',
      width: 200,
    },
    {
      title: '申请数量',
      field: 'purchaseNumber',
      width: 160,
      // editRender: {
      //   name: 'Input', // input编辑模式
      // },
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '本期已申请数量',
      field: 'status',
      width: 160,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '备库存',
      field: 'status',
      width: 160,
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
      field: 'requiredDate',
      width: 160,
      // editRender: {
      //   name: 'DatePicker',
      //   props: {
      //     format: 'YYYY-MM-DD',
      //     valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
      //   },
      // },
    },
    {
      title: '要求供应商交期',
      field: 'supplierDueDate',
      width: 160,
      // editRender: {
      //   name: 'DatePicker',
      //   props: {
      //     format: 'YYYY-MM-DD',
      //     valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
      //   },
      // },
    },
    {
      title: '请购原因',
      field: 'purchaseReason',
      width: 160,
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '请购逻辑',
      field: 'purchaseluoji',
      width: 160,
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '供应商',
      field: 'factory',
      width: 160,
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '未清PO',
      field: 'status',
      width: 160,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '近4周出货均值',
      field: 'status',
      width: 160,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '周转',
      field: 'status',
      width: 160,
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
    },
    {
      title: 'VMI',
      field: 'VMI',
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
    },
    {
      title: '备注信息',
      field: 'pdUserName',
      // editRender: {
      //   name: 'Input',
      // },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
  return columns;
};

export const editRules = {
  projectStage: [{ required: true, message: t('common.required') }],
  minMOQ: [{ required: true, message: t('common.required') }],
  weekDemand: [{ required: true, message: t('common.required') }],
  purchaseNumber: [{ required: true, message: t('common.required') }],
  requiredDate: [{ required: true, message: t('common.required') }],
  supplierDueDate: [{ required: true, message: t('common.required') }],
  purchaseReason: [{ required: true, message: t('common.required') }],
  purchaseluoji: [{ required: true, message: t('common.required') }],
  factory: [{ required: true, message: t('common.required') }],
  type: [{ required: true, message: t('common.required') }],
  VMI: [{ required: true, message: t('common.required') }],
  isPublic: [{ required: true, message: t('common.required') }],
};

export const PR_TABLE_ROW_DATA = { documentNumber: '' };
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
    width: 120,
  },
];
