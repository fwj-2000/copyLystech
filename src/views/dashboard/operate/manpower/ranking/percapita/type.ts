import { BasicColumn } from '/@/components/Table';
import { SearchFormValueType } from '/@/views/dashboard/operate/types';

// 表格项插槽类型
export enum ETableCellSlotType {
  RANKING = 'ranking',
  LINK = 'link',
}

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

// 获取表格配置信息的参数
export interface IGetColumnsOptionParams {
  columns: BasicColumn[];
  searchFormValue?: SearchFormValueType;
  dataSource?: Recordable<any>[];
}
