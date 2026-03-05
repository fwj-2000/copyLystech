/*
封装的路由跳转参数传递

*/
import { computed, onUnmounted, ref } from 'vue';
import { useGo } from '/@/hooks/web/usePage';
import { createGlobalState } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { SHA256 } from 'crypto-js';

const useRouteParamsState = createGlobalState(() => {
  const routeParams = ref<Record<string, Record<string, any>>>({});

  // getters
  const params = computed(() => routeParams.value);

  // actions
  const setParams = (id: string, params: Record<string, any> = {}) => {
    routeParams.value[id] = params;
  };

  const deleteParamsById = (id: string) => {
    delete routeParams.value[id];
  };

  return { params, setParams, deleteParamsById };
});
function objectToHash(obj) {
  const jsonString = JSON.stringify(obj);
  const hash = SHA256(jsonString).toString();
  return hash;
}
export function useRouteParams() {
  let go: any = null;
  let route = useRoute();
  try {
    go = useGo();
  } catch {}
  const { params, setParams, deleteParamsById } = useRouteParamsState();

  const goPath = async (path: string, params: Record<string, any>) => {
    const id = await objectToHash(params);
    setParams(id, params);
    go?.(`${path}?paramsId=${id}`);
  };

  const getParams = () => {
    const id = route?.query?.paramsId as string;
    if (!id) {
      return {};
    }
    onUnmounted(() => {
      // 组件卸载清除内存路由参数
      deleteParamsById(id);
    });
    return params.value[id] || {};
  };

  return { getParams, goPath };
}
