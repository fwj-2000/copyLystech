import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * @description tabs类型枚举，按照接口定义：11维修待处理，12维修已处理
 */
export enum TABS_ENUM {
  待处理 = '21',
  已处理 = '22',
}

/**
 * 状态枚举
 */
export enum STATUS_ENUM {
  // 在办 = '1',
  待处理 = '6',
  撤回 = '4',
  已处理 = '7',
  驳回 = '3',
}

export const statusOptions = [
  // {
  //   label: t('dict.ProgressStatusEnum.1'),
  //   value: STATUS_ENUM.在办,
  //   fullName: t('dict.ProgressStatusEnum.1'),
  //   id: STATUS_ENUM.在办,
  //   theme: 'gray',
  // },
  {
    label: t('dict.ProgressStatusEnum.6'),
    value: STATUS_ENUM.待处理,
    fullName: t('dict.ProgressStatusEnum.6'),
    id: STATUS_ENUM.待处理,
    theme: 'gray',
  },
  {
    label: t('dict.ProgressStatusEnum.4'),
    value: STATUS_ENUM.撤回,
    fullName: t('dict.ProgressStatusEnum.4'),
    id: STATUS_ENUM.撤回,
    theme: 'purple',
  },
  {
    label: t('dict.ProgressStatusEnum.7'),
    value: STATUS_ENUM.已处理,
    fullName: t('dict.ProgressStatusEnum.7'),
    id: STATUS_ENUM.已处理,
    theme: 'green',
  },
  {
    label: t('dict.ProgressStatusEnum.3'),
    value: STATUS_ENUM.驳回,
    fullName: t('dict.ProgressStatusEnum.3'),
    id: STATUS_ENUM.驳回,
    theme: 'yellow',
  },
];
