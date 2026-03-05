<!-- 操作按钮组 -->
<template>
  <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" @click="go(item.getPathUrl())">
    {{ item.text }}
  </a-button>
</template>

<script lang="ts" setup>
  import { jumpButtonOptions } from './config';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
</script>
