import type { VxeGridListeners, VxeGridPropTypes, VxeGridProps as VxeTableGridProps, VxeUIExport } from 'vxe-table';

import type { Ref } from 'vue';

import type { VbenFormProps } from '/@/components/VxeTable/ui-kit/form-ui/src/types';

import type { VxeGridApi } from './api';

import { useVbenForm } from '/@/components/VxeTable/ui-kit/form-ui/src/index';
import { FormApi } from '/@/components/VxeTable/ui-kit/form-ui/src/form-api';

export interface VxePaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

export type ExtendedFormApi = FormApi & {
  useStore: <T = NoInfer<VbenFormProps>>(selector?: (state: NoInfer<VbenFormProps>) => T) => Readonly<Ref<T>>;
};

interface ToolbarConfigOptions extends VxeGridPropTypes.ToolbarConfig {
  /** 是否显示切换搜索表单的按钮 */
  search?: boolean;
  /** 是否展示 `显示删除数据` 的按钮 */
  delStatus?: boolean;
  /** 是否展示 `高级查询` 的按钮 */
  superQuery?: boolean;
  /** 是否展示 `一键展开子表` 按钮 */
  expandAll?: boolean;
}

// 定义包含 i18nField 的列类型
export interface ColumnWithI18n extends VxeGridPropTypes.Column {
  /** 国际化字段 */
  i18nField?: string;
  /** 国际化追加参数, 例如`t(xxx, i18nParams)` */
  i18nParams?: Record<string, any> | Array<string>;
  /** 子列配置 */
  children?: ColumnWithI18n[];
}

export interface VxeTableGridOptions<T = any> extends VxeTableGridProps<T> {
  /** 工具栏配置 */
  toolbarConfig?: ToolbarConfigOptions;
  /** API 请求函数 */
  api?: () => Promise<any>;
  /** 请求前处理函数 */
  beforeFetch?: (params: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
  /** 请求后处理函数 */
  afterFetch?: (result: any) => void;
  /**
   * 表格列国际化配置
   */
  i18nConfig?: {
    moduleCode: string;
    /** 其他配置 */
    otherConfig?: {
      /** 最小宽度 */
      minWidth: number;
      /** 自适应 */
      resizeable: boolean;
    };
  };
  /** 是否显示序号列 */
  showIndexColumn?: boolean;
  /** 是否关闭首次加载 */
  closeFirstLoad?: boolean;
  /** 列配置 */
  columns?: ColumnWithI18n[];
}

export interface VxeGridProps {
  /**
   * 标题
   */
  tableTitle?: string;
  /**
   * 标题帮助
   */
  tableTitleHelp?: string;
  /**
   * 组件class
   */
  class?: ClassType;
  /**
   * vxe-grid class
   */
  gridClass?: ClassType;
  /**
   * vxe-grid 配置
   */
  gridOptions?: DeepPartial<VxeTableGridOptions>;
  /**
   * vxe-grid 事件
   */
  gridEvents?: DeepPartial<VxeGridListeners>;
  /**
   * 表单配置
   */
  formOptions?: VbenFormProps;
  /**
   * 显示搜索表单
   */
  showSearchForm?: boolean;
}

export type ExtendedVxeGridApi = VxeGridApi & {
  useStore: <T = NoInfer<VxeGridProps>>(selector?: (state: NoInfer<VxeGridProps>) => T) => Readonly<Ref<T>>;
  expandAll?: () => void;
  collapseAll?: () => void;
  setExpandStateHandler?: (handler: (expanded: boolean) => void) => void;
};

export interface SetupVxeTable {
  configVxeTable: (ui: VxeUIExport) => void;
  useVbenForm: typeof useVbenForm;
}
