import { LinearGradientObject } from 'echarts';

// 指标ke值配置
export interface IMetricKey {
  field: string;
  name: string;
}

// 单个指标配置
export interface IMetricConfig {
  type?: 'bar' | 'line';
  fieldKey?: string;
  metric: string;
  data: number[];
  lineColor?: string;
  itemColor?: string;
  linearItemColor?: LinearGradientObject;
  suffix: string;
  yAxisIndex: number;
}
