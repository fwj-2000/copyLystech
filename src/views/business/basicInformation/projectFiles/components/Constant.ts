import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
// 0：暂存 1：在办 2：终止 3：驳回 4：撤回 5：结案6：待处理 7：已处理
export const FLOW_STATUS = [
  { label: t('common.temporarySave'), value: 0, id: 0, fullName: t('common.temporarySave'), theme: 'gray' },
  { label: t('common.doing'), value: 1, id: 1, fullName: t('common.doing'), theme: 'blue' },
  { label: t('common.stopText'), value: 2, id: 2, fullName: t('common.stopText'), theme: 'red' },
  { label: t('common.rejectText'), value: 3, id: 3, fullName: t('common.rejectText'), theme: 'yellow' },
  { label: t('common.revoke'), value: 4, id: 4, fullName: t('common.revoke'), theme: 'purple' },
  { label: t('common.endding'), value: 5, id: 5, fullName: t('common.endding'), theme: 'green' },
  { label: t('common.todoText'), value: 6, id: 6, fullName: t('common.todoText'), theme: 'gray' },
  { label: t('common.doneText'), value: 7, id: 7, fullName: t('common.doneText'), theme: 'green' },
];

//问题状态
// 1：跟踪中 2：关闭
export const QS_STATUS = [
  { label: t('dict.ProblemReleaseEnum.1'), value: 1, id: 1, fullName: t('dict.ProblemReleaseEnum.1'), theme: 'blue' },
  { label: t('dict.ProblemReleaseEnum.2'), value: 2, id: 2, fullName: t('dict.ProblemReleaseEnum.2'), theme: 'green' },
];
