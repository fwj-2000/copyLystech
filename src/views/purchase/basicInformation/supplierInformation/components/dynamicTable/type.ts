export interface InitParams {
  title: string; // 标题
  columns: any; // 表头
  template?: any; // 模板
  showAddBtn?: boolean; // 是否显示新增按钮
  showActions?: boolean; // 是否显示操作按钮
  tableData?: any; // 数据源
  openModel?: 'add' | 'edit' | 'view'; // 打开模式
}
