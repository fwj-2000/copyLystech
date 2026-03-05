import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 是否
export const IS_YSE_LIST = [
  { id: 1, fullName: t('dict.TransferEnum.Yes'), value: 1, label: t('dict.TransferEnum.Yes'), theme: 'green' },
  {
    id: 0,
    fullName: t('dict.TransferEnum.No'),
    value: 0,
    label: t('dict.TransferEnum.No'),
    theme: 'yellow',
  },
];

//  满足不满足
export const IS_SATISFY_LIST = [
  { id: 1, fullName: t('dict.OpinionTypeEnum.Satisfy'), value: 1, label: t('dict.OpinionTypeEnum.Satisfy'), theme: 'green' },
  { id: 2, fullName: t('dict.OpinionTypeEnum.Discontent'), value: 2, label: t('dict.OpinionTypeEnum.Discontent'), theme: 'yellow' },
];

//  启用未启用
export const IS_ENABLE_LIST = [
  { id: 1, fullName: t('dict.enableStatus.1'), value: 1, label: t('dict.enableStatus.1'), theme: 'green' },
  { id: 2, fullName: t('dict.enableStatus.2'), value: 2, label: t('dict.enableStatus.2'), theme: 'red' },
];

// 获取流程节点
export const FLOWSTATE_LIST = [
  { id: 1, fullName: t('dict.Flow.BillStatus.1'), value: 1, label: t('dict.Flow.BillStatus.1'), theme: 'gray' }, //待提交
  { id: 2, fullName: t('dict.Flow.BillStatus.2'), value: 2, label: t('dict.Flow.BillStatus.2'), theme: 'blue' }, //处理中
  { id: 3, fullName: t('dict.Flow.BillStatus.3'), value: 3, label: t('dict.Flow.BillStatus.3'), theme: 'green' }, // 已处理
  { id: 4, fullName: t('dict.Flow.BillStatus.4'), value: 4, label: t('dict.Flow.BillStatus.4'), theme: 'purple' }, //撤回
  { id: 5, fullName: t('dict.Flow.BillStatus.5'), value: 5, label: t('dict.Flow.BillStatus.5'), theme: 'yellow' }, // 驳回
  { id: 6, fullName: t('dict.Flow.BillStatus.6'), value: 6, label: t('dict.Flow.BillStatus.6'), theme: 'red' }, //	终止
];
