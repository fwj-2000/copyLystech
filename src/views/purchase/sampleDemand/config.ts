import { useI18n } from '/@/hooks/web/useI18n';

export { statusOptions as confirmStatusOptions } from '/@/views/engineering/sampleComfirm/components/processed/configVxe';

const { t } = useI18n();

/**
 * @description tabs类型枚举
 */
export enum TABS_ENUM {
  待处理 = '0',
  已处理 = '1',
}

/**
 * 状态枚举
 */
export enum STATUS_ENUM {
  待处理 = 1,
  已处理 = 2,
  终止 = 3,
  撤回 = 4,
  驳回 = 5,
}

/**
 * 采购 - 样品需求状态选项
 */
export const statusOptions = [
  { label: t('common.todoText'), value: STATUS_ENUM.待处理, fullName: t('common.todoText'), id: STATUS_ENUM.待处理, theme: 'gray', rowKey: 'handleStatus' },
  { label: t('common.doneText'), value: STATUS_ENUM.已处理 },
  { label: t('common.stopText'), value: STATUS_ENUM.终止 },
  { label: t('common.revoke'), value: STATUS_ENUM.撤回, fullName: t('common.revoke'), id: STATUS_ENUM.撤回, theme: 'purple', rowKey: 'handleStatus' },
  { label: t('common.rejectText'), value: STATUS_ENUM.驳回, fullName: t('common.rejectText'), id: STATUS_ENUM.驳回, theme: 'yellow', rowKey: 'handleStatus' },
];
