import { Component } from "vue";

export interface MetricInfo {
  label: string; // 展示的文字
  value: string; // 展示的值
}

export interface TextReportInfo {
  image: string; // 图片内容
  main: MetricInfo; // 主要展示指标
  secondary: MetricInfo[]; // 次要展示指标
};

// 自定义组件信息
export interface CustomCompoInfo {
  id: number; // 组件id
  name: string; // 组件名称
  disabled: Boolean; // 是否禁止拖拽
  block: number; // 组件占用宽度
  show: Boolean; // 是否展示
  values?: any,
  component: Component; // 组件引用
}

// 图标文字图例信息
export interface LegendValue {
  label: string,
  value: string | number,
}