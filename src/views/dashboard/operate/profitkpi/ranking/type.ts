import { SearchFormValueType, DefaultSearchFormValueType } from '/@/views/dashboard/operate/types';
import { BasicColumn } from '/@/components/Table';

interface IBaseInfo extends BasicColumn {
  type?: ETableCellSlotType; // 表格项插槽类型
  path?: string; // 路由跳转路径
  cssStyle?: string; // 额外的css样式
  routePath?: string;
  getRoutePath?: (params: { searchFormValue: any; record: any }) => string; // 动态获取路由路径
  getRouteParams?: (searchFormValue: any, record: any) => {};
}
// 表头动态配置项
export interface IColumnsOption {
  baseInfo?: IBaseInfo;
  dataIndex?: string;
  sortable?: boolean; // 是否可排序
}

// 表格项插槽类型
export enum ETableCellSlotType {
  RANKING = 'ranking',
  LINK = 'link',
}

// 获取表格配置信息的参数
export interface IGetColumnsOptionsParams {
  columns: IColumnsOption[];
  searchFormValue?: SearchFormValueType;
  dataSource?: Recordable<any>[];
}

// 单个页面配置信息
export interface IPageInfo {
  defaultSearchFormValue?: DefaultSearchFormValueType; // 额外搜索条件的默认值，有必传
  getColumnsOptions: (params: { itemName: String; dataSource: Recordable<any>[]; searchFormValue: SearchFormValueType }) => IColumnsOption[]; // 表格字段配置
  api: (queryParams: any, searchFormValue: SearchFormValueType) => Promise<any>; // 表格请求接口
}

// 排行层级
export enum EOrgLevel {
  BU = 'bu',
  SBU = 'sbu',
}
