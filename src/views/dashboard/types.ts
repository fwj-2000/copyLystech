import { options } from '@fullcalendar/core/preact';
import { Dayjs } from 'dayjs';
import { TimeDimension } from './operate/types';
import { BasicColumn } from '/@/components/Table';
import { Component } from 'vue';

// 表头动态配置类型
export enum EColumnsType {
  NORAML = 'noraml',
  DATE_VALUE_LIST = 'dateValueList', // 动态生成的数据列表
  WEEK_VALUE_LIST = 'weekValueList', // 动态生成周结的数据列表
  DIMENTION_LIST = 'dimentionList', // 动态生成的维度列表
}

// 单元格类型
export enum ECellType {
  NORMAL = 'normal', // 普通单元格
  LINK = 'link', // 跳转单元格
  DIALOG = 'dialog', // 弹窗
}

// 表头动态配置项
export interface IColumnOptions extends BasicColumn {
  type?: EColumnsType; // 类型
  sortable?: boolean; // 是否可排序
  filterable?: boolean; // 是否可筛选
  isRowSpan?: boolean; // 是否开启合并单元格
  hideBG?: boolean; // 是否隐藏背景色
  cellType?: ECellType; // 单元格类型
  rowSpanProps?: string; // 合并单元格参考的字段
  getPathUrl?: (params: { searchFormValue: any; record: Record<string, any>; column: IColumnOptions; organizeMapInfo: Record<string, any> }) => string; // 点击单元格跳转的方法
  headerCellBgColor?: string; // 表头自定义颜色
  getQuery?: (params: { searchFormValue: any; record: Record<string, any>; getDateDimParams: () => Record<string, string> }) => {}; // 查询信息
  dialogCompo?: Component; // 弹窗组件
  children?: (IColumnOptions & any)[]; // 子表格配置
  getTitleBySearch?: (params: { searchFormValue: Record<string, any>; dateDim: Record<string, any> }) => string; // 自定义表头标题
  baseInfo?: BasicColumn;
}

// 下拉选择的配置
export interface IOption {
  text?: string; // 下拉选择展示文字
  width?: number; // 下拉选择宽度
  props: string; // 下拉选择传递的键
  default?: any; // 默认值
  options: {
    label: string;
    value: any;
  }[]; // 下拉选择具体配置
}

export interface SearchFormValueType {
  date: Dayjs;
  dateRange?: [Dayjs, Dayjs];
  timeDimension?: TimeDimension;
  orgCode: string;
  [key: string]: any;
}

// 折线图配置
export interface IMetricKeyConfigList {
  key: string; // 取值的键
  name: string; // 指标名称
  color: string; // 图例的颜色
  suffix?: string; // 后缀
  labelPos?: 'top' | 'bottom' | 'insideTop';
  labelStyle?: any; // 标签样式
}

export interface ILineListData {
  value: string; // 数据值
  line: Record<string, any>; // 当前线条完整数据
}

export enum ETimeDimension {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export interface Options {
  label: string;
  value: any;
}
