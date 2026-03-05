import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: 1, fullName: t('dict.enableStatus.1'), value: 1, label: t('dict.enableStatus.1'), theme: 'green' }, //启用
  { id: 2, fullName: t('dict.enableStatus.2'), value: 2, label: t('dict.enableStatus.2'), theme: 'red' }, //禁用
];

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  { title: t('dict.SupplierColumn.orgId'), field: 'orgName', width: '120' }, //组织
  { title: t('dict.ProcessColumn.factoryArea'), field: 'factoryName', width: '120', i18nField: 'CommonCol.factoryArea' }, //工厂
  { title: t('dict.CommonCol.account'), field: 'account', minWidth: '125' }, //账号
  { title: '名称', field: 'name', width: '100' },
  { title: '创建人', field: 'creatorUserName' },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
    },
    width: '120',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '70',
    fixed: 'right',
  },
];

export function getQuotaFormConfig() {
  return [
    {
      fieldName: 'factoryName',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请选择工厂',
      },
    },
    {
      fieldName: 'account',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入账号',
      },
    },
    {
      fieldName: 'name',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入名称',
      },
    },
  ];
}
