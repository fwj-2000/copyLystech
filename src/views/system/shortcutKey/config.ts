import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: false, fullName: t('dict.enableStatus.1'), value: false, label: t('dict.enableStatus.1'), theme: 'green' }, //启用
  { id: true, fullName: t('dict.enableStatus.2'), value: true, label: t('dict.enableStatus.2'), theme: 'red' }, //禁用
];
export const getPrintTemplateColumns = [
  {
    title: '快捷键',
    field: 'key',
    width: '200',
    slots: {
      default: 'key',
    },
  },

  { title: '功能名称', field: 'texts' },
  // { title: '创建人', field: 'creatorUserName', i18nField: 'CommonCol.creatorUserName' },
  // {
  //   title: '创建时间',
  //   field: 'creatorTime',
  //   cellRender: {
  //     name: 'Date',
  //   },
  //   i18nField: 'CommonCol.creatorTime',
  // },
  // {
  //   title: '修改时间',
  //   field: 'lastModifyTime',
  //   cellRender: {
  //     name: 'Date',
  //   },
  //   i18nField: 'CommonCol.updateTime',
  // },
  // {
  //   title: '修改人',
  //   field: 'lastModifyUserName',
  //   i18nField: 'CommonCol.updateUser',
  // },
  // {
  //   title: '状态',
  //   i18nField: 'CommonCol.status',
  //   field: 'checkVisibility',
  //   width: '100',
  //   cellRender: {
  //     name: 'Tag',
  //     options: STATUS_OPTIONS,
  //   },
  // },
  // {
  //   title: '操作',
  //   field: 'action',
  //   slots: { default: 'action' },
  //   width: '200',
  //   fixed: 'right',
  // },
];
