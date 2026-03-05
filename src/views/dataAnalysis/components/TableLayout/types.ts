import { Reactive, Ref } from 'vue';
import Api from './api';

import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { VxeGridPropTypes, VxeGridProps } from 'vxe-table';
import { MenuItemType } from '../BatchMenu/types';

export interface IHookOptions {
  // 表单属性
  formConfig: {
    enabled?: Boolean;
    commonAttrs?: Record<string, any>;
    formOptions: TFormItemOption[];
    filterOptions?: Ref<TFormItemOption[]> | TFormItemOption[];
  };
  // 表格属性
  tableConfig: {
    isFrontPagination?: boolean; // 是否前端实现分页
    columns: Ref<VxeGridPropTypes.Columns> | VxeGridPropTypes.Columns;
    attrs: Reactive<VxeGridProps<any>>;
    customFieldOptions?: Record<string, any>; // 特殊字段表头数据格式化
    footerFiled?: string; // 表尾数据字段名
    batchAuth?: string; // 批量导出按钮权限名
    beforeQuery?: (formParams: Record<string, any>) => void;
    afterQuery?: (res: any) => any;
    getExportParams?: () => any;
    getQueryExtraParams?: () => Record<string, any>; // 额外查询参数
    api: (params: Record<string, any>, options?: any) => Promise<any>;
    formatFrontData?: (data: any[]) => any[]; // 前端分页格式化返回列表
  };
  // 右侧功能按钮配置
  toolbarConfig?: {
    batchMenuItems?: MenuItemType[];
    baseExportMethod?: () => void; // 导出表格数据方法
  };
}

export interface IProps extends IHookOptions {
  api: Api;
}

// 前端分页缓存数据
export interface ICacheInfo {
  cacheData: any[]; // 前端分页缓存数据
  lastParams: Record<string, any>; // 上次请求参数
  result: any; // 请求完整的结果
}

// 跳转按钮配置
export interface IJumpButtonOption {
  title: string;
  getPathUrl: (formParams: Record<string, any>, searchFormValue: Record<string, any>) => string;
  getPathParams?: (formParams: Record<string, any>, searchFormValue: Record<string, any>) => Record<string, any>;
}
