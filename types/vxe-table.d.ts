/**
 * vxe-table 扩展类型定义
 */
import type { VxeColumnPropTypes } from 'vxe-table';

import 'vxe-table';

/** 高级筛选 自定义参数 */
interface AqpFilter extends VxeColumnPropTypes.FilterRender, VxeColumnPropTypes.CellRender {
  /** 是否启用 */
  enabled?: boolean;
  /** 指定传值类型 */
  cSharpType?: string;
  /** 指定搜索字段 */
  searchField?: string;
}

declare module 'vxe-table' {
  namespace VxeTableDefines {
    interface ColumnOptions {
      /** 国际化字段，优先级高于`field` */
      i18nField?: string;
      /** 高级筛选 自定义参数 */
      aqpFilter?: AqpFilter;
    }

    interface ColumnInfo {
      /** 国际化字段，优先级高于`field` */
      i18nField?: string;
    }
  }

  namespace VxeColumnPropTypes {
    interface CellRender {
      /** 单元格渲染组件为`Date`时，日期格式 */
      format?: string;
      /** 单元格渲染组件为`Remark`时，从格式为`[{"node":"节点code","remark":"备注信息"}]`的字符串中，获取对应节点的节点编码 */
      nodeCode?: string;
      /** 开启高级筛选时，使用`CellRender.cSharpType`的配置，指定传值类型 */
      cSharpType?: string;
      /** 开启高级筛选时，使用`CellRender.searchField`的配置，指定搜索字段 */
      searchField?: string;
    }

    interface EditRender {
      /** `ApiSelect`名称缓存字段 */
      cacheField?: string;
      /** `ApiSelect`自动使用`defaultLabel`参数 */
      isDefaultLabel?: boolean;
      /** 是否双击表头 */
      dblClickHead?: boolean;
    }

    interface FilterRender {
      /** 开启高级筛选时，使用`FilterRender.cSharpType`的配置，指定传值类型 */
      cSharpType?: string;
      /** 开启高级筛选时，使用`FilterRender.searchField`的配置，指定搜索字段 */
      searchField?: string;
    }
  }

  interface VxeGridProps {
    /** 是否显示索引列 */
    showIndexColumn?: boolean;
    /** 表格列国际化配置 */
    i18nConfig?: {
      /** 国际化编码 */
      moduleCode?: string;
      /** 其他配置 */
      otherConfig?: {
        /** 最小宽度 */
        minWidth?: number;
        /** 自适应 */
        resizeable?: boolean;
      };
    };
    /** 判断当前表格所处的位置，进行样式调整，默认为`page` */
    position?: 'modal' | 'page';
  }
}
