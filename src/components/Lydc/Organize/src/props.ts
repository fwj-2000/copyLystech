import { propTypes } from '/@/utils/propTypes';
import { useI18n } from '/@/hooks/web/useI18n';

export const baseProps = {
  value: { type: [String, Array] as PropType<String | string[]> },
  multiple: { type: Boolean, default: false },
  placeholder: {
    type: String,
    default: () => {
      return useI18n().t('common.selectPlaceholder');
    },
  },
  disabled: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true },
  size: String,
  selectType: { type: String, default: 'all' },
  buttonType: { type: String as PropType<'' | 'select' | 'button' | undefined>, default: 'select' },
  hasSys: { type: Boolean, default: false },
  ableIds: { type: Array as PropType<string[]>, default: () => [] },
};

export const organizeSelectProps = {
  ...baseProps,
  auth: { type: Boolean, default: false },
  isOnlyOrg: { type: Boolean, default: false },
  currOrgId: { default: '0' },
  parentId: { default: '' },
  modalTitle: {
    type: String,
    default: () => {
      // 选择组织
      const { t } = useI18n();
      return t('component.lydc.organizeSelect.modalTitle');
    },
  },
  lastLevel: { type: Number, default: -1 },
};
export const depSelectProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // 选择部门
      return useI18n().t('component.lydc.depSelect.modalTitle');
    },
  },
};
export const posSelectProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // '选择岗位'
      return useI18n().t('component.lydc.posSelect.modalTitle');
    },
  },
};
export const roleSelectProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // '选择角色'
      return useI18n().t('component.lydc.roleSelect.modalTitle');
    },
  },
};
export const groupSelectProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // 选择分组
      return useI18n().t('component.lydc.groupSelect.modalTitle');
    },
  },
};
export const userSelectProps = {
  ...baseProps,
  ableRelationIds: { type: Array as PropType<string[]>, default: () => [] },
  modalTitle: {
    type: String,
    default: () => {
      // 选择用户
      return useI18n().t('component.lydc.userSelect.modalTitle');
    },
  },
};
export const usersSelectProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // 选择用户
      return useI18n().t('component.lydc.userSelect.modalTitle');
    },
  },
};

export const PNSelectProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // 选择料号
      return useI18n().t('component.lydc.pnSelect.modalTitle');
    },
  },
  value: { type: String, default: '' },
  type: { type: String, default: 'radio' },
};

export const factoryAreaProps = {
  ...baseProps,
  modalTitle: {
    type: String,
    default: () => {
      // 选择厂区
      return useI18n().t('component.lydc.factoryArea.modalTitle');
    },
  },
};

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
  label: { type: String, default: '' },
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
  placeholder: {
    type: String,
    default: () => {
      return useI18n().t('common.selectPlaceholder');
    },
  },
  searchName: { type: String, default: 'keyword' },
};

export const customUserSelectProps = {
  value: {
    type: [String, Number, Array] as PropType<String | number | string[] | number[] | [string, number][]>,
  },
  label: { type: String, default: '' },
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
  immediate: propTypes.bool.def(true),
  placeholder: {
    type: String,
    default: () => {
      return useI18n().t('common.selectPlaceholder');
    },
  },
  searchName: { type: String, default: 'keyword' },
  defaultValue: { type: String, default: null },
  alwaysLoad: { type: Boolean, default: false },
};

export const customOrganizeSelectProps = {
  auth: { type: Boolean, default: false },
  isOnlyOrg: { type: Boolean, default: false },
  value: {
    type: [String, Number, Array] as PropType<String | number | string[] | number[] | [string, number][]>,
  },
  label: { type: String, default: '' },
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
  immediate: propTypes.bool.def(true),
  placeholder: {
    type: String,
    default: () => {
      return useI18n().t('common.selectPlaceholder');
    },
  },
  searchName: { type: String, default: 'keyword' },
  defaultValue: { type: String, default: null },
};
