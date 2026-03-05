export interface ProcessYieldItem {
  dimStr: string;
  list: Array<{
    processes: string;
    yield: Array<{ project: string; rate: number }>;
  }>;
}
