import { getFactory } from '/@/api/engineering/newMateria';
import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { useBaseStore } from '/@/store/modules/base';
import { getMoldLedgerList } from '/@/api/warehouse/moIdBill';
import { getShipList } from '/@/api/common/basedata';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const schemaList = [
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      autocomplete: 'on',
      name: 'insidePartNumber',
    },
  },
  {
    fieldName: 'moldVersion',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '模具版本',
      api: getMoldLedgerList,
      showSearch: true,
      params: {
        type: 1,
        page: 20,
      },
      apiSearch: {
        show: false,
      },
      resultField: 'data',
      labelField: 'moldVersion',
      valueField: 'moldVersion',
    },
  },
  {
    fieldName: 'sapWorkOrder',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: 'SAP工单号',
      autocomplete: 'on',
      name: 'sapWorkOrder',
    },
  },
  {
    fieldName: 'factory',
    i18nField: 'factoryName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactory,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      valueField: 'Id',
      immediate: true,
      nameFormat: ['Code', '/', 'Name'],
    },
  },
];

const handleCols = [
  {
    title: '状态',
    field: 'status',
    i18nField: 'CommonCol.status',
    width: 120,
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'status',
      name: 'VxeSelect',
      options: getFlowStatus(),
    },
    cellRender: {
      name: 'Tag',
      options: getFlowStatus(),
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessorNames',
    width: 230,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      // searchField:'currentProcessorIds',
      // name: 'CustomUserSelect',
    },
  },
  { title: '当前节点', field: 'currentNodeName' },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 120,
    slots: {
      default: 'nodeDetail',
    },
  },
];
const endCols = [
  {
    title: '制单人',
    field: 'applyUserName',
    width: 230,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '申请时间',
    field: 'applyDate',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', width: 60, fixed: 'right', slots: { default: 'action' } },
];

// 通用表格配置
export const columns = () => {
  return [
    { type: 'checkbox', field: 'checkbox' },
    {
      title: '退模单号',
      field: 'moldRefundApplyNo',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      slots: {
        default: 'moldRefundApplyNo',
      },
      sortable: true,
      width: 120,
    },
    ...handleCols,
    { title: '产品内部料号', field: 'insidePartNumber', width: 200, sortable: true },
    { title: '模具料号', field: 'moldPartNumber', width: 120 },
    { title: '模具类型', field: 'moldTypeName', sortable: true },
    {
      title: '计划退回日期',
      field: 'plannedRefundDate',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 120,
    },
    { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true, width: 120 },
    { title: '机台位', field: 'machinePosition', width: 120 },
    { title: '单位', field: 'unit', width: 120 },
    { title: '数量', field: 'qty', width: 120 },
    { title: '工厂', field: 'factory', sortable: true },
    { title: '调入仓库', field: 'callShippingSpaceName', sortable: true },
    { title: '调出仓库', field: 'outShippingSpaceName', sortable: true },
    {
      title: '本次使用寿命(KPCS)',
      field: 'thisUseLife',
      editRender: {
        name: 'Input',
        componentProps: {
          disabled: true,
        },
      },
    },
    { title: '剩余寿命(KPCS)', field: 'remainingLife' },
    { title: '事务类型', field: 'affairsTypeName', sortable: true, width: 120 },
    { title: '仓管员', field: 'warehouseKeeperNames', sortable: true },
    { title: '退料人', field: 'refundMoldUserNames', minWidth: 350 },
    { title: '退料部门', field: 'refundDeptName' },
    { title: '临时单号', field: 'temporaryOrder', width: 120 },
  ];
};
// 待处理
export const columnsToHandle = () => {
  return [
    { type: 'checkbox', field: 'checkbox' },
    {
      title: '模具领用单号',
      field: 'moldReceiveApplyNo',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      sortable: true,
      width: 120,
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200, sortable: true },
    { title: '模具料号', field: 'moldPartNumber' },
    // { title: '模具状态', field: 'moldStatusName', sortable: true },
    { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true, width: 120 },
    { title: '领料人', field: 'receiveUserName', minWidth: 350 },
    { title: '机台位', field: 'machinePosition', width: 120 },
    { title: '审核人', field: 'reviewUserNames', sortable: true },
    { title: '剩余寿命(KPCS)', field: 'remainingLife', width: 120, aqpFilter: { cSharpType: 'int' } },
    {
      title: '剩余寿命百分比',
      field: 'remainingLifePercentage',
      formatter: ({ cellValue }) => `${cellValue * 100 || 0}%`,
      aqpFilter: { cSharpType: 'int' },
    },
    { title: '工厂', field: 'factory', sortable: true },
    {
      title: '领料部门',
      field: 'receiveDeptName',
    },
    { title: '仓管员', field: 'warehouseKeeperNames', sortable: true },
    { title: '事务类型', field: 'affairsTypeName', sortable: true },
    { title: '物料需求单号', field: 'materialDemandNo', sortable: true },
    { title: '调出仓库', field: 'outShippingSpaceName', sortable: true },
    { title: '调入仓库', field: 'callShippingSpaceName', sortable: true },
    { title: '单位', field: 'unit', width: 120 },
    { title: '数量', field: 'qty', width: 120, aqpFilter: { cSharpType: 'int' } },
    { title: '领退状态', field: 'receiveRefundStatusName', sortable: true, width: 120, aqpFilter: { cSharpType: 'int', searchField: 'receiveRefundStatus' } },
  ];
};

// 待提交
export const columnsToSubmit = () => {
  return columns();
};

// 已提交
export const columnsDone = () => {
  const _cols: any = columns();
  return _cols.concat(endCols);
};

const baseStore = useBaseStore();

// 新增模块
export const addSchema = [
  {
    label: '事务类型',
    field: 'affairsType',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        return {
          data: await baseStore.getDictionaryData('RefundAffairsType'),
        };
      },
      apiSearch: {
        show: false,
      },
      defaultFirstOption: true,
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: false,
      immediate: true,
      filterOption: false,
      defaultOption: true,
    },
  },
  {
    label: '退料部门',
    field: 'refundDeptName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '退料人',
    field: 'refundMoldUserIds',
    colProps: {
      span: 8,
    },
    component: 'CustomUserSelect',
    componentProps: {
      multiple: true,
      maxTagCount: 1,
    },
    required: true,
  },
  {
    label: '制单人',
    field: 'applyUserName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '创建时间',
    field: 'applyDateTime',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
  },
];
export const addColumn = [
  {
    title: '模具料号',
    field: 'moldPartNumber',
    width: 150,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 180,
  },
  { title: '模具类型', field: 'moldTypeName', width: 120 },
  {
    title: '计划退回日期',
    field: 'plannedRefundDate',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    width: 120,
  },
  {
    title: '本次使用寿命(KPCS)',
    field: 'thisUseLife',
    editRender: {
      name: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    width: 180,
  },
  {
    title: '调入仓库',
    field: 'callShippingSpaceCode',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'callShippingSpaceName',
      props: {
        api: getShipList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpace',
        },
        rowParams: {
          factoryCode: 'factoryCode',
        },
        immediate: false,
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        filterOption: false,
      },
    },
  },
  {
    title: '调出仓库',
    field: 'outShippingSpaceName',
    width: 120,
  },
  { title: '临时单号', field: 'temporaryOrder', editRender: { name: 'Input' } },
  { title: 'SAP工单号', field: 'sapWorkOrder', width: 120 },
  {
    title: '本次剩余寿命(KPCS)',
    field: 'remainingLife',
    width: 120,
  },
  { title: '机台位', field: 'machinePosition', width: 120 },
  {
    title: '单位',
    field: 'unit',
    width: 120,
  },
  {
    title: '数量',
    field: 'qty',
    width: 120,
  },
  { title: '工厂', field: 'factory', width: 120 },
];

/**
 * 新增页面 - 表格列校验规则
 */
export const editRules = {
  plannedRefundDate: [{ required: true, trigger: 'blur', message: t('common.required') }],
  thisUseLife: [{ required: true, trigger: 'blur', message: t('common.required') }],
  moldNumber: [{ required: true, trigger: 'blur', message: t('common.required') }],
  callShippingSpaceCode: [{ required: true, trigger: 'blur', message: t('common.required') }],
};

export const printColumn = [
  { title: '退模单号', field: 'moldRefundApplyNo' },
  { title: '模具料号', field: 'moldPartNumber', width: 100 },
  { title: '模具类型', field: 'moldTypeName', width: 100 },
  {
    title: '单位',
    field: 'unit',
    width: 80,
  },
  {
    title: '数量',
    field: 'qty',
    width: 80,
  },
  // {
  //   title: '备注',
  //   field: 'remark',
  //   i18nField: 'CommonCol.remark',
  // },
  { title: '调入仓库', field: 'callShippingSpaceName' },
  { title: '调出仓库', field: 'outShippingSpaceName' },
  { title: '单据类型', field: 'orderTypeName' },
  { title: '退料人', field: 'refundMoldUserNames' },
];
