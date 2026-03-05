<!-- 操作按钮组 -->
<template>
  <a-popconfirm title="确定同步" @confirm="syncData">
    <a-button type="primary" :loading="syncLoading">同步数据</a-button>
  </a-popconfirm>
  <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" @click="go(item.getPathUrl())">
    {{ item.text }}
  </a-button>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { jumpButtonOptions } from './config';
  import { useGo } from '/@/hooks/web/usePage';
  const syncLoading = ref<boolean>(false);
  import { dimensionSyncbgbase } from '/@/api/dataAnalysis/financial';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const go = useGo();
  const syncData = () => {
    syncLoading.value = true;
    dimensionSyncbgbase()
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
        } else {
          createMessage.error(res.msg);
        }
      })
      .finally(() => {
        syncLoading.value = false;
      });
  };
</script>
