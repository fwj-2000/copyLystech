import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { all } from 'axios';
const baseStore = useBaseStore();
const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: 0, fullName: '待处理', theme: 'gray', rowKey: 'statusName' },
  { id: 1, fullName: '已处理', theme: 'green', rowKey: 'statusName' },
  { id: 2, fullName: '撤回', theme: 'green', rowKey: 'statusName' },
  { id: 4, fullName: '终止', theme: 'red', rowKey: 'statusName' },
];

export const HANDLE_STATUS_OPTIONS = [
  { id: 1, fullName: '已处理', theme: 'green', rowKey: 'statusName' },
  { id: 4, fullName: '终止', theme: 'red', rowKey: 'statusName' },
];

export const SEARCH_FORM_SCHEMA = [
  {
    fieldName: 'applyCode',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      allowClear: true,
      placeholder: t('dict.CommonCol.applyCode'),
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      allowClear: true,
      placeholder: '产品内部料号',
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: { defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')] },
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'status',
    i18nField: 'statusName',
    label: '',
    component: 'Select',
    allowClear: true,
    componentProps: {
      placeholder: '选择状态',
      fieldNames: {
        label: 'fullName',
        value: 'id',
      },
      options: STATUS_OPTIONS,
    },
  },
  {
    fieldName: 'demandType',
    i18nField: 'demandTypeName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('DemandTypeEnum'),
      placeholder: '选择需求类型',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'applyUserId',
    i18nField: 'applyUserName',
    label: '',
    component: 'CustomUserSelect',
    defaultValue: '',
    componentProps: {
      placeholder: '申请人',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'pdPersonId',
    i18nField: 'pdName',
    label: '',
    component: 'CustomUserSelect',
    defaultValue: '',
    componentProps: {
      placeholder: 'PD',
    },
    colProps: { span: 3 },
  },
];

export const COLUMNS = [
  { type: 'checkbox', width: 60 },
  { title: '单号', field: 'applyCode' },
  { title: '产品内部料号', field: 'insidePartNumber', width: 260 },
  { title: '生产类型', field: 'productionTypeName' },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  { title: 'PD', field: 'pdName' },
  { title: '需求类型', field: 'demandTypeName' },
  { title: '需求数量(PCS)', field: 'demandQty' },
  { title: '客户要求交期', field: 'customerDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '备注', field: 'transferRemarks' },
  { title: '申请人', field: 'applyUserName' },
  { title: '申请日期', field: 'applyDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '当前处理人', field: 'currentProcessorName' },
  // { title: '当前节点', field: 'currentNodeName' },
  // { title: '节点记录', field: 'nodeRecord' },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '100',
    fixed: 'right',
  },
];

export const HANDLED_COLUMNS = [
  { title: '单号', field: 'applyCode' },
  { title: '产品内部料号', field: 'insidePartNumber', width: 260 },
  { title: '生产类型', field: 'productionTypeName' },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  { title: 'PD', field: 'pdName' },
  { title: '需求类型', field: 'demandTypeName' },
  { title: '需求数量(PCS)', field: 'demandQty' },
  { title: '材料', field: 'material' },
  { title: '客户要求交期', field: 'customerDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '备注', field: 'transferRemarks' },
  { title: '申请人', field: 'applyUserName' },
  { title: '申请日期', field: 'applyDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '当前处理人', field: 'currentProcessorName' },
  // { title: '当前节点', field: 'currentNodeName' },
  // { title: '节点记录', field: 'nodeRecord' },
];
