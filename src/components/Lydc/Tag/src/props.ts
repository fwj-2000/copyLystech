import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export interface FieldNames {
  label?: string;
  value?: string;
  disabled?: string;
  options?: string;
}

export const selectProps = {
  value: {
    type: [String, Number, Array] as PropType<String | number | string[] | number[] | [string, number][]>,
  },
  options: {
    type: Array,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ value: 'id', label: 'fullName', disabled: 'disabled' }),
  },
  optionFilterProp: { type: String },
  multiple: { type: Boolean, default: false },
  mode: { type: String, default: '' },
  placeholder: { type: String, default: t('common.selectPlaceholder') },
  dispatchChange: {
    type: Boolean,
    default: false,
  },
};
