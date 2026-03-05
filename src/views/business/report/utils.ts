import type { FormActionType } from '/@/components/Form';

import { useBaseStore } from '/@/store/modules/base';

import { useI18n } from '/@/hooks/web/useI18n';

/**
 * @description 从联合类型中提取出数组类型
 */
type PickArray<T> = T extends Array<any> ? T : never;

const baseStore = useBaseStore();

const { t } = useI18n();

/**
 * @description 从数据字典中，获取并设置筛选表单中`select`的可选项
 * @param formInstance 表单实例
 * @param dictCode 字典编码
 * @param field 筛选字段名称
 */
export async function setSearchFormOpiotns(formInstance: FormActionType, dictCode: string, field: string) {
  if (!formInstance || !dictCode || !field) {
    throw new Error('缺少参数');
  }

  return baseStore.getDictionaryData(dictCode).then(options => {
    formInstance.updateSchema({
      field,
      componentProps: {
        options: (options as PickArray<typeof options>).map(item => ({ id: item.enCode, fullName: item.fullName })),
      },
    });
  });
}

/**
 * 生产类型选项
 */
export const productTypeOptions = [
  { id: 1, fullName: t('dict.ProductionTypeEnum.Self'), value: 1, label: t('dict.ProductionTypeEnum.Self') },
  { id: 2, fullName: t('dict.ProductionTypeEnum.Outsourcing'), value: 2, label: t('dict.ProductionTypeEnum.Outsourcing') },
];

export function getLabelByOptions(value: number | string, defaultLabel: string, options: Array<{ value: number | string; label: string }>) {
  if (!Array.isArray(options) || options.length === 0) {
    return defaultLabel;
  }
  return options.find(item => item.value === value)?.label || defaultLabel;
}

/**
 * 获取`是否`的翻译语言文本
 * @param value
 * @param defaultLabel
 * @param options
 */
export function getYesOrNoLabel(
  value: number | string,
  defaultLabel = '',
  options = [
    { value: 1, label: t('common.yes') },
    { value: 0, label: t('common.no') },
  ],
) {
  return getLabelByOptions(value, defaultLabel, options);
}

export function getProductTypeLabel(value: number | string, defaultLabel = '', options = productTypeOptions) {
  return getLabelByOptions(value, defaultLabel, options);
}

const statusOptions = [
  { value: 6, label: t('common.todoText') },
  { value: 7, label: t('common.doneText') },
  { value: 5, label: t('common.endding') },
  { value: 2, label: t('common.stopText') },
  { value: 3, label: t('common.rejectText') },
];
export function getStatusLabel(value: number | string, defaultLabel = '', options = statusOptions) {
  return getLabelByOptions(value, defaultLabel, options);
}

export function getDFMLabel(
  value: number | string,
  defaultLabel = '',
  options = [
    { value: 1, label: t('common.yes') },
    { value: 2, label: t('common.no') },
  ],
) {
  return getLabelByOptions(value, defaultLabel, options);
}

export function getMakeEngineeringInfoLabel(
  value: number | string,
  defaultLabel = '',
  options = [
    { value: 1, label: t('dict.DrawingsReview.MakeEngineeringInfo.1') },
    { value: 2, label: t('dict.DrawingsReview.MakeEngineeringInfo.2') },
  ],
) {
  return getLabelByOptions(value, defaultLabel, options);
}
