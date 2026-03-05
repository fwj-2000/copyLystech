export interface PrintElementOption {
  left: number;
  top: number;
  height: number;
  width: number;
  title?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  lineHeight?: number;
  color?: string;
  textDecoration?: string;
  coordinateSync?: boolean;
  widthHeightSync?: boolean;
  draggable?: boolean;
  src?: string;
  fit?: string;
  field?: string;
  testData?: string;
  textType?: string;
  fixed?: boolean;
  borderStyle?: string;
  contentPaddingTop?: number;
  backgroundColor?: string;
  tableFooterRepeat?: string;
  columns?: any[][];
  fields?: Array<{ text: string; field: string }>;
  align?: string;
  tableSummary?: string;
}

export interface PrintElementType {
  title?: string;
  type: string;
}

export interface PrintElement {
  options: PrintElementOption;
  printElementType: PrintElementType;
}

export interface PrintPanel {
  index: number;
  height: number;
  width: number;
  paperHeader: number;
  paperFooter: number;
  printElements: PrintElement[];
  paperNumberLeft: number;
  paperNumberTop: number;
}
//数据类型
export interface PrintTemplate {
  panels: PrintPanel[];
}
