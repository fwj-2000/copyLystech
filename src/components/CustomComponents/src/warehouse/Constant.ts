import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 审核状态
export function getReviewStatus(keyName: string = 'status') {
  return [
    { id: 1, fullName: t('common.waitAuditText'), value: 1, label: t('common.waitAuditText'), theme: 'gray', rowKey: keyName }, // 待审核
    { id: 2, fullName: t('common.audited'), value: 2, label: t('common.audited'), theme: 'green', rowKey: keyName }, // 已审核
  ];
}

// 流程状态
export function getFlowStatus(keyName: string = 'applyStatus') {
  return [
    { id: 0, fullName: t('common.temporarySave'), value: 0, label: t('common.temporarySave'), theme: 'gray', rowKey: keyName },
    { id: 1, fullName: t('common.doing'), value: 1, label: t('common.doing'), theme: 'blue', rowKey: keyName }, //在办
    { id: 2, fullName: t('common.stopText'), value: 2, label: t('common.stopText'), theme: 'red', rowKey: keyName }, //终止
    { id: 3, fullName: t('common.rejectText'), value: 3, label: t('common.rejectText'), theme: 'yellow', rowKey: keyName }, //驳回
    { id: 4, fullName: t('common.revoke'), value: 4, label: t('common.revoke'), theme: 'purple', rowKey: keyName }, //撤回
    { id: 5, fullName: t('common.endding'), value: 5, label: t('common.endding'), theme: 'green', rowKey: keyName }, //结案
    { id: 6, fullName: t('common.todoText'), value: 6, label: t('common.todoText'), theme: 'gray', rowKey: keyName }, //待处理
    { id: 7, fullName: t('common.doneText'), value: 7, label: t('common.doneText'), theme: 'green', rowKey: keyName }, //已处理
    { id: 8, fullName: t('dict.ProgressStatusEnum.8'), value: 8, label: t('dict.ProgressStatusEnum.8'), theme: 'red', rowKey: keyName }, // 删除
    { id: 9, fullName: t('dict.ProgressStatusEnum.9'), value: 9, label: t('dict.ProgressStatusEnum.9'), theme: 'gray', rowKey: keyName }, // 待提交
    { id: 10, fullName: t('dict.ProgressStatusEnum.10'), value: 10, label: t('dict.ProgressStatusEnum.10'), theme: 'green', rowKey: keyName }, // 已提交
    { id: 11, fullName: t('dict.ProgressStatusEnum.11'), value: 11, label: t('dict.ProgressStatusEnum.11'), theme: 'green', rowKey: keyName }, // 同意
    { id: 21, fullName: t('dict.ProgressStatusEnum.21'), value: 21, label: t('dict.ProgressStatusEnum.21'), theme: 'green', rowKey: keyName }, // 结束
    { id: 22, fullName: t('dict.ProgressStatusEnum.22'), value: 22, label: t('dict.ProgressStatusEnum.22'), theme: 'yellow', rowKey: keyName }, // 待审核
    { id: 25, fullName: t('dict.ProgressStatusEnum.25'), value: 25, label: t('dict.ProgressStatusEnum.25'), theme: 'green', rowKey: keyName }, // 已审核
    { id: 30, fullName: t('dict.ProgressStatusEnum.30'), value: 30, label: t('dict.ProgressStatusEnum.30'), theme: 'yellow', rowKey: keyName }, // 待建
    { id: 31, fullName: t('dict.ProgressStatusEnum.31'), value: 31, label: t('dict.ProgressStatusEnum.31'), theme: 'gray', rowKey: keyName }, //待匹配
    { id: 32, fullName: t('dict.ProgressStatusEnum.32'), value: 32, label: t('dict.ProgressStatusEnum.32'), theme: 'gray', rowKey: keyName }, //待发放
    { id: 33, fullName: t('dict.ProgressStatusEnum.33'), value: 33, label: t('dict.ProgressStatusEnum.33'), theme: 'gray', rowKey: keyName }, //待接收
    {
      id: 34,
      fullName: t('dict.ProgressStatusEnum.34'),
      value: 34,
      label: t('dict.ProgressStatusEnum.34'),
      theme: 'green',
      rowKey: 'dict.ProgressStatusEnum.34',
    }, // 已核销
    {
      id: 35,
      fullName: t('dict.ProgressStatusEnum.35'),
      value: 35,
      label: t('dict.ProgressStatusEnum.35'),
      theme: 'yellow',
      rowKey: 'dict.ProgressStatusEnum.35',
    }, // 核销中
    { id: 36, fullName: t('dict.ProgressStatusEnum.36'), value: 36, label: t('dict.ProgressStatusEnum.36'), theme: 'gray', rowKey: keyName }, //待核销
  ];
}
