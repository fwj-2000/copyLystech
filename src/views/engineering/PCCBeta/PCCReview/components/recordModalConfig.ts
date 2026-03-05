import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const recordColumns: Array<any> = [
  // 操作人
  {
    title: t('dict.CommonCol.operator'),
    field: 'operateUserName',
  },
  // 操作时间
  {
    title: t('dict.CommonCol.operatingTime'),
    field: 'operateDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 变更前
  {
    title: t('dict.PartNumberApplyColumn.record.oldValue'),
    field: 'updateFront',
  },
  // 变更后
  {
    title: t('dict.PartNumberApplyColumn.record.newValue'),
    field: 'updateAfter',
  },
];
