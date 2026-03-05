export interface InitParams {
  title: string; // 标题
  columns: any; // 表头
  template?: any; // 模板
  showAddBtn?: boolean; // 是否显示新增按钮
  showActions?: boolean; // 是否显示操作按钮
  tableData?: any; // 数据源
  openModel?: 'add' | 'edit' | 'view'; // 打开模式
}

export enum opreaMap {
  基础信息 = 'baseinfo',
  外观 = 'externals',
  尺寸 = 'dimensions',
  包规 = 'packageSpecification',
  角度 = 'angle',
  高度 = 'height',
  最终判定结果 = 'finalDeterminationResult',
}
