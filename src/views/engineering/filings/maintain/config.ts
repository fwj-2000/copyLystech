import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
const userStore = useUserStore();

export const enum TAB_ENUM {
  待处理 = 0,
  已处理 = 1,
}

export const statusOptions = [
  { id: 0, fullName: t('dict.FilingsApplyDataStatusEnum.0'), theme: 'gray' },
  { id: 1, fullName: t('dict.FilingsApplyDataStatusEnum.1'), theme: 'green' },
  { id: 2, fullName: t('dict.FilingsApplyDataStatusEnum.2'), theme: 'green' },
  { id: 3, fullName: t('dict.FilingsApplyDataStatusEnum.3'), theme: 'yellow' },
  { id: 4, fullName: t('dict.FilingsApplyDataStatusEnum.4'), theme: 'purple' },
  { id: 5, fullName: t('dict.FilingsApplyDataStatusEnum.5'), theme: 'red' },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', allowClear: true },
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
      fieldName: 'immediateCustomerName',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户信息', allowClear: true },
    },
    {
      fieldName: 'pdPersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'pdPersonName',
      componentProps: {
        placeholder: 'PD',
        defaultValue: userStore.getUserInfo?.userId,
      },
    },
    {
      fieldName: 'engineeringStatus',
      label: '',
      component: 'Select',
      i18nField: 'status',
      componentProps: { options: statusOptions, fieldNames: { label: 'fullName', value: 'id' }, allowClear: true },
    },
  ];
}

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
    {
      title: '备案需求单号',
      field: 'filingsApplyNo',
      width: 200,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '来源单号',
      field: 'sourceNo',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 240 },
    {
      title: '状态',
      field: 'engineeringStatus',
      i18nField: 'status',
      width: 100,
      sortable: true,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
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
      title: '备案语言',
      field: 'filingsLanguage',
      i18nField: 'filingsLanguage',
      formatter: ({ cellValue, row }) => row.filingsLanguageName || cellValue || '',
      width: 150,
      sortable: true,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
    },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 150,
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: 'PD',
      field: 'pdPersonId',
      i18nField: 'pdPersonName',
      formatter: ({ cellValue, row }) => row.pdPersonName || cellValue || '',
      width: 220,
    },
    {
      title: '关务',
      field: 'customsPersonId',
      i18nField: 'customersName',
      formatter: ({ cellValue, row }) => row.customsPersonName || cellValue || '',
      width: 220,
      filters: [{ data: '' }],
      filterRender: {
        name: 'CustomUserSelect',
      },
    },
    {
      title: t('common.action'),
      width: 50,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}
