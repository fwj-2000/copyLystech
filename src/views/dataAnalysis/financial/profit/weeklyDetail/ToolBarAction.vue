<!-- 操作按钮组 -->
<template>
  <!-- 同步数据 -->
  <a-popconfirm title="确认后将重新生成周损益底稿" @confirm="syncData">
    <a-button type="primary" :loading="syncLoading">同步数据</a-button>
  </a-popconfirm>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { syncWeekDailydata } from '/@/api/dataAnalysis/financial';

  const syncLoading = ref<boolean>(false);

  const { createMessage } = useMessage();
  // 同步数据
  const syncData = () => {
    syncLoading.value = true;
    syncWeekDailydata()
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
