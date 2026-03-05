import { BasicColumn, FormProps } from '/@/components/Table';
import { getMaterialCodeList } from '/@/api/finance/materialPrice';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();
const { t } = useI18n();

export function getUnReviewColumns(): BasicColumn[] {
  return [
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      width: 200,
    },
    {
      title: '需求单号',
      dataIndex: 'originCode',
      width: 240,
    },
    {
      title: '需求类型',
      dataIndex: 'demandTypeName',
      width: 120,
    },
    {
      title: '脱敏图纸',
      dataIndex: 'desensitizedDrawingsName',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 160,
    },
    {
      title: '当前节点',
      dataIndex: 'reviewNodeName',
      width: 160,
    },
    {
      title: '当前处理人',
      dataIndex: 'handlerName',
      width: 220,
    },
    {
      title: '申请人',
      dataIndex: 'originApplyUserName',
      width: 220,
    },
    {
      title: '内部项目代码',
      dataIndex: 'insideProjectCode',
      width: 160,
    },
    {
      title: '终端客户料号',
      dataIndex: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      width: 220,
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 220,
    },
  ];
}

export function getUnReviewFormConfig(): Partial<FormProps> {
  return {
    schemas: [
      {
        label: '',
        field: 'originCode',
        component: 'Input',
        componentProps: {
          placeholder: '单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'insidePartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'factory',
        component: 'Input',
        componentProps: {
          placeholder: '工厂',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'time',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          submitOnPressEnter: true,
          placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
        },
      },
      {
        label: '',
        field: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'immediateCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户料号',
          submitOnPressEnter: true,
        },
      },
      // {
      //   label: '',
      //   field: 'insideProjectCode',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: 'PD',
      //     submitOnPressEnter: true,
      //   },
      // },
    ],
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
      transferRange: ['placeholder'],
    },
    // fieldMapToTime: [['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],]
  };
}
export function getReviewUnReviewFormConfig(): Partial<FormProps> {
  return {
    schemas: [
      {
        label: '',
        field: 'originCode',
        component: 'Input',
        componentProps: {
          placeholder: '单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'insidePartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'factory',
        component: 'Input',
        componentProps: {
          placeholder: '工厂',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'demandType',
        component: 'ApiSelect',
        i18nField: 'demandTypeName',
        componentProps: {
          placeholder: '需求类型',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('DemandTypeEnum'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        label: '',
        field: 'time',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          submitOnPressEnter: true,
          placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
        },
      },
      {
        label: '',
        field: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'immediateCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'handlerName',
        component: 'Input',
        componentProps: {
          placeholder: '当前处理人',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'creatorUserName',
        component: 'Input',
        componentProps: {
          placeholder: 'PD',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'docType',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '资料类型',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      // {
      //   label: '',
      //   field: 'insideProjectCode',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: 'PD',
      //     submitOnPressEnter: true,
      //   },
      // },
    ],
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
      transferRange: ['placeholder'],
    },
    // fieldMapToTime: [['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],]
  };
}

export function getCheckUnReviewFormConfig(): Partial<FormProps> {
  return {
    baseColProps: {
      span: 4,
    },
    autoAdvancedLine: 1,
    schemas: [
      {
        label: '',
        field: 'insidePartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'immediateCustomerCode',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户名称',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'immediateCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'creatorUserName',
        component: 'Input',
        componentProps: {
          placeholder: 'PD',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'handlerName',
        component: 'Input',
        componentProps: {
          placeholder: '当前处理人',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'docType',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '资料类型',
          // options: [
          //   { fullName: 'PCC', enCode: '1' },
          //   { fullName: '工程图纸', enCode: '2' },
          // ],
          api: () => {
            return baseStore.getDictionaryData('EngineeringDocApply.DocType');
          },
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
      },
      {
        label: '',
        field: 'status',
        component: 'Select',
        componentProps: {
          placeholder: '请选择状态',
          options: [
            { fullName: '待处理', id: 1 },
            { fullName: '撤回', id: 2 },
            { fullName: '驳回', id: 3 },
          ],
        },
      },
    ],
    i18nConfig: {
      moduleCode: 'PCCColumn',
      transferRange: ['placeholder'],
    },
  };
}

export function getPackageColumns(): BasicColumn[] {
  return [
    {
      title: '包材料号',
      dataIndex: 'partNumber',
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: getMaterialCodeList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'materialCode',
        valueField: 'materialCode',
        // notFoundContent: null,
        immediate: true,
        placeholder: '包材料号',
        onChange: (_, data, record) => {
          if (!data) return;
          console.log(data);
          const { materialName, materialType, purchaseUnit } = data;
          const { editValueRefs } = record;
          editValueRefs.description = materialName;
          editValueRefs.type = materialType;
          editValueRefs.unit = purchaseUnit;
        },
      },
      editRow: true,
      width: 180,
    },
    {
      title: '描述',
      dataIndex: 'description',
      editRow: true,
      editComponentProps: {
        placeholder: '自动带入',
      },
      width: 200,
    },
    {
      title: '包材类型',
      dataIndex: 'type',
      editRow: true,
      editComponentProps: {
        placeholder: '包材类型',
      },
      width: 100,
    },
    {
      title: '用量/KPCS',
      dataIndex: 'useQty',
      editRow: true,
      editComponent: 'InputNumber',
      editComponentProps: {
        placeholder: '用量/KPCS',
      },
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      editRow: true,
      editDynamicDisabled: true,
      editComponentProps: {
        placeholder: '自动带入',
      },
      width: 100,
    },
  ];
}

export function getChangeHistoryColumns(): BasicColumn[] {
  return [
    {
      title: '版本',
      dataIndex: 'version',
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      width: 80,
    },
    {
      title: '变更日期',
      dataIndex: 'creatorTime',
      format: 'date|YYYY-MM-DD',
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      width: 180,
    },
    {
      title: '变更记录',
      dataIndex: 'revisionRemark',
      editComponent: 'Input',
      editRow: true,
      editComponentProps: {
        placeholder: t('dict.PCCColumn.revisionRemark'),
      },
    },
  ];
}

export const materialRowData = {
  stepDistanceNumber: 1,
  eightCode: '',
  width: '',
  originPartNumber: '',
  partNumber: null,
  processCode: null,
  shippingMaterial: null,
  description: '',
  useQtyMultiple: 1,
  color: '',
  useQty: '',
  unit: 'M',
  wholeLength: '',
  wholeWidth: '',
  utilizationRate: '',
  metersTenHour: '',
  remark: '',
  onEdit: true,
  editable: true,
  disabled: {
    partNumber: true,
    description: true,
    color: true,
    useQty: true,
    utilizationRate: true,
    metersTenHour: true,
  },
};

export const basePackageRowData = {
  type: null,
  packQty: '',
  unit: 'PCS/个',
  partNumber: '',
  description: '',
  useQtyMultiple: 1,
  useQty: '',
  packUnit: 'PCS',
  onEdit: true,
  editable: true,
  disabled: {
    unit: true,
    useQty: true,
  },
};
export const customPackageRowData = {
  type: 'CoreRoll',
  typeName: t('common.coreRoll'),
  packQty: '',
  unit: 'PCS',
  eightCode: '',
  width: '',
  partNumber: '',
  description: '',
  useQtyMultiple: 1,
  useQty: '',
  packUnit: 'PCS',
  onEdit: true,
  editable: true,
  disabled: {
    type: true,
    unit: true,
    partNumber: true,
    useQty: true,
  },
};

export function getOriginFormConfig(): Partial<FormProps> {
  return {
    baseColProps: {
      span: 4,
    },
    autoSetSpanInObject: true,
    schemas: [
      {
        field: 'originCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '需求单号',
        },
      },
      {
        label: '',
        field: 'demandType',
        i18nField: 'demandTypeName',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '需求类型',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('DemandTypeEnum'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        field: 'insidePartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
        },
      },
      {
        field: 'factoryName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '工厂',
        },
      },
      {
        field: 'applyUserName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: 'PD',
        },
      },
      {
        field: 'terminalCustomerPartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
        },
      },
      {
        field: 'immediateCustomerPartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户料号',
        },
      },
    ],
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
      transferRange: ['placeholder'],
    },
  };
}

export const technologyRowData = {
  processCode: null,
  processName: null,
  adjustmentTime: 0,
  speed: null,
  speedUnit: null,
  defectRate: 0,
  capacity: '',
  capacityUnit: 'K/H',
  isMain: 0,
  manualPackagingList: [
    {
      qty: '',
      unit: '',
    },
  ],
  imageList: [],
  onEdit: true,
  editable: true,
  disabled: {
    speed: true,
    speedUnit: true,
  },
};

export function originGetColumns(): BasicColumn[] {
  return [
    {
      title: '需求单号',
      dataIndex: 'originCode',
      width: 220,
    },
    {
      title: '需求类型',
      dataIndex: 'demandTypeName',
      width: 120,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 80,
      customRender: ({ text }) => {
        if (typeof text == 'number') {
          return `T${text}`;
        } else {
          return '/';
        }
      },
    },
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      width: 220,
    },
    // {
    //   title: "状态",
    //   dataIndex: "status",
    //   format: 'tag|'+JSON.stringify(STATUS_OPTIONS),
    //   width: 220
    // },
    // {
    //   title: '当前处理人',
    //   dataIndex: 'handlerName',
    //   width: 220,
    // },
    // {
    //   title: "当前节点",
    //   dataIndex: "originCode",
    //   width: 220
    // },
    // {
    //   title: "节点记录",
    //   dataIndex: "nodeDetail",
    //   width: 220
    // },
    // {
    //   title: '资料类型',
    //   dataIndex: 'docType',
    // },
    // {
    //   title: '版本',
    //   dataIndex: 'version',
    //   customRender: ({ text }) => {
    //     if (typeof text == 'number') {
    //       return `T${text}`;
    //     } else {
    //       return '/';
    //     }
    //   },
    //   width: 80,
    // },
    {
      title: '工厂',
      dataIndex: 'factoryName',
    },
    {
      title: '当前处理人',
      dataIndex: 'applyUserName',
      width: 220,
    },
    {
      title: '直接客户料号',
      dataIndex: 'immediateCustomerPartNumber',
      width: 180,
    },
    {
      title: '终端客户料号',
      dataIndex: 'terminalCustomerPartNumber',
      width: 180,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      width: 180,
    },
  ];
}

export const STATUS_OPTIONS = [
  { id: 1, fullName: '待提交', theme: 'gray', rowKey: 'statusDesc' },
  { id: 2, fullName: '处理中', theme: 'blue', rowKey: 'statusDesc' },
  { id: 3, fullName: '结案', theme: 'green', rowKey: 'statusDesc' },
  { id: 4, fullName: '撤回', theme: 'purple', rowKey: 'statusDesc' },
  { id: 5, fullName: '驳回', theme: 'yellow', rowKey: 'statusDesc' },
  { id: 6, fullName: '终止', theme: 'red', rowKey: 'statusDesc' },
];

export function calcUseQty(packQty, useQtyMultiple) {
  // 包材用量 = (1000/包装数量)*用量倍数
  const useQty = ((1000 / (packQty || 0)) * (useQtyMultiple || 0)).toFixed(5);
  return useQty;
}
