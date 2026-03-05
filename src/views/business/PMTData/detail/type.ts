/** 详情页面信息 */
type DetailPageInfoType = {
  [rowType: string]: {
    /** 获取列配置 */
    getColumns: (params?: any) => Array<any>;
    /** 表单配置 */
    schemas: Array<any>;
    /** 获取页面请求 */
    api: (params?: any) => Promise<any>;
    /** 设置页面跳转参数 */
    getQuery?: (row: any) => Record<string, any>;
  };
};

/** 定义每个列表项的类型（根据实际数据结构补充字段） */
interface IDictionaryItem {
  enCode: string;
  fullName: string;
  [key: string]: any;
}
