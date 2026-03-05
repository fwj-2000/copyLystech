import { useI18n } from '/@/hooks/web/useI18n';
import { InputNumberProps } from 'ant-design-vue';
const { t } = useI18n();
// 通用下拉配置
export const commonSelectAttrs = {
  placeholder: t('common.selectPlaceholder'),
  allowClear: true,
  showSearch: true,
  dropdownMatchSelectWidth: true,
  style: { 'min-width': '84px', width: '100%' },
};
// 通用多选下拉配置
export const commonMultiSelectAttrs = {
  placeholder: '全部',
  mode: 'multiple',
  allowClear: true,
  maxTagCount: 3,
  dropdownMatchSelectWidth: false,
  style: { 'min-width': '120px' },
};
// 通用树型下拉配置
export const commonTreeSelectAttrs = {
  placeholder: t('common.selectPlaceholder'),
  dropdownMatchSelectWidth: false,
  treeDefaultExpandAll: true,
  style: { 'min-width': '84px' },
};

export const commonRangePickerAttrs = {};
export const commonInputAttrs = {
  placeholder: t('common.inputText'),
  allowClear: true,
};
export const commonInputNumberAttrs: InputNumberProps = {
  placeholder: t('common.inputText'),
  controls: false,
};
