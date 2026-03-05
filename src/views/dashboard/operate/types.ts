import { type Dayjs } from 'dayjs';

export enum TimeDimension {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export enum PeriodEnum {
  NON_WORKING_DAYS = '0',
  WEEKDAY = '1',
  ALL = '2',
}

// 下拉选择配置
export interface IOptions {
  label?: string;
  value: string | number;
}

export interface SearchFormValueType {
  date: Dayjs;
  dateRange?: [Dayjs, Dayjs];
  timeDimension: TimeDimension;
  orgCode?: string;
  period?: PeriodEnum;
  [key: string]: any;
}

export interface DefaultSearchFormValueType {
  date?: Dayjs;
  timeDimension?: TimeDimension;
  orgCode?: string;
  period?: PeriodEnum;
  dateRange?: [Dayjs, Dayjs];
  [key: string]: any;
}

export interface MachineDetailsSearchFormValueType {
  queryTime: Dayjs;
  type: string;
  status: string;
  orgCode: string;
  isonline: string;
  keyword: string;
}

// 提示悬浮框信息
export interface PopoverInfoList {
  title: string; // 标题
  content: string[]; // 内容
}

// 开机状态
export enum PowerOnStatus {
  ALL = '',
  OFF = '0',
  ON = '1',
}

// 组织层级字段
export enum EOrgCode {
  MQ = 'MQ', // 模切bg
}

export enum EIsONline {
  ALL = '',
  NOT_ONLINE = '0',
  ONLINE = '1',
}
