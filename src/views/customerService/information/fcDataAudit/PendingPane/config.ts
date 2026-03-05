import { useI18n } from '/@/hooks/web/useI18n';
import { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid';
import { BaseFormComponentType, FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

const AuditTypeOptions = [
  { id: 0, fullName: t('common.addText'), theme: 'purple' }, // 新增审核中
  { id: 1, fullName: t('变更'), theme: 'yellow' }, // 已通过
];

export const auditStatusOptions: any = [
  { id: -1, fullName: t('dict.FcData.FlowStatusEnum.Disuse'), theme: 'gray' }, // 废弃
  { id: 1, fullName: t('dict.FcData.FlowStatusEnum.Pending'), theme: 'gray' }, // 待提交
  { id: 2, fullName: t('dict.FcData.FlowStatusEnum.Handling'), theme: 'blue' }, // 处理中
  { id: 3, fullName: t('dict.FcData.FlowStatusEnum.Handled'), theme: 'green' }, // 已处理
  { id: 4, fullName: t('dict.FcData.FlowStatusEnum.Withdraw'), theme: 'purple' }, // 撤回
  { id: 5, fullName: t('dict.FcData.FlowStatusEnum.Reject'), theme: 'yellow' }, // 驳回
  { id: 6, fullName: t('dict.FcData.FlowStatusEnum.Stop'), theme: 'red' }, // 终止
  { id: 7, fullName: t('dict.FcData.FlowStatusEnum.PendingHandling'), theme: 'purple' }, // 待处理
];

export const reminderType: any = [
  { value: 0, label: t('common.intranetNotifications') },
  { value: 1, label: t('common.extranetNotifications') },
];

// vxe表格表头配置
export const columns: DeepPartial<VxeGridPropTypes.Columns<any>> = [
  { type: 'seq', field: 'seq', width: 45 },
  { title: '业务类型', field: 'auditType', width: 100, cellRender: { name: 'Tag', options: AuditTypeOptions } },
  {
    title: '版本',
    minWidth: 100,
    field: 'batchNumber',
    slots: { default: 'Version' },
  },
  {
    title: 'FC周数',
    minWidth: 100,
    field: 'fcWeek',
  },
  {
    title: '备料原则',
    minWidth: 100,
    field: 'materialPreparationPrinciple',
  },
  {
    title: '状态',
    field: 'auditStatus',
    cellRender: {
      name: 'Tag',
      options: auditStatusOptions,
    },
    minWidth: 120,
  },
  {
    title: '当前处理人',
    minWidth: 120,
    field: 'currentProcessorName',
  },
  {
    title: '当前节点',
    minWidth: 100,
    field: 'currentNodeName',
  },
  {
    title: '节点记录',
    minWidth: 100,
    field: 'FIELD8',
    slots: { default: 'NodeRecords' },
  },
  {
    title: '申请人',
    minWidth: 120,
    field: 'applyUserName',
  },
  {
    title: '申请时间',
    minWidth: 140,
    field: 'applyDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    } as any,
  },
  {
    title: 'FC报表',
    minWidth: 140,
    field: 'FIELD11',
    slots: {
      default: 'FCData',
    },
  },
];

// vxe表单配置
export const schema: FormSchema<BaseFormComponentType>[] = [
  {
    fieldName: 'batchVersion',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.SalesForecastColumn.BatchCode'),
    },
  },
  {
    fieldName: 'fcWeek',
    label: '',
    component: 'WeekPicker',
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      // valueFormat: 'YYYY-ww',
    },
  },
  {
    fieldName: 'applyUserId',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: t('dict.CommonCol.applyUserName'),
    },
  },
  {
    fieldName: 'auditType',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '业务类型',
      fieldNames: {
        label: 'fullName',
        value: 'id',
      },
      options: AuditTypeOptions,
    },
  },
  {
    fieldName: 'currentNode',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: t('dict.FcDataAuditColumn.currentNodeName'),
      api: () => baseStore.getDictionaryData('FcData.FlowNode'),
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      allowClear: true,
      immediate: true,
    },
  },
];
