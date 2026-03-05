/*
数据报表通用的搜索表单hook，搭配/@/views/dashboard/commonComponents/SearchForm/index组件使用
*/

import { computed, ref, unref } from 'vue';
import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

import { ISearchFormAction, ISearchFormActionInstance, ISearchFormProps, TFormItemOption } from './types';
import { isEmpty, isFunction, set } from 'lodash-es';
import { useRouteParams } from '/@/views/dashboard/commonHooks/useRouteParams';
import { getOptionList } from './utils';

export function useSearchForm(props: ISearchFormProps): [(action: ISearchFormAction) => void, ISearchFormActionInstance] {
  const { formOptions = [], commonAttrs = {}, filterOptions = [] } = props;

  const instance = ref<Nullable<ISearchFormAction>>(null);
  const { routeQuery } = useRouteQuery();
  const searchFormValue = computed(() => {
    return instance?.value?.state.searchFormValue ?? {};
  });
  const searchLoading = computed(() => {
    return instance?.value?.state.searchLoading ?? false;
  });
  const { getParams } = useRouteParams();

  const params = getParams();

  // 初始设置表单配置
  const setAllOptions = async state => {
    state.searchLoading = true;
    const commonParams = {
      routeQuery,
      initParams: {
        ...searchFormValue.value,
        ...params,
      },
      searchFormValue: state.searchFormValue,
      setSearchFormValue: (key, value) => {
        set(state.searchFormValue, key, value);
      },
    };
    state.formOptions = await getOptionList({
      ...commonParams,
      options: unref(formOptions),
    });
    state.filterOptions = await getOptionList({
      ...commonParams,
      options: unref(filterOptions),
    });
    // 路由参数赋值
    if (!isEmpty(params)) {
      Object.keys(params).forEach(key => {
        state.searchFormValue[key] = params[key];
      });
    }
    state.searchLoading = false;
  };
  const register = (action: ISearchFormAction) => {
    instance.value = action;
    const { state } = action;
    state.commonAttrs = commonAttrs;
    state.filterOptions = filterOptions as any;
    state.formOptions = formOptions as any;
    setAllOptions(state);
  };

  // 获取表单参数
  const getFormParams = () => {
    let params: any = {};
    const { state } = instance.value ?? {};
    const { filterOptions, formOptions } = state ?? {
      filterOptions: [],
      formOptions: [],
    };
    const allOptions = [...unref(filterOptions), ...unref(formOptions)];
    allOptions.forEach((item: TFormItemOption & { options }) => {
      const { getParam, options = [] } = item;
      const value = state?.searchFormValue[item.key] ?? '';
      if (isFunction(getParam)) {
        params = {
          ...params,
          ...getParam(value, searchFormValue.value, options),
        };
      } else {
        params[item.key] = value;
      }
    });
    return params;
  };

  const action: ISearchFormActionInstance = {
    searchFormValue: searchFormValue,
    searchLoading: searchLoading,
    api: {
      getFormParams,
    },
  };

  return [register, action];
}
