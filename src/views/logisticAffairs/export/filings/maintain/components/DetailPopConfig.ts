import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export function getImageTableColumns() {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: t('common.imageName'),
      field: 'fileName',
      editRender: {
        name: 'Input',
        props: {
          disabled: true,
        },
      },
      slots: { default: 'file' },
    },
    {
      title: t('common.action'),
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}
