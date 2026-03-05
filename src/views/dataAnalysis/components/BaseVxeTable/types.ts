import { Component, Reactive, Ref } from 'vue';
import type { VxeGridInstance, VxeGridListeners, VxeGridPropTypes, VxeGridProps } from 'vxe-table';
import { ActionItem } from '/@/components/Table';

// 组件的内部属性
export interface IState {
  columns: BaseVxeTableTypes.Columns;
  baseColumns: BaseVxeTableTypes.Columns; // 基础的表头配置
  attrs: VxeGridProps<any>;
  searchFormValue: Ref<Record<string, any>>;
  actions: any; // hooks方法
  events: DeepPartial<VxeGridListeners<any>>; // 表格事件
  mergeRow?: (data: any) => void; // 初始合并方法
}
// 传入搜索hook的属性
export interface IProps {
  singleMergeSize?: number; // 单次合并次数
  isAutoQuery?: boolean;
  footerFiled?: string; // 表尾数据字段
  immediateQuery?: boolean;
  searchFormValue: Ref<Record<string, any>>;
  searchLoading?: Ref<boolean>;
  columns: Ref<VxeGridPropTypes.Columns>;
  baseColumns?: Ref<VxeGridPropTypes.Columns>; // 动态生成表头的基础表头配置信息
  attrs: Reactive<VxeGridProps<any>>;
  debounceMs?: number; // 防抖毫秒数
  events?: DeepPartial<VxeGridListeners<any>>; // 表格事件
  customFieldOptions?: Record<string, any>; // 特殊字段表头数据格式化
  api: (params: Record<string, any>, options?: any) => Promise<any>;
  getParams?: () => Record<string, any>;
  beforeQuery?: (formParams: Record<string, any>) => void;
  afterQuery?: (res: any) => any[] | void;
}
// 组件实例挂载的属性&方法
export interface IAction {
  grid: Nullable<VxeGridInstance>;
  state: IState;
  mergeConfig: {
    currentIdx: number;
    size: number;
    lastMergeSize: number;
  }; // 合并滚动优化
  reloadData: (params?: Record<string, any>) => Promise<void>;
}

// hook 返回的方法
export interface IHookAction {
  reloadData: (params: any) => Promise<void>;
  getGridInstance: () => VxeGridInstance | null;
}

// 筛选插槽类型
export enum EFilterSlot {
  // 多选搜索下拉
  MULTI_SEARCH_SELECT = 'multi_search_select',
  // 多选日期搜索下拉
  MULTI_SEARCH_SELECT_DATE = 'multi_search_select_date',
  // 多选远程下拉
  MULTI_SEARCH_SELECT_REMOTE = 'multi_search_select_remote',
}

export enum EColumnType {
  FIELD = 'field', // 普通字段
  VALUE = 'value', // 数据值类型
  DATA_LIST = 'data_list', // 数据格式 [{dateS: '厂区', valueS: '郑州模切'}]
  KEYS_VALUES = 'keys_values', // 数据格式 [{keys: '厂区', values: '郑州模切'}]
  /* 数据格式
   [{ 
      "DimKey": "2025",
      "Values": [{keys: '06-25', values: '0'}] 
    }]
  */
  Dim_KEYS_VALUES = 'dim_keys_values',
  /* 数据格式
   [{ 
      "WeekKey": "2024WK13",
      "Values": [{keys: '金额(万)', values: '0'}] 
    }]
  */
  WEEK_KEYS_VALUES = 'week_keys_values',
  /* 数据格式
   [{ 
      "monthKey": "2024WK13",
      "vlist": [{keys: '金额(万)', values: '0'}] 
    }]
  */
  MONTH_KEY_KEYS_VALUES = 'month_key_keys_values',
}

// 表头配置
export interface IColumn extends VxeGridPropTypes.Column {
  mergeConfig?: {
    needGroups?: boolean; // 是否需要排序聚合
    needMergeRow?: boolean; // 是否需要合并行
    maxMergeColCount?: 2; // 最多合并列数
    mergeRowField?: string; // 合并行依据合并的字段，默认自身值相等
  };
  params?: {
    getPathUrl?: (params: { row: any; searchFormValue: Record<string, any>; column: any }) => string; // 获取跳转路由
    getPathParams?: (params: { row: any; searchFormValue: Record<string, any>; column: any; columnIndex: number }) => Record<string, any>; // 获取跳转携带参数
    dialogueCompo?: Component; // 弹窗内容组件
    popoverComponent?: Component; // 悬浮说明组件
    getDialogueInfo?: (params: { row: any; searchFormValue: Record<string, any>; column: any }) => Record<string, any>; // 获取跳转携带参数
    getTableActions?: (row: any) => ActionItem[]; // 操作列参数
    getDefaultFilterValues?: (params: { params: Record<string, any> }) => string[]; // SELECT_REMOTE 远程默认值
    getFilters?: (params: { searchFormValue: Record<string, any> }) => Record<string, any>; //SELECT_REMOTE 远程options
  }; // 自定义插槽的传参
  columnType?: EColumnType;
  commonOption?: VxeGridPropTypes.Column; // 父子表头通用的设置
  parentOption?: VxeGridPropTypes.Column; // 父表头通用的设置
  childOption?: VxeGridPropTypes.Column; // 子表头通用的设置
  formatTitle?: (dataS: string) => string; // 格式化表头标题方法
  getChildConfig?: (params: { keys?: string; values?: string }) => object; //childOption拓展，用函数动态去加列属性
}

export enum ESlotDefault {
  LINK_DEFAULT = 'link_default', // 路由跳转
  DIALOGUE = 'dialogue', // 弹窗
  DAILY_REPORT = 'dailyReport', // 日报特供
  ACTION = 'action', // 操作
}

// 定义命名空间
export namespace BaseVxeTableTypes {
  export type Column = IColumn;
  export type Columns = IColumn[];
}
