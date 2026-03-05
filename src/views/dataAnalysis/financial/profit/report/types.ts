// 跳转配置
export interface IJumpButtonOption {
  title: string;
  getPathUrl: (searchFormValue: Record<string, any>) => string;
  getPathParams?: (searchFormValue: Record<string, any>) => Record<string, any>;
}
