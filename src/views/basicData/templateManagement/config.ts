import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getSchema() {
  return [
    {
      fieldName: 'keyword',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.CommonCol.moduleFullName'),
      },
    },
  ];
}

export function getColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '模块',
      field: 'moduleFullName',
      width: 160,
    },
    {
      title: '模板名称',
      field: 'name',
      width: 160,
    },
    {
      title: '语言',
      field: 'language',
      width: 160,
    },
    {
      title: '附件',
      field: 'fileName',
      i18nField: 'file',
      width: 200,
      slots: { default: 'files' },
    },
    {
      title: '版本',
      field: 'version',
      width: 120,
    },
    {
      title: '是否启用',
      field: 'enable',
      i18nField: 'status',
      width: 160,
      cellRender: {
        name: 'Tag',
        options: [
          { id: 0, theme: 'gray', rowKey: 'statusDesc', fullName: t('common.disableText') },
          { id: 1, fullName: t('dict.enableStatus.1'), theme: 'green', rowKey: 'statusDesc' },
        ],
      },
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      i18nField: 'applyUser',
      width: 160,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      i18nField: 'applyTime',
      width: 160,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      i18nField: 'updateUser',
      width: 160,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      i18nField: 'updateTime',
      width: 160,
      cellRender: {
        name: 'Date',
      },
    },
  ];
}
