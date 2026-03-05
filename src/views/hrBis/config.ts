import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

interface isYes {
  label: string;
  value: string;
}

export const IS_YSE_LIST: isYes[] = [
  { label: t('dict.TransferEnum.Yes') as string, value: '1' },
  { label: t('dict.TransferEnum.No') as string, value: '0' },
];
