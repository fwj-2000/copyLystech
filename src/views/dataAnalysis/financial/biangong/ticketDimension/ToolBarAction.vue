<!-- 操作按钮组 -->
<template>
  <!-- 原因分析 -->
  <a-button type="primary" @click="go('/dataAnalysis/financial/biangong/causeAnalysis')">原因分析</a-button>
</template>

<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
</script>
