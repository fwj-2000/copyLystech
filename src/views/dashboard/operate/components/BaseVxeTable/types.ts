import { Component } from 'vue';
import { VxeGridPropTypes } from 'vxe-table';

// 默认单元格插槽类型
export enum ECellSlotType {
  FORMAT_VALUE = 'formatValue', // 格式化数值
  ROUTE_LINK = 'routeLink', // 路由跳转
  DIALOG = 'dialog', // 弹窗
}

// 筛选插槽类型
export enum EFilterSlotType {
  FILTER_VALUE = 'filterValue', // 值类型（大于小于等于
  MULTI_SEARCH_FILTER = 'multiSearchFilter', // 值类型（大于小于等于
}

// 过滤条件值
export enum EConditionValue {
  GREATER_THAN = 'greaterThan', // 大于
  LESS_THAN = 'lessThan', // 小于
  AMOUNT = 'amount', // 等于
}

// 表头动态配置类型
export enum EColumnsType {
  NORAML = 'noraml',
  DATE_VALUE_LIST = 'dateValueList', // 动态生成的数据列表
  DIMENTION_LIST = 'dimentionList', // 动态生成的维度列表
  MULTI_VALUE_LIST = 'multiValueList', // 多级表头
}

// 格式化数值方法参数
export interface IFormatValueParmas {
  val: string | number;
  isRate?: boolean;
  isH?: boolean; // 百分比是否需要乘100
  decimal?: number;
}

// 获取单元格样式的方法参数
export interface IGetCellStyleParams {
  val: string | number;
  minValue?: number; // 最小值
  isAbs?: boolean; // 是否以绝对值参考
  rollback?: boolean; // 反转标红条件
}

// 路由跳转单元格插槽必传的参数
interface IRouteLinkMth {
  getRoutePath?: (searchFormValue: Record<string, any>) => string; // 路由跳转方法
  getRouteParams?: (searchFormValue: Record<string, any>, record: Record<string, any>) => any; // 路由跳转参数方法
}

// 弹窗单元格插槽必传的参数
interface IDialogMth {
  getQuery?: (params: { row: Record<string, any>; searchFormValue: Record<string, any> }) => any; // 获取弹窗查询参数方法
}

// 所有的插槽配置
interface IColumnConfig {
  format?: Partial<IFormatValueParmas>;
  style?: Partial<IGetCellStyleParams>;
  // 弹窗类型额外配置
  dialogCompo?: Component;
  dialogAttrs?: Record<string, any>;
}

// 表头配置
export interface IColumnOption extends VxeGridPropTypes.Column, IRouteLinkMth, IDialogMth {
  isMergeRows?: boolean; // 是否合并多行数据
  isMergeCols?: boolean; // 是否合并多列数据
  customColumnType?: EColumnsType;
  config?: IColumnConfig;
}
