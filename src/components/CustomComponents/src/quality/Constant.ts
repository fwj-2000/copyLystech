import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const STATUS_OPTIONS = [
  { id: 0, fullName: t('common.draft'), value: 0, label: t('common.draft'), theme: 'gray' }, //草稿
  { id: 1, fullName: t('common.doing'), value: 1, label: t('common.doing'), theme: 'blue' }, //在办
  { id: 2, fullName: t('common.stopText'), value: 2, label: t('common.stopText'), theme: 'red' }, //终止
  { id: 3, fullName: t('common.rejectText'), value: 3, label: t('common.rejectText'), theme: 'yellow' }, //驳回
  { id: 4, fullName: t('common.revoke'), value: 4, label: t('common.revoke'), theme: 'purple' }, //撤回
  { id: 5, fullName: t('common.endding'), value: 5, label: t('common.endding'), theme: 'green' }, //结案
  { id: 6, fullName: t('common.todoText'), value: 6, label: t('common.todoText'), theme: 'gray' }, //待处理
  { id: 7, fullName: t('common.doneText'), value: 7, label: t('common.doneText'), theme: 'green' }, //已处理
  { id: 8, fullName: t('common.delText'), value: 8, label: t('common.delText'), theme: 'gray' }, //删除
  { id: 9, fullName: t('common.submitTodo'), value: 9, label: t('common.submitTodo'), theme: 'gray' }, //待提交
  { id: 10, fullName: t('common.submitted'), value: 10, label: t('common.submitted'), theme: 'green' }, //已提交
  { id: 11, fullName: t('common.agree'), value: 11, label: t('common.agree'), theme: 'green' }, //同意
  { id: 12, fullName: t('common.disagree'), value: 12, label: t('common.disagree'), theme: 'yellow' }, //不同意
  { id: 13, fullName: t('status.applyStatus.waiting'), value: 13, label: t('status.applyStatus.waiting'), theme: 'blue' }, //待回复
  { id: 16, fullName: t('common.toConfirm'), value: 16, label: t('common.toConfirm'), theme: 'gray' }, //待确认
];

export const IS_OPTION_LIST = [
  {
    id: 1,
    fullName: t('dict.TransferEnum.Yes'),
    value: 1,
    label: t('dict.TransferEnum.Yes'),
  },
  {
    id: 0,
    fullName: t('dict.TransferEnum.No'),
    value: 0,
    label: t('dict.TransferEnum.No'),
  },
];

export const IS_SATISFY_LIST = [
  { id: 1, fullName: t('dict.OpinionTypeEnum.Satisfy'), value: 1, label: t('dict.OpinionTypeEnum.Satisfy'), theme: 'green' },
  { id: 2, fullName: t('dict.OpinionTypeEnum.Discontent'), value: 2, label: t('dict.OpinionTypeEnum.Discontent'), theme: 'yellow' },
];

export const PRODUCTION_LIST = [
  { id: 1, fullName: t('dict.ProductionTypeEnum.Self'), value: 1, label: t('dict.ProductionTypeEnum.Self') },
  { id: 2, fullName: t('dict.ProductionTypeEnum.Outsourcing'), value: 2, label: t('dict.ProductionTypeEnum.Outsourcing') },
];
