// 工序规则模板类型
export enum procRuleTempEnum {
  StringType = 1,
  DecimalType = 2,
  IntType = 3,
  DateType = 4,
  TimeType = 5,
  DictType = 6,
  ApiType = 7,
  Personnel = 8,
  Organize = 9,
  Upload = 10,
}

export interface TempItem {
  fieldConfigId: string;
  fieldCnName: string;
  fieldEnName: string;
  fieldValue: any;
  isRequired: number;
  isDisabled: number;
  templateList?: Array<{ label: string; value: string }>; // 使用可选属性以允许额外字段
  dataType: number;
  status: number;
  dataSources: string;
  [key: string]: any;
}
