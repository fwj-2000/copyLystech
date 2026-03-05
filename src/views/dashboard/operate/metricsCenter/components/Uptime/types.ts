export interface LegendInfo {
  name: string;
  pc: number;
  kx: number;
  pcRate: string;
  kxRate: string;
  total: number;
}

export interface OnlineInfo {
  onlineNum: number;
  totalNum: number;
  onlineRate: string;
}

// 联机状态
export enum OnlineStatus {
  OFF = '0',
  ON = '1',
}