// 内容类型
export enum EContentType {
  IMAGE = 'image',
  COMPONENT = 'component',
}

export interface IContent {
  type?: EContentType;
  src?: string;
  component?: any; // 组件名称
  gridStyle?: React.CSSProperties;
}
