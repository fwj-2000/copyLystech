// 页面共用标识
export enum SharePageType {
  PrePrint = 'PrePrint',
  StartWork = 'StartWork',
  Change = 'Change',
  SplitPrint = 'SplitPrint',
}

// 工序类型 or  页面类型
export enum OperationType {
  Exchange = '流转',
  ApplyWork = '报工',
  PrePrint = '预打印',
  StartWork = '开工',
  Change = '转换',
  SplitPrint = '分切打印',
}
export const OperationTypeValue = {
  Exchange: '1',
  ApplyWork: '2',
  PrePrint: '3',
  SplitPrint: '4',
};

export const STARTWORKSTATUS_OPTIONS = [
  { id: 0, theme: 'gray', rowKey: 'statusName' },
  { id: 1, theme: 'gray', rowKey: 'statusName' },
  { id: 2, theme: 'blue', rowKey: 'statusName' },
  { id: 3, theme: 'yellow', rowKey: 'statusName' },
  { id: 4, theme: 'green', rowKey: 'statusName' },
];
