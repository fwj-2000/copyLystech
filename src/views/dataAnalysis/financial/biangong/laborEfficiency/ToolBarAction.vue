<!-- 操作按钮组 -->
<template>
  <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" @click="handleGoPath(item)">
    {{ item.title }}
  </a-button>
</template>

<script lang="ts" setup>
  import { jumpButtonOptions } from './config';
  import { useGo } from '/@/hooks/web/usePage';

  import { IJumpButtonOption } from './types';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { isFunction } from 'lodash-es';

  interface IProps {
    formParams: Record<string, any>;
    searchFormValue: Record<string, any>;
  }
  const props = withDefaults(defineProps<IProps>(), {
    formParams: () => ({}),
    searchFormValue: () => ({}),
  });

  const go = useGo();
  const { goPath } = useRouteParams();

  const handleGoPath = (item: IJumpButtonOption) => {
    const { getPathUrl, getPathParams } = item;
    const path = getPathUrl();
    if (isFunction(getPathParams)) {
      const params = getPathParams(props.searchFormValue);
      goPath(path, params);
      return;
    }
    go(path);
  };
</script>
