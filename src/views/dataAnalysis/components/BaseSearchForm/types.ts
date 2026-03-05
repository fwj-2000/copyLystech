import { Ref } from 'vue';
import Api from './api';
import type { InputProps, InputNumberProps, SelectProps, TreeSelectProps, RadioGroupProps, DatePickerProps, TimeRangePickerProps } from 'ant-design-vue';
// 搜索条件表单项类型
export enum EFormItemType {
  SELECT = 'select', // 下拉选择
  INPUT = 'input', // 输入框
  TREE_SELECT = 'tree_select', // 树型下拉
  RADIO_GROUP = 'radio_group', // 单选组
  RANGE_PICKER = 'range_picker', // 单选组
  DATE_PICKER = 'date_picker', // 日期选择
  RANGE_INPUT = 'range_input', // 范围输入
  NUMBER_INPUT = 'number_input', // 数字输入框
}

export interface ITreeSelectOption {
  id: string; // 本身的id
  parentId: string; // 父级id
  text: string; // 文本
  value: string; // 值
  level: string; // 层级
  disabled?: boolean; // 是否禁用
}
export interface ISelectOption {
  text: string; // 文本
  value: string; // 值
}

interface ISelectConfig {
  type: EFormItemType.SELECT;
  isDropdownBtn?: boolean; // 是否显示下拉按钮
  options: ISelectOption[]; // 配置项
  isOverrideDefault?: boolean; // 远程拉取是否覆盖默认值
  getOptions?: () => Promise<ISelectOption[]>; // 远程拉取配置的方法
  attrs?: Partial<SelectProps> & Record<string, any>; // 支持多余属性
}
interface ITreeSelectConfig {
  type: EFormItemType.TREE_SELECT;
  options: ITreeSelectOption[]; // 配置项
  getOptions?: () => Promise<ITreeSelectOption[]>; // 远程拉取配置的方法
  attrs?: Partial<TreeSelectProps> & Record<string, any>; // 支持多余属性
}
interface IRadioGroupConfig {
  type: EFormItemType.RADIO_GROUP;
  options: ISelectOption[]; // 配置项
  attrs?: Partial<RadioGroupProps> & Record<string, any>; // 支持多余属性
}
interface IRangePickerConfig {
  type: EFormItemType.RANGE_PICKER;
  pickerKey?: string;
  attrs?: Partial<TimeRangePickerProps> & Record<string, any>; // 支持多余属性
}
interface IDatePickerConfig {
  pickerKey?: string;
  type: EFormItemType.DATE_PICKER;
  attrs?: Partial<DatePickerProps> & Record<string, any>; // 支持多余属性
}
interface IInputConfig {
  type: EFormItemType.INPUT;
  attrs?: Partial<InputProps> & Record<string, any>; // 支持多余属性
}
interface IInputNumberInutConfig {
  type: EFormItemType.NUMBER_INPUT;
  attrs?: Partial<InputNumberProps> & Record<string, any>; // 支持多余属性
}
interface IRangeInputConfig {
  default: {
    start: string; // 开始
    end: string; // 结束
  }; // 默认值
  type: EFormItemType.RANGE_INPUT;
  attrs?: Partial<InputProps> & Record<string, any>;
}

export type TFormItemOption = {
  key: string; // 搜索的参数键
  default?: any; // 默认值
  isHide?: boolean; // 是否隐藏
  label?: string; // 表单文本
  isOverrideDefault?: boolean; // 远程拉取是否覆盖默认值
  // attrs?: Record<string, any>; // 组件的属性透传
  setDefault?: (options: any[], routeQuery: Record<string, any>) => any; // 设置默认值的方法
  getParam?: (value: any, searchFormValue: Record<string, any>, options?: (ITreeSelectOption | ISelectOption)[]) => Record<string, any>; // 获取请求参数
} & (
  | ISelectConfig
  | ITreeSelectConfig
  | IRadioGroupConfig
  | IRangePickerConfig
  | IDatePickerConfig
  | IInputConfig
  | IRangeInputConfig
  | IInputNumberInutConfig
);

// hook 入参
export interface IHookOptions {
  commonAttrs?: Record<string, any>;
  formOptions: TFormItemOption[]; // 不可以监听变化
  filterOptions?: Ref<TFormItemOption[]> | TFormItemOption[]; // 可以监听变化
}

// 搜索组件的props
export interface IProps extends IHookOptions {
  api: Api;
}

// 组件内部属性状态
export interface ISearchFormState {
  isExtendFilters: boolean; // 是否展开条件
  searchFormValue: Record<string, any>;
  searchLoading: boolean;
  formOptions: TFormItemOption[];
  filterOptions: TFormItemOption[];
}

// 排行层级
export enum EOrgLevel {
  BU = '3',
  SBU = '4',
}

export enum ETimeDimension {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}
