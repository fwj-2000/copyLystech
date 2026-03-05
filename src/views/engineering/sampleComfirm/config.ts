import { h } from 'vue';
import { isBoolean } from '/@/utils/is';
import { useI18n } from '/@/hooks/web/useI18n';

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
  待确认 = 1,
  满足 = 2,
  不满足 = 3,
  终止 = 4,
}

/**
 * 渲染是否满足函数
 * @param value
 */
// export function renderSatisfiedStatus(value: boolean | number) {
//   if (isBoolean(value)) {
//     return h('span', { style: `color: ${value ? '#52c41a' : '#FAAD14'}` }, value ? t('dict.OpinionTypeEnum.Satisfy') : t('dict.OpinionTypeEnum.Discontent'));
//   }
//   return '';
// }

export const statusEnumDict = [
  { id: 1, fullName: t('dict.OpinionEnum.1'), theme: 'blue' },
  { id: 2, fullName: t('dict.OpinionEnum.2'), theme: 'green' },
  { id: 3, fullName: t('dict.OpinionEnum.3'), theme: 'red' },
  { id: 4, fullName: t('common.revoke'), theme: 'purple' },
  { id: 5, fullName: t('common.stopText'), theme: 'red' },
];

export const renderSatisfiedStatus = [
  { id: 1, fullName: t('dict.OpinionEnum.2'), theme: 'green' },
  { id: 2, fullName: t('dict.OpinionEnum.3'), theme: 'yellow' },
  // { id: 2, fullName: t('dict.OpinionTypeEnum.Discontent'), theme: 'yellow' },
];

export const statusOptions = [
  { label: t('common.toConfirm'), value: STATUS_ENUM.待确认 },
  {
    label: t('dict.OpinionTypeEnum.Satisfy'),
    value: STATUS_ENUM.满足,
    fullName: t('dict.OpinionTypeEnum.Satisfy'),
    id: STATUS_ENUM.满足,
    theme: 'green',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.OpinionTypeEnum.Discontent'),
    value: STATUS_ENUM.不满足,
    fullName: t('dict.OpinionTypeEnum.Discontent'),
    id: STATUS_ENUM.不满足,
    theme: 'yellow',
    rowKey: 'confirmStatus',
  },
  { label: t('common.revoke'), value: STATUS_ENUM.撤回 },
  { label: t('common.stopText'), value: STATUS_ENUM.终止, fullName: t('common.stopText'), id: STATUS_ENUM.终止, theme: 'red', rowKey: 'confirmStatus' },
];
