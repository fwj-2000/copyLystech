export interface IComponentProps {
  searchLoading?: Boolean;
  searchFormValue: Record<string, any>;
}
export interface IMetricContentProps {
  componentProps: IComponentProps;
  immediateFetch?: boolean;
  isAutoFetch?: boolean;
  fetchApi?: (...arg: any) => Promise<any>;
  getParams?: (commonParams: any) => Record<string, any>;
  beforeFetch?: () => void; // 请求前方法
  afterFetch?: (resData: any) => void; // 搜索结果处理
}

export interface IMetricContentActionType {
  getCommonParams: () => Record<string, any>;
  fetchData: () => Promise<Recordable<any>[] | undefined>; //
  setProps: (props: Partial<IMetricContentProps>) => void;
  setLoading: (loading: boolean) => void;
}
