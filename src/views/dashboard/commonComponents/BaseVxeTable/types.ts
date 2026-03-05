import { Reactive, Ref } from 'vue';
import type { VxeGridInstance, VxeGridListeners, VxeGridPropTypes, VxeGridProps } from 'vxe-table';

export enum EToolType {
  EXPORT = 'export',
}
// 组件的内部属性
export interface IState {
  columns: BaseVxeTableTypes.Columns;
  baseColumns: BaseVxeTableTypes.Columns; // 基础的表头配置
  attrs: VxeGridProps<any>;
  tools: EToolType[]; // 右边功能按钮
  searchFormValue: Ref<Record<string, any>>;
  actions: any; // hooks方法
  events: DeepPartial<VxeGridListeners<any>>; // 表格事件
  mergeRow?: (data: any) => void; // 初始合并方法
  getExportParams?: () => any;
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
  tools?: EToolType[]; // 右边功能按钮
  events?: DeepPartial<VxeGridListeners<any>>; // 表格事件
  customFieldOptions?: Record<string, any>; // 特殊字段表头数据格式化
  api: (params: Record<string, any>, options?: any) => Promise<any>;
  getParams?: () => Record<string, any>;
  getExportParams?: () => any;
  beforeQuery?: () => void;
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
  reloadData: (params: any) => void;
  getGridInstance: () => VxeGridInstance | null;
}

// 筛选插槽类型
export enum EFilterSlot {
  // 多选搜索下拉
  MULTI_SEARCH_SELECT = 'multi_search_select',
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
  columnType?: EColumnType;
  commonOption?: VxeGridPropTypes.Column; // 父子表头通用的设置
  parentOption?: VxeGridPropTypes.Column; // 父表头通用的设置
  childOption?: VxeGridPropTypes.Column; // 子表头通用的设置
  formatTitle?: (dataS: string) => string; // 格式化表头标题方法
}

export enum ESlotDefault {
  LINK_DEFAULT = 'link_default',
}

// 定义命名空间
export namespace BaseVxeTableTypes {
  export type Column = IColumn;
  export type Columns = IColumn[];
}
