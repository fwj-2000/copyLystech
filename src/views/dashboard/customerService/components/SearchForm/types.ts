// 单个配置项
export interface IFormItemOptions {
  type: EFormItemType; // 表单项类型
  key: string; // 搜索的参数键
  pickerKey?: string; // 日期选择联动的key
  default: any; // 默认值
  options: any[]; // 配置项
  label?: string; // 表单文本
  attrs?: Record<string, any>; // 组件的属性透传
  isOverrideDefault?: boolean; // 远程拉取是否覆盖默认值
  getOptions?: () => any; // 远程拉取配置的方法
}

// 搜索条件表单项类型
export enum EFormItemType {
  SELECT = 'select', // 下拉选择
  TREE_SELECT = 'tree_select', // 树型下拉
  RADIO_GROUP = 'radio_group', // 单选组
  DATE_PICKER = 'date_picker', // 日期选择
}
