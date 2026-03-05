export interface FieldNames {
  label?: string;
  value?: string;
  children?: string;
}

export const baseProps = {
  options: {
    type: Array,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ value: 'id', label: 'fullName', children: 'children' }),
  },
  placeHolder: {
    type: String,
    default: '请选择',
  },
};
