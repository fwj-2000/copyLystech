import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 条件选项
export const CONDITION_OPTIONS = [
  { id: 1, fullName: t('status.yes') },
  { id: 0, fullName: t('status.no') },
];

export const STATUS_OPTIONS = [
  { id: 'true', fullName: t('status.yes') },
  { id: 'false', fullName: t('status.no') },
];
