/*
FC数据指标单个内容组件封装的数据和方法
*/
import { ref, watch } from 'vue';
import { IMetricContentActionType, IMetricContentProps } from '/@/views/dashboard/customerService/types/metricContent';
import { getDynamicProps } from '/@/utils';
import { useRouteParams } from '/@/views/dashboard/commonHooks/useRouteParams';

interface IActionType extends IMetricContentActionType {
  goPath: (url: string, params?: Record<string, any>) => void;
}

export function useMetricContent(metricContentProps: IMetricContentProps): [(instance: IMetricContentActionType) => void, IActionType] {
  const { goPath } = useRouteParams();

  const metricContentAction = ref<Nullable<IMetricContentActionType>>(null);

  const register = (instance: IMetricContentActionType) => {
    metricContentAction.value = instance;
    watch(
      () => metricContentProps,
      () => {
        metricContentProps && instance.setProps(getDynamicProps(metricContentProps as any));
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const { immediateFetch = false, isAutoFetch = true, componentProps, fetchApi } = metricContentProps;
    if (immediateFetch) {
      const stop = watch(
        () => componentProps.searchLoading,
        () => {
          const { searchLoading } = componentProps;
          if (searchLoading) return; // 搜索条件还在加载中，不发起请求
          fetchApi && instance?.fetchData();
          stop();
        },
        { deep: true, immediate: false },
      );
    }
    if (isAutoFetch) {
      watch(
        [() => componentProps.searchFormValue, () => componentProps.searchLoading],
        () => {
          const { searchLoading } = componentProps;
          if (searchLoading) return; // 搜索条件还在加载中，不发起请求
          fetchApi && instance?.fetchData();
        },
        {
          deep: true,
          immediate: immediateFetch,
        },
      );
    }
  };

  const methods: IActionType = {
    fetchData: () => {
      if (metricContentAction.value?.fetchData) {
        return metricContentAction.value?.fetchData();
      }
      return Promise.reject('fetchData is not defined');
    },
    setLoading: (loading: boolean) => metricContentAction.value?.setLoading(loading),
    setProps: (props: Partial<IMetricContentProps>) => metricContentAction.value?.setProps(props),
    getCommonParams: () => metricContentAction.value?.getCommonParams() ?? {},
    goPath: (url = '', params = {}) => {
      const routeParams = {
        ...params,
        ...metricContentProps.componentProps.searchFormValue,
      };
      // // 构造路由参数
      // const path = `${url}?query=${routeQuery}`;
      goPath(url, routeParams);
    },
  };

  return [register, methods];
}
