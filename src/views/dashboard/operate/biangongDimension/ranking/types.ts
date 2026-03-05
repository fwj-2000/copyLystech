import { CSSProperties } from 'vue';

export interface IAnalysisInfo {
  type: 'text' | 'value';
  content: string | number;
  style?: CSSProperties;
}
