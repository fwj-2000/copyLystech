import { BasicColumn, FormProps, FormSchema } from '/@/components/Table';
import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import dayjs from 'dayjs';
import { useUserStore } from '/@/store/modules/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

export function getColumnsTodo(): any[] {
  return [
    {
      type: 'checkbox',
      width: 50,
    },
    {
      field: 'applyNo',
      title: '单号',
      width: 200,
    },
    {
      field: 'demandType',
      title: '需求类型',
      i18nField: 'CommonCol.demandType',
      width: 150,
    },
    {
      field: 'innerMaterialNumber',
      title: '产品内部料号',
      width: 200,
    },
    {
      title: '特殊备注',
      field: 'engineeringRemarks',
      width: 200,
      showOverflow: 'ellipsis',
      slots: {
        default: 'engineeringRemarks',
      },
    },
    {
      title: '量试订单评审',
      field: 'pdReview',
      slots: {
        default: 'pdReview',
      },
      width: 120,
    },
    {
      field: 'pdName',
      title: 'PD',
      i18nField: 'CommonCol.pd',
      editConfig: { enabled: false },
      width: 200,
    },
    {
      field: 'factory',
      title: '工厂',
      width: 160,
    },
    {
      field: 'status',
      title: '状态',
      i18nField: 'CommonCol.status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      field: 'currentNodeName',
      title: '当前节点',
      i18nField: 'CommonCol.currentNode',

      width: 160,
    },
    {
      field: 'currentProcessorId',
      title: '当前处理人',
      i18nField: 'CommonCol.currentNodeUser',
      formatter: ({ cellValue, row }) => row.currentProcessor || cellValue || '',
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect', props: { style: 'width: 200px' } },
      width: 220,
    },
    {
      field: 'nodeDetail',
      title: '节点记录',
      i18nField: 'CommonCol.nodeDetail',
      slots: {
        default: 'nodeDetail',
      },
      width: 120,
    },
    {
      field: 'peakQty',
      title: '需求数量(PCS)',
      width: 160,
    },
    {
      field: 'demandQty',
      title: '排产数量(PCS)',
      width: 160,
    },
    {
      field: 'requirementRegression',
      title: '要求材料回厂时间',
      width: 150,
      formatter: ({ cellValue }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
      },
    },
    {
      field: 'estimatedMaterialsTime',
      title: '预估材料交期',
      i18nField: 'estimatedMaterialsDateTime',
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
      },
      filters: [{ data: '' }],
      filterRender: {
        name: 'DateRange',
        searchField: ['estimatedMaterialsStartTime', 'estimatedMaterialsEndTime'],
      },
    },
    {
      field: 'pcRemark',
      title: '备注(量试计划)',
      width: 220,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      field: 'mcRemark',
      title: '备注(材料交期)',
      width: 220,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      field: 'applyUserName',
      title: '申请人',
      i18nField: 'CommonCol.applyUser',
      width: 220,
    },
    {
      field: 'applyDate',
      title: '申请时间',
      i18nField: 'CommonCol.applyTime',
      formatter: ({ cellValue }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    {
      field: 'action',
      title: '操作',
      width: 60,
      slot: true,
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getFormConfigTodo(todo?: boolean) {
  return {
    schema: [
      {
        label: '',
        fieldName: 'applyNo',
        component: 'Input',
        componentProps: {
          placeholder: '单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'innerMaterialNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'currentProcessorId',
        component: 'CustomUserSelect',
        i18nField: 'CommonCol.currentNodeUser',
        componentProps: {
          defaultValue: todo ? useUserStore().getUserInfo.userId : undefined,
          placeholder: '当前处理人',
        },
      },
    ],
    collapsed: false,
    showCollapseButton: false,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    i18nConfig: {
      moduleCode: 'QuantitativeDeliveryConfirmColumn',
      transferRange: ['placeholder'],
    },
  };
}

export function getColumns(): BasicColumn[] {
  return [
    {
      title: '单号',
      dataIndex: 'applyNo',
      width: 180,
    },
    {
      title: '产品内部料号',
      dataIndex: 'innerMaterialNumber',
      editRow: false,
      width: 200,
    },
    {
      title: '特殊备注',
      dataIndex: 'engineeringRemarks',
      width: 200,
    },
    {
      title: 'PD',
      dataIndex: 'pdName',
      i18nField: 'CommonCol.pd',
      editRow: false,
      width: 200,
    },
    {
      title: '直接客户料号',
      dataIndex: 'immediateCustomerPartNumber',
      editRow: false,
      width: 120,
    },
    {
      title: '终端客户料号',
      dataIndex: 'terminalCustomerPartNumber',
      editRow: false,
      width: 120,
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      editRow: false,
      width: 200,
    },
    {
      title: '需求数量(PCS)',
      dataIndex: 'peakQty',
      editRow: false,
      editDynamicDisabled: false,
      width: 120,
    },
    {
      title: '排产数量(PCS)',
      dataIndex: 'demandQty',
      width: 140,
    },
    {
      title: '要求材料回厂时间',
      dataIndex: 'requirementRegression',
      width: 150,
      format: 'date|YYYY-MM-DD',
    },
    {
      title: '预估材料交期',
      dataIndex: 'estimatedMaterialsTime',
      editRow: true,
      editComponent: 'DatePicker',
      editComponentProps: {
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
      },
      width: 140,
    },
    {
      title: '备注(材料交期)',
      dataIndex: 'mcRemark',
      editRow: true,
      editComponent: 'Input',
      width: 800,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      editRow: false,
      width: 200,
    },
  ];
}

export function getChangeHistoryColumns(): BasicColumn[] {
  return [
    {
      title: '版本',
      dataIndex: 'description',
      editComponentProps: {
        placeholder: '自动带入',
      },
      width: 80,
    },
    {
      title: '变更日期',
      dataIndex: 'description',
      editComponentProps: {
        placeholder: '自动带入',
      },
      width: 180,
    },
    {
      title: '变更记录',
      dataIndex: 'description',
      editRow: true,
      editComponentProps: {
        placeholder: '自动带入',
      },
    },
  ];
}

export function getMaterialColumns(): BasicColumn[] {
  return [
    {
      title: '步距组号',
      dataIndex: 'stepDistanceNumber',
      editRow: true,
      width: 80,
    },
    {
      title: '材料八码',
      dataIndex: 'shortMaterialCode',
      width: 100,
    },
    {
      title: '宽度(MM)',
      dataIndex: 'width',
      width: 100,
    },
    {
      title: '材料料号',
      dataIndex: 'originPartNumber',
      width: 180,
    },
    {
      title: '出货材料',
      dataIndex: 'shippingMaterials',
      width: 120,
    },
    {
      title: '备料信息',
      dataIndex: 'preparationMaterials',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'materialDesc',
      width: 200,
    },
    {
      title: '用量倍数',
      dataIndex: 'materialDosage',
      width: 80,
    },
    {
      title: '用量/KPCS',
      dataIndex: 'qty',
      width: 120,
    },
    {
      title: '工单用量(KPCS)',
      dataIndex: 'workOrderQty',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'purchaseUnit',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      i18nField: 'CommonCol.remark',
      editRow: true,
      width: 200,
    },
  ];
}

export const baseFormConfig: any = [
  {
    label: '单号',
    field: 'applyNo',
    component: 'Input',
    componentProps: {
      placeholder: '单号',
      disabled: true,
    },
  },
  {
    label: '工厂',
    field: 'factory',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      disabled: true,
    },
  },
  {
    label: '产品内部料号',
    field: 'innerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      disabled: true,
    },
  },
  // 生产工艺
  {
    label: '生产工艺',
    field: 'process',
    component: 'ApiSelect',
    componentProps: {
      placeholder: t('dict.PCCColumn.process'),
      api: () => {
        return baseStore.getDictionaryData('PCC.ProcessType', true);
      },
      labelField: 'fullName',
      valueField: 'enCode',
      disabled: true,
    },
  },
  {
    label: 'PD',
    field: 'pdName',
    i18nField: 'CommonCol.pd',
    component: 'Input',
    componentProps: {
      placeholder: 'PD',
      disabled: true,
    },
  },
  {
    label: '排产数量',
    field: 'demandQty',
    component: 'Input',
    componentProps: {
      placeholder: '排产数量',
      disabled: true,
    },
  },
  {
    label: '产品描述',
    field: 'productDesc',
    component: 'Input',
    componentProps: {
      placeholder: '产品描述',
      disabled: true,
    },
  },
  {
    label: '要求材料回厂时间',
    field: 'requirementRegression',
    component: 'Input',
    componentProps: {
      placeholder: '预估材料交期',
      disabled: true,
    },
  },
  {
    label: '预估材料交期',
    field: 'estimatedMaterialsTime',
    i18nField: 'estimatedMaterialsDateTime',
    component: 'Date',
    componentProps: {
      placeholder: '预估材料交期',
      disabled: true,
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    label: '备注(材料交期)',
    field: 'mcRemark',
    component: 'Input',
    componentProps: {
      placeholder: '备注(材料交期)',
      disabled: true,
    },
  },
  {
    label: '直接客户料号',
    field: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户料号',
      disabled: true,
    },
  },
  {
    label: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '终端客户料号',
      disabled: true,
    },
  },
];

/**
 * 导入预览列
 */
export const importPreviewColumn: any = [
  {
    title: '单号',
    dataIndex: 'applyNo',
    width: 200,
  },
  {
    title: '产品内部料号',
    dataIndex: 'innerMaterialNumber',
    width: 200,
  },
  {
    title: '预估材料交期',
    dataIndex: 'estimatedMaterialsTime',
    width: 120,
    format: 'date|YYYY-MM-DD',
  },
  {
    title: 'MC备注',
    dataIndex: 'mcRemark',
    width: 220,
  },
];
