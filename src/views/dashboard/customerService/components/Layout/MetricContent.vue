<!-- 单个项内容封装 -->
<template>
  <div v-if="isActiveLoading || isLoading || innerProps?.componentProps?.searchLoading" class="w-[100%] h-[100%] flex">
    <a-spin :spinning="isLoading"> </a-spin>
  </div>
  <template v-else>
    <!-- 数据为空展示 -->
    <emptyData v-if="isEmptyData"></emptyData>
    <!-- 内容 -->
    <slot v-else />
  </template>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { isEmpty, isFunction } from 'lodash-es';
  import { useRoute } from 'vue-router';
  import { getCommonReqParams } from '/@/views/dashboard/customerService/utils';

  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import { IMetricContentProps } from '/@/views/dashboard/customerService/types/metricContent';
  import { isCancel } from 'axios';

  const innerProps = ref<IMetricContentProps>({
    componentProps: {
      searchLoading: false,
      searchFormValue: {},
    },
  });
  const isLoading = ref(true);
  const isActiveLoading = ref(false);
  const isEmptyData = ref(false);
  const route = useRoute();
  const requestController = ref<Nullable<AbortController>>(null);
  const emits = defineEmits(['register']);

  // 获取通用请求参数
  const getCommonParams = () => {
    const { searchFormValue = {} } = innerProps.value?.componentProps;
    const routeQuery = (route?.query as Record<string, string>) ?? {};

    return {
      ...routeQuery,
      ...getCommonReqParams(searchFormValue),
    };
  };
  // 请求方法
  const fetchMth = () => {
    const { fetchApi = null, getParams = null, afterFetch = null, beforeFetch = null } = innerProps.value;
    if (isFunction(beforeFetch)) {
      beforeFetch();
    }
    let params = getCommonParams();
    if (isFunction(getParams)) {
      params = getParams(params) as any;
    }
    if (!fetchApi) {
      return Promise.reject('fetchApi is not defined');
    }
    if (requestController.value) {
      requestController.value.abort();
      requestController.value = null;
    }
    requestController.value = new AbortController();
    return new Promise((resolve, reject) => {
      fetchApi(
        {
          ...params,
        },
        {
          signal: requestController.value?.signal,
        },
      )
        .then(res => {
          const resData = res.data as any;
          if (isEmpty(resData)) {
            return resolve({});
          }
          if (isFunction(afterFetch)) {
            afterFetch(resData);
          }
          resolve(resData); // 记得将结果resolve，处理加载状态
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  const fetchData = () => {
    isLoading.value = true;
    fetchMth()
      .then(res => {
        isLoading.value = false;
        isEmptyData.value = isEmpty(res);
      })
      .catch(err => {
        if (!isCancel(err)) {
          isLoading.value = false;
          isEmptyData.value = true;
        }
        console.warn(err);
      });
  };
  const setProps = (props: Partial<IMetricContentProps>) => {
    innerProps.value = { ...unref(innerProps), ...props };
  };
  // 设置加载
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const methods = {
    setProps,
    setLoading,
    getCommonParams,
    fetchData,
  };

  emits('register', methods);
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');
</style>
