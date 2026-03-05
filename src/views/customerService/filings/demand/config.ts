import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 状态
export const REVIEW_STATUS_OPTIONS = [
  { id: 1, fullName: t('common.unbuildOrder'), color: '#B2B2B2' },
  { id: 2, fullName: t('common.builtOrder'), color: '#FF7B00' },
  { id: 3, fullName: t('common.audited'), color: '#52C41A' },
];

/** 来源类型 枚举 */
export enum SOURCE_TYPE_ENUM {
  自建 = 'SelfCreate',
  量试 = 'Quantitative',
}

export enum STATUS_ENUM {
  已建单 = 2,
  终止 = 12,
  撤回 = 5,
  驳回 = 4,
  结案 = 3,
  待提交 = 13,
}

export const statusOptions = [
  { id: STATUS_ENUM.已建单, fullName: t('dict.FilingsApplyStatusEnum.2'), theme: 'green' },
  { id: STATUS_ENUM.终止, fullName: t('dict.FilingsApplyStatusEnum.12'), theme: 'red' },
  { id: STATUS_ENUM.撤回, fullName: t('dict.FilingsApplyStatusEnum.5'), theme: 'purple' },
  { id: STATUS_ENUM.结案, fullName: t('dict.FilingsApplyStatusEnum.3'), theme: 'green' },
  { id: STATUS_ENUM.待提交, fullName: t('dict.FilingsApplyStatusEnum.13'), theme: 'gray' },
  { id: STATUS_ENUM.驳回, fullName: t('dict.FilingsApplyStatusEnum.4'), theme: 'yellow' },
];
