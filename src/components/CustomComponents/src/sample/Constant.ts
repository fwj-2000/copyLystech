import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export function getSampleStatus(keyName: string = 'applyStatus') {
  return [
    { id: 1, fullName: t('common.temporarySave'), theme: 'gray', rowKey: keyName },
    { id: 2, fullName: t('common.doing'), theme: 'blue', rowKey: keyName },
    { id: 3, fullName: t('common.rejectText'), theme: 'red', rowKey: keyName },
    { id: 4, fullName: t('common.revoke'), theme: 'purple', rowKey: keyName },
    { id: 5, fullName: t('common.stopText'), theme: 'red', rowKey: keyName },
    { id: 6, fullName: t('common.endding'), theme: 'green', rowKey: keyName },
  ];
}
