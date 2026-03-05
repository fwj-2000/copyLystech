import { BasicColumn } from '/@/components/Table';

// 排行层级
export enum EOrgLevel {
  BU = 'bu',
  SBU = 'sbu',
}

interface IBaseInfo extends BasicColumn {
  path?: string; // 路由跳转路径
  cssStyle?: string; // 额外的css样式
  routePath?: string;
  getRouteParams?: (searchFormValue: any, record: any) => {};
}
// 表头动态配置项
export interface IColumnsOption {
  baseInfo?: IBaseInfo;
  dataIndex?: string;
  sortable?: boolean; // 是否可排序
}
