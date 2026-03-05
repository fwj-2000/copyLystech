import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const enum TAB_ENUM {
  待处理 = 0,
  已处理 = 1,
}

/** 1已维护 0待维护 */
export const AUDIT_STATUS_OPTIONS = [
  { id: 0, fullName: t('dict.FilingsApplyDataStatusEnum.0'), theme: 'gray' },
  { id: 1, fullName: t('dict.FilingsApplyDataStatusEnum.1'), theme: 'green' },
  { id: 2, fullName: t('dict.FilingsApplyDataStatusEnum.2'), theme: 'green' },
  { id: 3, fullName: t('dict.FilingsApplyDataStatusEnum.3'), theme: 'yellow' },
  { id: 4, fullName: t('dict.FilingsApplyDataStatusEnum.4'), theme: 'purple' },
  { id: 5, fullName: t('dict.FilingsApplyDataStatusEnum.5'), theme: 'red' },
];

export function getColumns() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 240 },
    // { title: '产品类型', field: 'insidePartNumber', width: 240 },
    {
      title: '状态',
      field: 'produceStatus',
      i18nField: 'status',
      width: 100,
      sortable: true,
      cellRender: {
        name: 'Tag',
        cSharpType: 'string',
        options: AUDIT_STATUS_OPTIONS,
      },
    },
    {
      title: '审核记录',
      field: 'auditRecord',
      i18nField: 'CommonCol.auditRecord',
      width: 100,
      slots: {
        default: 'auditRecord',
      },
    },
    {
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
    },
    { title: '生产备案员', field: 'producePersonName', i18nField: 'produceCreateName', width: 180 },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 150,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 150,
    },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 150,
    },
    {
      title: 'PD',
      field: 'pdPersonId',
      i18nField: 'pdPersonName',
      formatter: ({ cellValue, row }) => row.pdPersonName || cellValue || '',
      width: 180,
      aqpFilter: {
        enabled: true,
        cSharpType: 'string',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '关务',
      field: 'customsPersonId',
      i18nField: 'customsPersonName',
      formatter: ({ cellValue, row }) => row.customsPersonName || cellValue || '',
      width: 180,
      aqpFilter: {
        enabled: true,
        cSharpType: 'string',
        name: 'CustomUserSelect',
      },
    },
    {
      title: t('common.action'),
      width: 60,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export function getFormConfig() {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerName',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户信息', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户料号', allowClear: true },
    },
    {
      fieldName: 'terminalCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '终端客户料号', allowClear: true },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
      },
    },
    {
      fieldName: 'producePersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'produceCreateName',
      componentProps: { placeholder: '生产备案员' },
    },
    {
      fieldName: 'pdPersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'pdPersonName',
      componentProps: { placeholder: 'PD' },
    },
    {
      fieldName: 'customsPersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customsPersonName',
      componentProps: { placeholder: '关务' },
    },
    {
      fieldName: 'produceStatus',
      label: '',
      component: 'Select',
      i18nField: 'status',
      componentProps: { options: AUDIT_STATUS_OPTIONS, fieldNames: { label: 'fullName', value: 'id' }, allowClear: true },
    },
  ];
}
