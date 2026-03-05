import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * @description tabs类型枚举
 */
export enum TABS_ENUM {
  待处理 = '41',
  已处理 = '42',
}

/**
 * 需求类型枚举
 */
export enum DEMAND_TYPE_ENUM {
  // 在库维修——对应模具维修
  在库维修 = '1',
  // 生产退模——对应异常通知单
  生产退模 = '2',
}

/**
 * 需求类型选项
 */
export const demandTypeOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
baseStore.getDictionaryData('MoldRepairDemandType').then((res: Array<any>) => {
  demandTypeOptions.push(
    ...res.map(item => {
      return {
        ...item,
        value: item.id,
        label: item.fullName,
      };
    }),
  );
});

/**
 * 状态枚举
 */
export enum STATUS_ENUM {
  待处理 = 6,
  撤回 = 4,
  已处理 = 7,
  驳回 = 3,
}

export const statusOptions = [
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
