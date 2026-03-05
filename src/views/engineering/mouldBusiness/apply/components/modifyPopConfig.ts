import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/** 模具修改类型，分为：模具图纸、基础信息、暂停制作、重启制作、申请终止 */
export enum MOLD_MODIFY_TYPE {
  模具图纸 = '1',
  基础信息 = '2',
  暂停制作 = '3',
  重启制作 = '4',
  申请终止 = '5',
}

/** 模具修改类型 选项 */
export const modifyTypeOptions = [
  // 模具图纸
  { label: t('dict.MoldApply.ModifyType.1'), value: MOLD_MODIFY_TYPE.模具图纸 },
  // 基础信息
  { label: t('dict.MoldApply.ModifyType.2'), value: MOLD_MODIFY_TYPE.基础信息 },
  // 暂停制作
  { label: t('dict.MoldApply.ModifyType.3'), value: MOLD_MODIFY_TYPE.暂停制作 },
  // 重启制作
  { label: t('dict.MoldApply.ModifyType.4'), value: MOLD_MODIFY_TYPE.重启制作 },
  // 申请终止
  { label: t('dict.MoldApply.ModifyType.5'), value: MOLD_MODIFY_TYPE.申请终止 },
];

export { getAddEeditRules as getEditRules } from '/@/views/engineering/mouldBusiness/apply/components/config';
