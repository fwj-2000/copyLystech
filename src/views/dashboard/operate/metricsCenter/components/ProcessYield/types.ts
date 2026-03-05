export interface LegendInfo {
  name: string;
  pc: number;
  kx: number;
  pcRate: string;
  kxRate: string;
  total: number;
}
export interface PropsInfo {
  title: string;
  data: Array<LegendInfo>;
}
