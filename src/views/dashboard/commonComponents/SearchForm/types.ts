import { Reactive, Ref } from 'vue';

// 搜索条件表单项类型
export enum EFormItemType {
  SELECT = 'select', // 下拉选择
  INPUT = 'input', // 输入框
  TREE_SELECT = 'tree_select', // 树型下拉
  RADIO_GROUP = 'radio_group', // 单选组
  RANGE_PICKER = 'range_picker', // 单选组
  DATE_PICKER = 'date_picker', // 日期选择
}

export interface ITreeSelectOption {
  id: string; // 本身的id
  parentId: string; // 父级id
  text: string; // 文本
  value: string; // 值
}
export interface ISelectOption {
  text: string; // 文本
  value: string; // 值
}

interface ISelectConfig {
  type: EFormItemType.SELECT;
  options: ISelectOption[]; // 配置项
  isOverrideDefault?: boolean; // 远程拉取是否覆盖默认值
  getOptions?: () => Promise<ISelectOption[]>; // 远程拉取配置的方法
}
interface ITreeSelectConfig {
  type: EFormItemType.TREE_SELECT;
  options: ITreeSelectOption[]; // 配置项
  getOptions?: () => Promise<ITreeSelectOption[]>; // 远程拉取配置的方法
}
interface IRadioGroupConfig {
  type: EFormItemType.RADIO_GROUP;
  options: ISelectOption[]; // 配置项
}
interface IRangePickerConfig {
  type: EFormItemType.RANGE_PICKER;
  pickerKey?: string;
}
interface IDatePickerConfig {
  pickerKey?: string;
  type: EFormItemType.DATE_PICKER;
}
interface IInputConfig {
  type: EFormItemType.INPUT;
}

export type TFormItemOption = {
  key: string; // 搜索的参数键
  default: any; // 默认值
  label?: string; // 表单文本
  isOverrideDefault?: boolean; // 远程拉取是否覆盖默认值
  attrs?: Record<string, any>; // 组件的属性透传
  setDefault?: (options: any[], routeQuery: Record<string, any>) => any; // 设置默认值的方法
  getParam?: (value: any, searchFormValue: Record<string, any>, options?: (ITreeSelectOption | ISelectOption)[]) => Record<string, any>; // 获取请求参数
} & (ISelectConfig | ITreeSelectConfig | IRadioGroupConfig | IRangePickerConfig | IDatePickerConfig | IInputConfig);

// 搜索组件的内部属性
export interface ISearchFormState {
  searchFormValue: Record<string, any>;
  searchLoading: boolean;
  formOptions: Ref<TFormItemOption[]> | TFormItemOption[];
  filterOptions: Ref<TFormItemOption[]> | TFormItemOption[];
  commonAttrs?: Record<string, any>;
}
// 传入搜索hook的属性
export interface ISearchFormProps {
  filterOptions?: Ref<TFormItemOption[]> | TFormItemOption[];
  commonAttrs?: Record<string, any>;
  formOptions: Ref<TFormItemOption[]> | TFormItemOption[];
}
// 搜索hook返回的属性&方法
export interface ISearchFormActionInstance {
  searchFormValue: Ref<Record<string, any>>;
  searchLoading: Ref<boolean>;
  api: {
    getFormParams: () => Record<string, any>;
  };
}
// 搜索组件实例挂载的属性&方法
export interface ISearchFormAction {
  state: Reactive<ISearchFormState>;
}
