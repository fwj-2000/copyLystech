import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const baseStore = useBaseStore();
export const STATUS_OPTIONS = [
  // { id: 0, fullName: t('dict.Flow.NodeStatus.1'), theme: 'gray', rowKey: 'statusName' },
  // { id: 1, fullName: t('common.doing'), theme: 'blue', rowKey: 'statusName' }, //'在办'
  // { id: 2, fullName: t('dict.Flow.BillStatus.6'), theme: 'red', rowKey: 'statusName' }, //'终止'
  // { id: 3, fullName: t('dict.Flow.BillStatus.5'), theme: 'yellow', rowKey: 'statusName' }, //'驳回 '
  // { id: 4, fullName: t('dict.Flow.BillStatus.4'), theme: 'purple', rowKey: 'statusName' }, //'撤回'
  // { id: 5, fullName: t('common.endding'), theme: 'green', rowKey: 'statusName' }, //'结案'
  // { id: 6, fullName: t('dict.Flow.NodeStatus.1'), theme: 'gray' }, //待处理
  // { id: 7, theme: 'green', rowKey: 'statusName' },
  // { id: 8, fullName: t('common.delText'), theme: 'gray', rowKey: 'statusName' }, //'删除'
  // { id: 9, fullName: t('dict.Flow.BillStatus.1'), theme: 'gray', rowKey: 'statusName' }, //'待提交'
  // { id: 10, fullName: t('dict.Flow.BillStatus.3'), theme: 'green', rowKey: 'statusName' }, //'已提交' 已处理
  // { id: 11, fullName: t('dict.Flow.ReviewResult.1'), theme: 'green', rowKey: 'statusName' }, //同意
  // { id: 12, fullName: t('dict.Flow.ReviewResult.2'), theme: 'yellow', rowKey: 'statusName' }, //不同意
  // { id: 13, fullName: t('status.applyStatus.waiting'), theme: 'blue', rowKey: 'statusName' }, //'待回复'
  { fullName: t('dict.Flow.NodeStatus.1'), id: 0, theme: 'gray' }, //'待处理'
  { fullName: t('dict.Flow.BillStatus.3'), id: 1, theme: 'blue' }, //'已处理'
  { fullName: t('dict.Flow.BillStatus.4'), id: 2, theme: 'purple' }, //'撤回'
  { fullName: t('dict.Flow.BillStatus.5'), id: 3, theme: 'yellow' }, //'驳回'
  { fullName: t('dict.Flow.BillStatus.6'), id: 4, theme: 'red' }, //'终止'
];

export const SEARCH_FORM_SCHEMA: Array<any> = [
  {
    fieldName: 'applyCode',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '单号',
      allowClear: true,
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '产品内部料号',
      allowClear: true,
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
      allowClear: true,
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '选择状态',
      options: STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
      allowClear: true,
    },
    colProps: { span: 3 },
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
      allowClear: true,
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
      allowClear: true,
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
      allowClear: true,
    },
    colProps: { span: 3 },
  },
];

export const COLUMNS: Array<any> = [
  {
    type: 'checkbox',
    field: 'checkbox',
  },
  { title: '单号', field: 'applyCode' },
  { title: '产品内部料号', field: 'insidePartNumber', width: 260 },
  { title: '样品预计交期', field: 'sampleEstimateDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '当前处理人', field: 'currentProcessorName' },
  { title: '当前节点', field: 'currentNodeName' },
  { title: '节点记录', field: 'nodeRecord', slots: { default: 'nodeRecord' } },
  { title: '不制作原因', field: 'noNeedToMakeRemark' },
  { title: '状态', field: 'status', cellRender: { name: 'Tag', options: STATUS_OPTIONS } },
  {
    title: '交期确认',
    field: 'deliveryConfirmHandleStatus',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 11, theme: 'green', fullName: t('dict.Flow.ReviewResult.1'), rowKey: 'deliveryConfirmHandleStatusName' },
        { id: 12, theme: 'yellow', fullName: t('dict.Flow.ReviewResult.2'), rowKey: 'deliveryConfirmHandleStatusName' },
        { id: 16, theme: 'gray', fullName: t('common.toConfirm'), rowKey: 'deliveryConfirmHandleStatusName' },
      ],
    },
  },
  { title: '需求类型', field: 'demandTypeName' },
  { title: 'PD', field: 'pdName' },
  { title: '需求数量(PCS)', field: 'demandQty' },
  { title: '客户要求交期', field: 'customerDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '申请人', field: 'applyUserName' },
  { title: '申请日期', field: 'applyDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '备注', field: 'remark' },
];
