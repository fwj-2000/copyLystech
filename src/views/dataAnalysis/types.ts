import { ItemType } from 'ant-design-vue';

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

export interface DateDetail {
  year: number; // 物理年份
  month: number; // 月份 (1-12)
  monthStr: string; // 月份字符串 (01-12)
  day: number; // 几号
  week: number; // ISO 周数
  weekStr: string; // 周数字符串 (01-52)
  weekYear: number; // 周所属年份
  fullString: string; // 格式化字符串
}
