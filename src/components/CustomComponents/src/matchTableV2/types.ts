export interface ColumnConfig {
  type?: string;
  field: string;
  title?: string;
  width?: number;
  fixed?: string;
}

export interface TableData {
  id: string | number;
  [key: string]: any;
}

export interface OriginTableConfig {
  id: string;
  title?: string;
  name?: string;
  columns: ColumnConfig[];
  data?: TableData[];
  idField?: string;
}

export interface TargetColumnConfig {
  title: string;
  field: string;
  width: number;
}
